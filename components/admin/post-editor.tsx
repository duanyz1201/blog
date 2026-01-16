"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
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
import { Bold, Italic, List, Code } from "lucide-react"

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
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "开始编写文章内容...",
      }),
    ],
    content: initialData?.content || "",
    editorProps: {
      attributes: {
        class: "prose prose-slate dark:prose-invert max-w-none min-h-[400px] p-4 focus:outline-none",
      },
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: editor?.getHTML() || "",
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
        <Label>内容 *</Label>
        <div className="border rounded-lg">
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
