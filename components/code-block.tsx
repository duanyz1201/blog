"use client"

import { useState, useRef, useEffect } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
  language?: string
}

// 递归提取文本内容
function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') {
    return node
  }
  if (typeof node === 'number') {
    return String(node)
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join('')
  }
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as any).props?.children || '')
  }
  return ''
}

export function CodeBlock({ children, className, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLElement>(null)
  const [lineCount, setLineCount] = useState(1)
  
  // 提取代码文本用于复制
  const codeString = extractText(children)
  
  // 计算行数
  useEffect(() => {
    if (codeRef.current) {
      const text = codeRef.current.textContent || codeString
      const lines = text.split('\n')
      // 如果最后一行是空的，不计入行数
      const count = lines[lines.length - 1] === '' ? lines.length - 1 : lines.length
      setLineCount(Math.max(count, 1))
    } else {
      // 如果没有 ref，使用 codeString 计算
      const lines = codeString.split('\n')
      const count = lines[lines.length - 1] === '' ? lines.length - 1 : lines.length
      setLineCount(Math.max(count, 1))
    }
  }, [children, codeString])

  const handleCopy = async () => {
    try {
      const textToCopy = codeRef.current?.textContent || codeString
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  return (
    <div className="relative group my-6">
      {/* 代码块容器 */}
      <div 
        className="relative rounded-lg overflow-hidden border border-blue-500/30 shadow-xl code-block-bg"
        style={{ backgroundColor: 'rgb(9, 28, 44)' }}
      >
        {/* 顶部栏（仅语言标签） */}
        {language && (
          <div 
            className="px-4 py-2 code-block-bg"
            style={{ backgroundColor: 'rgb(9, 28, 44)' }}
          >
            <span className="text-xs font-medium text-blue-400 uppercase tracking-wide">
              {language}
            </span>
          </div>
        )}

        {/* 代码内容区域 */}
        <div className="relative overflow-x-auto">
          {/* 复制按钮 - 位于代码块右上角 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="absolute top-2 right-2 z-10 h-7 px-2 text-xs text-slate-400 hover:text-white hover:bg-blue-500/20 transition-colors bg-[rgb(9,28,44)]/80 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(9, 28, 44, 0.8)' }}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1.5" />
                已复制
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                复制
              </>
            )}
          </Button>
          <div className="flex">
            {/* 行号列 */}
            <div className="flex-shrink-0 px-4 py-4 text-right select-none border-r border-blue-500/20">
              <div 
                className="text-xs text-slate-500 font-mono" 
                style={{ 
                  lineHeight: '1.5rem',
                  paddingTop: 0,
                  paddingBottom: 0,
                  display: 'block'
                }}
              >
                {Array.from({ length: lineCount }, (_, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      height: '1.5rem', 
                      lineHeight: '1.5rem',
                      display: 'block',
                      textAlign: 'right'
                    }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* 代码列 */}
            <div className="flex-1 min-w-0">
              <pre 
                className="m-0 overflow-x-auto bg-transparent"
                style={{ 
                  padding: '1rem',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  lineHeight: '1.5rem',
                  margin: 0
                }}
              >
                <code 
                  ref={codeRef}
                  className={`block text-sm font-mono ${className || ''}`}
                  style={{ 
                    lineHeight: '1.5rem',
                    display: 'block',
                    padding: 0,
                    margin: 0
                  }}
                  suppressHydrationWarning
                >
                  {children}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
