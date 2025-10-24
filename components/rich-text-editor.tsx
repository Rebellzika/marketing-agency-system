"use client"

import { useState, useRef } from "react"
import { Bold, Italic, Underline, Highlighter, Link2, ImageIcon, Video, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [showImageInput, setShowImageInput] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [showVideoInput, setShowVideoInput] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [highlightColor, setHighlightColor] = useState("#ffff00")

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleAddLink = () => {
    if (linkUrl) {
      executeCommand("createLink", linkUrl)
      setLinkUrl("")
      setShowLinkInput(false)
    }
  }

  const handleAddImage = () => {
    if (imageUrl) {
      const img = `<img src="${imageUrl}" alt="Imagem" style="max-width: 100%; height: auto; margin: 10px 0;" />`
      document.execCommand("insertHTML", false, img)
      setImageUrl("")
      setShowImageInput(false)
    }
  }

  const handleAddVideo = () => {
    if (videoUrl) {
      const video = `<div style="position: relative; display: none; margin: 10px 0;" class="video-container" data-video-url="${videoUrl}">
        <button type="button" onclick="this.parentElement.style.display = 'block'; this.style.display = 'none';" style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer;">👁️ Visualizar Vídeo</button>
        <iframe width="100%" height="400" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
      </div>`
      document.execCommand("insertHTML", false, video)
      setVideoUrl("")
      setShowVideoInput(false)
    }
  }

  const handleHighlight = () => {
    executeCommand("backColor", highlightColor)
  }

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-background border border-border rounded-t-md">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => executeCommand("bold")}
          className="gap-1"
          title="Negrito (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => executeCommand("italic")}
          className="gap-1"
          title="Itálico (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => executeCommand("underline")}
          className="gap-1"
          title="Sublinhado (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </Button>

        <div className="w-px bg-border" />

        <div className="flex items-center gap-1">
          <input
            type="color"
            value={highlightColor}
            onChange={(e) => setHighlightColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
            title="Cor de destaque"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleHighlight}
            className="gap-1 bg-transparent"
            title="Destacar texto"
          >
            <Highlighter className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-px bg-border" />

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className="gap-1"
          title="Adicionar link"
        >
          <Link2 className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setShowImageInput(!showImageInput)}
          className="gap-1"
          title="Adicionar imagem"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setShowVideoInput(!showVideoInput)}
          className="gap-1"
          title="Adicionar vídeo"
        >
          <Video className="w-4 h-4" />
        </Button>

        <div className="w-px bg-border" />

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => executeCommand("removeFormat")}
          className="gap-1"
          title="Remover formatação"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Inputs auxiliares */}
      {showLinkInput && (
        <div className="flex gap-2 p-2 bg-background border border-border border-t-0">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://exemplo.com"
            className="flex-1 h-8 rounded border border-border bg-card px-2 text-sm text-foreground"
          />
          <Button type="button" size="sm" onClick={handleAddLink}>
            Adicionar
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setShowLinkInput(false)}>
            Cancelar
          </Button>
        </div>
      )}

      {showImageInput && (
        <div className="flex gap-2 p-2 bg-background border border-border border-t-0">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://exemplo.com/imagem.jpg"
            className="flex-1 h-8 rounded border border-border bg-card px-2 text-sm text-foreground"
          />
          <Button type="button" size="sm" onClick={handleAddImage}>
            Adicionar
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setShowImageInput(false)}>
            Cancelar
          </Button>
        </div>
      )}

      {showVideoInput && (
        <div className="flex gap-2 p-2 bg-background border border-border border-t-0">
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/embed/..."
            className="flex-1 h-8 rounded border border-border bg-card px-2 text-sm text-foreground"
          />
          <Button type="button" size="sm" onClick={handleAddVideo}>
            Adicionar
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setShowVideoInput(false)}>
            Cancelar
          </Button>
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        suppressContentEditableWarning
        className="w-full min-h-96 p-4 bg-background border border-border border-t-0 rounded-b-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  )
}
