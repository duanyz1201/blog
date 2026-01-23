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
    <div className="relative group my-3">
      {/* 代码块容器 */}
      <div 
        className="relative rounded-lg overflow-hidden border border-blue-500/30 shadow-xl code-block-bg"
        style={{ backgroundColor: 'rgb(9, 28, 44)' }}
      >
        {/* 顶部栏（语言标签和复制按钮） */}
        <div 
          className="relative flex items-center justify-between px-4 py-1.5 border-b border-blue-500/20 code-block-bg"
          style={{ backgroundColor: 'rgb(9, 28, 44)' }}
        >
          {language && (
            <span className="text-xs font-medium text-blue-400 tracking-wide">
              {language.toLowerCase()}
            </span>
          )}
          {/* 复制按钮 - 移到顶部栏右侧 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-6 px-2 text-xs text-slate-400 hover:text-white hover:bg-blue-500/20 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                已复制
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                复制
              </>
            )}
          </Button>
        </div>

        {/* 代码内容区域 */}
        <div className="relative overflow-x-auto">
          <div className="flex">
            {/* 行号列 */}
            <div className="flex-shrink-0 px-4 py-2 text-right select-none border-r border-blue-500/20">
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
                  padding: '0.5rem 1rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
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
