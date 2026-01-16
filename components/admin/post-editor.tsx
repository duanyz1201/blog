"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { Markdown } from "@tiptap/markdown"
import CodeBlock from "@tiptap/extension-code-block"
import { nodeInputRule } from "@tiptap/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bold, Italic, List, Code, FileText, Eye } from "lucide-react"
import { useState, useEffect, useRef } from "react"

// 自定义 CodeBlock 扩展：支持 ```bash 直接创建代码块（不需要空格）
const CustomCodeBlock = CodeBlock.extend({
  addInputRules() {
    return [
      // 匹配 ```bash 或 ```bash␠（带或不带空格）
      nodeInputRule({
        find: /^```([a-zA-Z0-9#+-]*)\s?$/,
        type: this.type,
        getAttributes: (match) => {
          const [, lang] = match
          return { language: lang || null }
        },
      }),
    ]
  },
})

type PostEditorProps = {
  initialData?: {
    title: string
    slug: string
    content: string
    excerpt: string | null
    cover: string | null
    status: string
    categoryIds: string[]
    tagIds: string[]
  }
  categories: Array<{ id: string; name: string }>
  tags: Array<{ id: string; name: string }>
  onSubmit: (data: any) => Promise<void>
  isSubmitting?: boolean
}

export function PostEditor({
  initialData,
  categories,
  tags,
  onSubmit,
  isSubmitting = false,
}: PostEditorProps) {
  // 添加 Markdown 源代码编辑模式状态
  const [isMarkdownMode, setIsMarkdownMode] = useState(false)
  // 保存原始的 Markdown 源代码，避免格式丢失
  const originalMarkdownRef = useRef(initialData?.content || "")
  const [markdownSource, setMarkdownSource] = useState(initialData?.content || "")
  // 标记是否在可视化模式下进行了编辑
  const hasVisualEditRef = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // 禁用默认的 CodeBlock，使用自定义版本
        codeBlock: false,
      }),
      CustomCodeBlock.configure({
        HTMLAttributes: {
          class: 'hljs',
        },
      }),
      Markdown.configure({
        // 确保 Markdown 扩展正确处理代码块
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
        // 使用 GitHub Flavored Markdown 以更好地处理代码块等格式
        transformCopiedHTML: false,
      }),
      Placeholder.configure({
        placeholder: "开始编写文章内容...",
      }),
    ],
    content: initialData?.content || "",
    contentType: 'markdown',
    immediatelyRender: false,
    onUpdate: () => {
      // 标记在可视化模式下进行了编辑
      if (!isMarkdownMode) {
        hasVisualEditRef.current = true
      }
    },
    editorProps: {
      attributes: {
        class: "prose prose-slate dark:prose-invert max-w-none min-h-[400px] p-4 focus:outline-none",
      },
    },
  })

  // 切换 Markdown 源代码模式
  const toggleMarkdownMode = () => {
    if (isMarkdownMode) {
      // 从源代码模式切换到可视化模式
      // 使用用户编辑的源代码，而不是重新序列化
      const newSource = markdownSource.trim()
      // 更新原始引用
      originalMarkdownRef.current = newSource
      hasVisualEditRef.current = false
      // 使用更可靠的方式设置内容
      if (editor) {
        // 直接使用 setContent 设置 Markdown 内容
        // 注意：setContent 的第二个参数是选项对象，包含 contentType 和 emitUpdate
        try {
          editor.commands.setContent(newSource, { 
            contentType: 'markdown',
            emitUpdate: false  // 避免触发 onUpdate
          })
        } catch (error) {
          console.error('Error setting content:', error)
          // 如果出错，尝试使用 HTML 方式（作为后备）
          editor.commands.setContent(newSource, { emitUpdate: false })
        }
      }
      setIsMarkdownMode(false)
    } else {
      // 从可视化模式切换到源代码模式
      // 如果用户在可视化模式下进行了编辑，才从编辑器获取 Markdown
      // 否则使用保存的原始源代码
      if (hasVisualEditRef.current) {
        const currentMarkdown = editor?.getMarkdown() || ""
        setMarkdownSource(currentMarkdown)
        originalMarkdownRef.current = currentMarkdown
        hasVisualEditRef.current = false
      } else {
        // 使用保存的原始源代码
        setMarkdownSource(originalMarkdownRef.current)
      }
      setIsMarkdownMode(true)
    }
  }

  // 当 markdownSource 在源代码模式下更新时，同步更新原始引用
  useEffect(() => {
    if (isMarkdownMode) {
      originalMarkdownRef.current = markdownSource
    }
  }, [markdownSource, isMarkdownMode])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // 如果在 Markdown 源代码模式，使用源代码；否则使用编辑器的 Markdown
    const content = isMarkdownMode 
      ? markdownSource 
      : (editor?.getMarkdown() || editor?.getHTML() || "")
    
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: content,
      excerpt: formData.get("excerpt") as string || null,
      cover: formData.get("cover") as string || null,
      status: formData.get("status") as string,
      categoryIds: formData.getAll("categories") as string[],
      tagIds: formData.getAll("tags") as string[],
    }

    await onSubmit(data)
  }

  if (!editor) {
    return <div>加载编辑器...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">标题 *</Label>
        <Input
          id="title"
          name="title"
          defaultValue={initialData?.title}
          required
          placeholder="文章标题"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL 别名 *</Label>
        <Input
          id="slug"
          name="slug"
          defaultValue={initialData?.slug}
          required
          placeholder="article-url-slug"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>内容 *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleMarkdownMode}
            className="flex items-center gap-2"
          >
            {isMarkdownMode ? (
              <>
                <Eye className="h-4 w-4" />
                可视化模式
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Markdown 源代码
              </>
            )}
          </Button>
        </div>
        <div className="border rounded-lg">
          {isMarkdownMode ? (
            // Markdown 源代码编辑模式
            <Textarea
              value={markdownSource}
              onChange={(e) => setMarkdownSource(e.target.value)}
              placeholder={`输入 Markdown 格式内容，例如：

\`\`\`bash
echo 'Hello World'
\`\`\``}
              className="min-h-[400px] font-mono text-sm resize-none border-0 focus-visible:ring-0"
              style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace' }}
            />
          ) : (
            // 可视化编辑模式
            <>
              <div className="border-b p-2 flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive("bold") ? "bg-accent" : ""}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive("italic") ? "bg-accent" : ""}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={editor.isActive("bulletList") ? "bg-accent" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  className={editor.isActive("codeBlock") ? "bg-accent" : ""}
                >
                  <Code className="h-4 w-4" />
                </Button>
              </div>
              <EditorContent editor={editor} />
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">摘要</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          defaultValue={initialData?.excerpt || ""}
          placeholder="文章摘要（可选）"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover">封面图片 URL</Label>
        <Input
          id="cover"
          name="cover"
          type="url"
          defaultValue={initialData?.cover || ""}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">状态 *</Label>
          <Select name="status" defaultValue={initialData?.status || "DRAFT"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PUBLISHED">已发布</SelectItem>
              <SelectItem value="DRAFT">草稿</SelectItem>
              <SelectItem value="PRIVATE">私密</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>分类</Label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="categories"
                value={category.id}
                defaultChecked={initialData?.categoryIds?.includes(category.id)}
                className="rounded"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>标签</Label>
        <div className="grid grid-cols-2 gap-2">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="tags"
                value={tag.id}
                defaultChecked={initialData?.tagIds?.includes(tag.id)}
                className="rounded"
              />
              <span className="text-sm">{tag.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : "保存"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href="/admin/posts">取消</a>
        </Button>
      </div>
    </form>
  )
}
