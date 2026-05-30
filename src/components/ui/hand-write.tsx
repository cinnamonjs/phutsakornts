"use client"

import { motion } from "framer-motion"
import { parse as opentypeParse } from "opentype.js"
import { useEffect, useId, useRef, useState } from "react"

interface HandwrittenTextProps {
  text: string
  fontUrl: string
  fontSize?: number
  strokeWidth?: number
  className?: string
  gradient?: {
    from: string
    to: string
    direction?: "horizontal" | "vertical"
  }
  delay?: number
  duration?: number
  stagger?: number
  onComplete?: () => void
}

interface PathData {
  d: string
  width: number
}

export function HandwriteText({
  text,
  fontUrl,
  fontSize = 72,
  strokeWidth = 1.5,
  className = "",
  gradient,
  delay = 0,
  duration = 2,
  stagger = 0.03,
  onComplete,
}: HandwrittenTextProps) {
  const [paths, setPaths] = useState<PathData[]>([])
  const [viewBox, setViewBox] = useState("0 0 100 100")
  const [isLoaded, setIsLoaded] = useState(false)
  const gradientId = useId()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    async function loadFont() {
      try {
        const response = await fetch(fontUrl)
        if (!response.ok) throw new Error(`Font fetch failed: ${response.status}`)
        const buffer = await response.arrayBuffer()
        const font = opentypeParse(buffer)
        if (cancelled) return

        const glyphPaths: PathData[] = []
        let x = 0
        const scale = fontSize / font.unitsPerEm

        // Get font metrics
        const ascender = font.ascender * scale
        const descender = font.descender * scale
        const height = ascender - descender

        // Convert each character to path
        for (let i = 0; i < text.length; i++) {
          const char = text[i]
          const glyph = font.charToGlyph(char)

          if (glyph?.path) {
            const path = glyph.getPath(x, ascender, fontSize)
            const pathData = path.toPathData(2)

            if (pathData && pathData.length > 0) {
              glyphPaths.push({
                d: pathData,
                width: (glyph.advanceWidth || 0) * scale
              })
            }

            x += (glyph.advanceWidth || 0) * scale
          }
        }

        if (cancelled) return

        // Add padding
        const padding = fontSize * 0.15
        const totalWidth = x + padding * 2
        const totalHeight = height + padding * 2

        setViewBox(`${-padding} ${-padding} ${totalWidth} ${totalHeight}`)
        setPaths(glyphPaths)
        setIsLoaded(true)
      } catch (error) {
        console.error("Failed to load font:", error)
      }
    }

    loadFont()

    return () => {
      cancelled = true
    }
  }, [text, fontUrl, fontSize])

  if (!isLoaded || paths.length === 0) {
    return <div ref={containerRef} className={className} style={{ minHeight: fontSize * 1.2 }} />
  }

  const totalPaths = paths.length
  const pathDuration = duration / totalPaths

  return (
    <div ref={containerRef} className={className}>
      <svg
        viewBox={viewBox}
        fill="none"
        className="w-full h-auto"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>text</title>
        {gradient && (
          <defs>
            <linearGradient
              id={gradientId}
              x1={gradient.direction === "vertical" ? "0%" : "0%"}
              y1={gradient.direction === "vertical" ? "0%" : "0%"}
              x2={gradient.direction === "vertical" ? "0%" : "100%"}
              y2={gradient.direction === "vertical" ? "100%" : "0%"}
            >
              <stop offset="0%" stopColor={gradient.from} />
              <stop offset="100%" stopColor={gradient.to} />
            </linearGradient>
          </defs>
        )}

        {paths.map((pathData, index) => (
          <motion.path
            key={index}
            d={pathData.d}
            stroke={gradient ? `url(#${gradientId})` : "currentColor"}
            strokeWidth={strokeWidth}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: pathDuration,
              delay: delay + index * stagger,
              ease: [0.45, 0, 0.2, 1],
            }}
            onAnimationComplete={
              index === paths.length - 1 ? onComplete : undefined
            }
          />
        ))}

        {/* Fill layer that fades in after stroke */}
        {paths.map((pathData, index) => (
          <motion.path
            key={`fill-${index}`}
            d={pathData.d}
            fill={gradient ? `url(#${gradientId})` : "currentColor"}
            stroke="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.3,
              delay: delay + index * stagger + pathDuration * 0.7,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          />
        ))}
      </svg>
    </div>
  )
}
