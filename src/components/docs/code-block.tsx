import { useState } from 'react'

import { cn } from '#/lib/utils'
import { m } from '#/paraglide/messages'

export interface CodeBlockProps {
  code: string
  filename?: string
  className?: string
}

export function CodeBlock({ code, filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div
      className={cn(
        'overflow-hidden border border-rule bg-secondary',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
        <span className="kicker text-ink-muted">
          {filename ?? m.docs_usage()}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="kicker text-ink-muted transition-colors hover:text-ink"
        >
          {copied ? m.docs_copied() : m.docs_copy()}
        </button>
      </div>
      <pre className="max-h-112 overflow-auto p-4 text-ink">
        <code>{code}</code>
      </pre>
    </div>
  )
}
