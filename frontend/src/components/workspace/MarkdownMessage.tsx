import React, { useState } from 'react'
import { Check, Copy, Code2 } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface MarkdownMessageProps {
  content: string
  className?: string
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content, className }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Parse code blocks vs markdown paragraphs
  const renderFormattedContent = () => {
    const parts = content.split(/(```[\s\S]*?```)/g)

    return parts.map((part, index) => {
      // Check if code block
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n')
        const language = lines[0].trim() || 'python'
        const code = (lines.length > 1 && !lines[0].includes(' ') ? lines.slice(1) : lines).join('\n')

        return (
          <div
            key={`code-${index}`}
            className="my-3 rounded-[8px] border border-[#ebebeb] bg-[#fafafa] overflow-hidden font-mono text-xs"
          >
            {/* Code Header */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-white border-b border-[#ebebeb] text-[11px] text-[#8f8f8f]">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-[#171717]">
                <Code2 className="w-3.5 h-3.5" />
                {language}
              </span>
              <button
                type="button"
                onClick={() => handleCopyCode(code, index)}
                className="flex items-center gap-1 text-[#8f8f8f] hover:text-[#171717] transition-colors cursor-pointer"
                title="Copy code"
              >
                {copiedIndex === index ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 text-[10px]">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[10px]">COPY</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <pre className="p-3 text-[#171717] overflow-x-auto leading-relaxed bg-[#fafafa]">
              <code>{code}</code>
            </pre>
          </div>
        )
      }

      // Render standard markdown text line by line
      const lines = part.split('\n')
      return (
        <div key={`text-${index}`} className="space-y-1.5 font-sans leading-relaxed text-sm text-[#171717]">
          {lines.map((line, lIdx) => {
            if (!line.trim()) return <div key={lIdx} className="h-1" />

            // Heading 3
            if (line.startsWith('### ')) {
              return (
                <h3 key={lIdx} className="text-sm font-semibold tracking-tight text-[#171717] mt-3 mb-1 font-sans">
                  {renderInlineFormatting(line.slice(4))}
                </h3>
              )
            }

            // Heading 4
            if (line.startsWith('#### ')) {
              return (
                <h4 key={lIdx} className="text-xs font-semibold text-[#171717] mt-2 mb-1 uppercase font-sans">
                  {renderInlineFormatting(line.slice(5))}
                </h4>
              )
            }

            // Bullet List
            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-2">
                  <span className="text-[#171717] mt-1 text-xs">•</span>
                  <span>{renderInlineFormatting(line.trim().slice(2))}</span>
                </div>
              )
            }

            // Numbered List
            const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/)
            if (numMatch) {
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-2 text-xs">
                  <span className="text-[#171717] font-semibold font-mono">{numMatch[1]}.</span>
                  <span className="font-sans text-sm">{renderInlineFormatting(numMatch[2])}</span>
                </div>
              )
            }

            return <p key={lIdx}>{renderInlineFormatting(line)}</p>
          })}
        </div>
      )
    })
  }

  // Parse inline bold, italic, and inline code
  const renderInlineFormatting = (text: string) => {
    const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)

    return tokens.map((token, i) => {
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded-[4px] bg-[#f5f5f5] border border-[#ebebeb] text-[#171717] font-mono text-[11px]"
          >
            {token.slice(1, -1)}
          </code>
        )
      }
      if (token.startsWith('**') && token.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-[#171717]">
            {token.slice(2, -2)}
          </strong>
        )
      }
      return token
    })
  }

  return (
    <div className={cn('space-y-2', className)}>
      {renderFormattedContent()}
    </div>
  )
}
