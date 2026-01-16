"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { CodeBlock } from "./code-block"
import "highlight.js/styles/github-dark.css"

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true }]]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "")
            const language = match ? match[1] : undefined
            
            // 代码块（多行）
            if (!inline) {
              // rehypeHighlight 会将代码转换为带有高亮类的 HTML
              // children 可能包含 React 元素（高亮后的 HTML）
              return (
                <CodeBlock className={className} language={language} {...props}>
                  {children}
                </CodeBlock>
              )
            }
            
            // 行内代码
            return (
              <code 
                className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sm font-mono text-slate-800 dark:text-slate-200" 
                {...props}
              >
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
