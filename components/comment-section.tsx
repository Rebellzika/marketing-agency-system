"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageSquare, Send, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Comment {
  id: string
  text: string
  authorId: string
  authorName: string
  createdAt: Date
}

interface CommentSectionProps {
  projectId: string
}

export function CommentSection({ projectId }: CommentSectionProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    loadComments()
  }, [projectId])

  const loadComments = async () => {
    try {
      const commentsRef = collection(db, "projects", projectId, "comments")
      const q = query(commentsRef, orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as Comment[]

      setComments(commentsData)
    } catch (error) {
      console.error("Erro ao carregar comentários:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) {
      toast({
        title: "Erro",
        description: "Escreva um comentário",
      })
      return
    }

    setSubmitting(true)

    try {
      const commentsRef = collection(db, "projects", projectId, "comments")
      await addDoc(commentsRef, {
        text: newComment,
        authorId: user?.uid,
        authorName: user?.name,
        createdAt: serverTimestamp(),
      })

      toast({
        title: "Sucesso",
        description: "Comentário adicionado",
      })

      setNewComment("")
      loadComments()
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error)
      toast({
        title: "Erro",
        description: "Erro ao adicionar comentário",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Tem certeza que deseja deletar este comentário?")) return

    try {
      await deleteDoc(doc(db, "projects", projectId, "comments", commentId))

      toast({
        title: "Sucesso",
        description: "Comentário deletado",
      })

      loadComments()
    } catch (error) {
      console.error("Erro ao deletar comentário:", error)
      toast({
        title: "Erro",
        description: "Erro ao deletar comentário",
      })
    }
  }

  return (
    <Card className="bg-card border-border p-6">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        Comentários ({comments.length})
      </h3>

      {/* Formulário de Novo Comentário */}
      <form onSubmit={handleAddComment} className="mb-6 space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Adicione um comentário..."
          className="w-full h-20 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
        <Button type="submit" disabled={submitting} className="gap-2">
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Enviar Comentário
        </Button>
      </form>

      {/* Lista de Comentários */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <p className="text-sm text-muted">Carregando comentários...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted">Nenhum comentário ainda</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-background p-3 rounded border border-border">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-foreground text-sm">{comment.authorName}</p>
                  <p className="text-xs text-muted">{comment.createdAt.toLocaleString("pt-BR")}</p>
                </div>
                {user?.uid === comment.authorId && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-error"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
              <p className="text-sm text-foreground">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
