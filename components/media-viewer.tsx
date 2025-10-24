"use client"

import { useState } from "react"
import { Eye, EyeOff, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MediaViewerProps {
  url: string
  type: "image" | "video"
  alt?: string
}

export function MediaViewer({ url, type, alt = "Mídia" }: MediaViewerProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" size="sm" onClick={() => setIsVisible(!isVisible)} className="gap-2">
        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        {isVisible ? "Ocultar" : "Visualizar"} {type === "image" ? "Imagem" : "Vídeo"}
      </Button>

      {isVisible && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full max-h-96">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 z-10"
            >
              <X className="w-4 h-4" />
            </Button>

            {type === "image" ? (
              <img src={url || "/placeholder.svg"} alt={alt} className="w-full h-auto rounded-lg" />
            ) : (
              <iframe src={url} title={alt} className="w-full h-96 rounded-lg" allowFullScreen frameBorder="0" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
