"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { CodeBlock } from "./code-block"
import "highlight.js/styles/github-dark.css"

// 检测内容是否为 HTML
function isHTML(content: string): boolean {
  // 简单的 HTML 检测：如果包含 HTML 标签，则认为是 HTML
  return /<[a-z][\s\S]*>/i.test(content.trim())
}

// 将 HTML 转换为 Markdown（简单转换，主要用于代码块）
function htmlToMarkdown(html: string): string {
  // 如果已经是 Markdown 格式（包含 ```），直接返回
  if (html.includes('```')) {
    return html
  }
  
  // 处理代码块：<pre><code class="language-xxx">...</code></pre> 或 <pre><code class="hljs language-xxx">...</code></pre>
  let markdown = html
  
  // 替换 <pre><code> 为 Markdown 代码块（支持多种格式）
  markdown = markdown.replace(
    /<pre[^>]*><code(?:\s+class=["'](?:hljs\s+)?language-(\w+)[^"']*["'])?[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
    (match, lang, code) => {
      const language = lang || ''
      const codeContent = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/<[^>]+>/g, '') // 移除代码中的 HTML 标签（如高亮标签）
        .trim()
      return `\`\`\`${language}\n${codeContent}\n\`\`\``
    }
  )
  
  // 处理单独的 <pre> 标签（没有 <code> 包裹）
  markdown = markdown.replace(
    /<pre[^>]*>([\s\S]*?)<\/pre>/gi,
    (match, code) => {
      const codeContent = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/<[^>]+>/g, '')
        .trim()
      return `\`\`\`\n${codeContent}\n\`\`\``
    }
  )
  
  // 处理行内代码：<code>...</code>
  markdown = markdown.replace(
    /<code[^>]*>([\s\S]*?)<\/code>/gi,
    (match, code) => {
      const codeContent = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
      return `\`${codeContent}\``
    }
  )
  
  // 处理标题
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n')
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n')
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n')
  
  // 处理段落
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
  
  // 处理列表
  markdown = markdown.replace(/<ul[^>]*>/gi, '\n')
  markdown = markdown.replace(/<\/ul>/gi, '\n')
  markdown = markdown.replace(/<ol[^>]*>/gi, '\n')
  markdown = markdown.replace(/<\/ol>/gi, '\n')
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
  
  // 处理粗体和斜体
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
  
  // 处理链接
  markdown = markdown.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
  
  // 移除其他 HTML 标签，保留文本内容
  markdown = markdown.replace(/<[^>]+>/g, '')
  
  // 解码 HTML 实体
  markdown = markdown
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
  
  return markdown.trim()
}

export function MarkdownContent({ content }: { content: string }) {
  // 检测并转换内容格式
  let markdownContent = content
  
  if (isHTML(content)) {
    // 如果是 HTML，转换为 Markdown
    markdownContent = htmlToMarkdown(content)
  }
  
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
        {markdownContent}
      </ReactMarkdown>
    </div>
  )
}
