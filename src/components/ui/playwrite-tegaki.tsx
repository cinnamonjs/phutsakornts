'use client'

import { createBundle, TegakiRenderer, type TegakiBundle, type TegakiGlyphData } from 'tegaki/react'
import { useEffect, useState } from 'react'

type Point = [number, number, number]

type PathCommand = {
  type: 'M' | 'L' | 'Q' | 'C' | 'Z'
  x: number
  y: number
  x1?: number
  y1?: number
  x2?: number
  y2?: number
}

type OpenTypeFont = {
  unitsPerEm: number
  ascender: number
  descender: number
  charToGlyph: (char: string) => {
    advanceWidth?: number
    getPath: (x: number, y: number, fontSize: number) => { commands: PathCommand[] }
  }
}

type OpenTypeModule = {
  parse?: (buffer: ArrayBuffer) => OpenTypeFont
  default?: { parse: (buffer: ArrayBuffer) => OpenTypeFont }
}

const PLAYWRITE_FONT_URL = '/assets/playwrite-ie.ttf'
const STROKE_WIDTH = 34

function distance(a: Point, b: Point) {
  return Math.hypot(b[0] - a[0], b[1] - a[1])
}

function appendLine(points: Point[], x: number, y: number) {
  const previous = points.at(-1)
  if (!previous || previous[0] !== x || previous[1] !== y) {
    points.push([x, y, STROKE_WIDTH])
  }
}

function appendQuadratic(points: Point[], from: Point, command: PathCommand) {
  const controlX = command.x1 ?? from[0]
  const controlY = command.y1 ?? from[1]
  for (let step = 1; step <= 8; step += 1) {
    const t = step / 8
    const oneMinusT = 1 - t
    appendLine(
      points,
      oneMinusT * oneMinusT * from[0] + 2 * oneMinusT * t * controlX + t * t * command.x,
      oneMinusT * oneMinusT * from[1] + 2 * oneMinusT * t * controlY + t * t * command.y,
    )
  }
}

function appendCubic(points: Point[], from: Point, command: PathCommand) {
  const control1X = command.x1 ?? from[0]
  const control1Y = command.y1 ?? from[1]
  const control2X = command.x2 ?? command.x
  const control2Y = command.y2 ?? command.y
  for (let step = 1; step <= 10; step += 1) {
    const t = step / 10
    const oneMinusT = 1 - t
    appendLine(
      points,
      oneMinusT ** 3 * from[0] + 3 * oneMinusT ** 2 * t * control1X + 3 * oneMinusT * t ** 2 * control2X + t ** 3 * command.x,
      oneMinusT ** 3 * from[1] + 3 * oneMinusT ** 2 * t * control1Y + 3 * oneMinusT * t ** 2 * control2Y + t ** 3 * command.y,
    )
  }
}

function createGlyphData(font: OpenTypeFont, text: string): Record<string, TegakiGlyphData> {
  const glyphData: Record<string, TegakiGlyphData> = {}

  for (const char of new Set(Array.from(text))) {
    const glyph = font.charToGlyph(char)
    const path = glyph.getPath(0, 0, font.unitsPerEm)
    const strokes: Point[][] = []
    let current: Point[] = []
    let start: Point | undefined

    const finishStroke = () => {
      if (current.length > 1) strokes.push(current)
      current = []
      start = undefined
    }

    for (const command of path.commands) {
      if (command.type === 'M') {
        finishStroke()
        current = [[command.x, command.y, STROKE_WIDTH]]
        start = current[0]
      } else if (command.type === 'L') {
        appendLine(current, command.x, command.y)
      } else if (command.type === 'Q') {
        appendQuadratic(current, current.at(-1) ?? [command.x, command.y, STROKE_WIDTH], command)
      } else if (command.type === 'C') {
        appendCubic(current, current.at(-1) ?? [command.x, command.y, STROKE_WIDTH], command)
      } else if (command.type === 'Z' && start) {
        appendLine(current, start[0], start[1])
        finishStroke()
      }
    }
    finishStroke()

    const lengths = strokes.map((stroke) => stroke.slice(1).reduce((total, point, index) => total + distance(stroke[index]!, point), 0))
    const totalLength = lengths.reduce((total, length) => total + length, 0)
    const totalDuration = char === ' ' ? 0 : Math.max(0.13, Math.min(0.28, 0.12 + totalLength / 24000))
    let elapsed = 0

    glyphData[char] = {
      w: glyph.advanceWidth ?? font.unitsPerEm * 0.5,
      t: totalDuration,
      s: strokes.map((stroke, index) => {
        const strokeDuration = totalLength > 0 ? Math.max(0.035, (lengths[index]! / totalLength) * totalDuration) : totalDuration
        const result = { p: stroke, d: elapsed, a: strokeDuration }
        elapsed += strokeDuration
        return result
      }),
    }
  }

  return glyphData
}

export function PlaywriteTegakiText({
  text,
  className,
  onComplete,
}: {
  text: string
  className?: string
  onComplete?: () => void
}) {
  const [bundle, setBundle] = useState<TegakiBundle | null>(null)
  const [complete, setComplete] = useState(false)
  const [drawProgress, setDrawProgress] = useState(0)

  useEffect(() => {
    let cancelled = false
    setComplete(false)

    async function loadBundle() {
      try {
        const module = (await import('opentype.js')) as unknown as OpenTypeModule
        const parse = module.parse ?? module.default?.parse
        if (!parse) throw new Error('OpenType parser is unavailable')

        const response = await fetch(PLAYWRITE_FONT_URL)
        if (!response.ok) throw new Error(`Playwrite IE font fetch failed: ${response.status}`)
        const font = parse(await response.arrayBuffer())
        if (cancelled) return

        setBundle(
          createBundle({
            family: 'Playwrite IE',
            fontUrl: PLAYWRITE_FONT_URL,
            glyphData: createGlyphData(font, text),
            unitsPerEm: font.unitsPerEm,
            ascender: font.ascender,
            descender: font.descender,
            lineCap: 'round',
          }),
        )
      } catch (error) {
        console.error('Failed to prepare Playwrite IE handwriting animation:', error)
      }
    }

    loadBundle()
    return () => {
      cancelled = true
    }
  }, [text])

  useEffect(() => {
    if (!bundle) return

    let frame = 0
    let startTime = 0
    const duration = 3200

    setDrawProgress(0)
    setComplete(false)

    const draw = (time: number) => {
      if (!startTime) startTime = time
      const nextProgress = Math.min(1, (time - startTime) / duration)
      setDrawProgress(nextProgress)

      if (nextProgress < 1) {
        frame = requestAnimationFrame(draw)
      } else {
        setComplete(true)
        onComplete?.()
      }
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [bundle, onComplete, text])

  if (!bundle) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className="relative block">
      <span className="sr-only">{text}</span>
      <TegakiRenderer
        aria-hidden="true"
        className={`${className ?? ''} transition-opacity duration-500 ${complete ? 'opacity-0' : 'opacity-100'}`}
        font={bundle}
        time={{ mode: 'controlled', value: drawProgress, unit: 'progress' }}
        effects={{
          pressureWidth: { strength: 0.38 },
          taper: { startLength: 0.08, endLength: 0.12 },
        }}
        quality={{ pixelRatio: 1.5, smoothing: true, segmentSize: 2 }}
      >
        {text}
      </TegakiRenderer>
      <span
        aria-hidden="true"
        className={`${className ?? ''} pointer-events-none absolute inset-0 transition-opacity duration-500 ${complete ? 'opacity-100' : 'opacity-0'}`}
      >
        {text}
      </span>
    </span>
  )
}
