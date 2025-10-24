"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/firebase"
import { collection, query, getDocs, doc, updateDoc, setDoc, serverTimestamp, where } from "firebase/firestore"
import { CheckCircle2, XCircle, Clock, MessageSquare, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Review {
  id: string
  projectId: string
  projectTitle: string
  status: "pending" | "approved" | "rejected"
  submittedBy: string
  submittedByName: string
  reviewedBy?: string
  reviewedByName?: string
  comments: string
  createdAt: Date
  updatedAt: Date
}

export default function ReviewsPage() {
  const { user, hasPermission } = useAuth()
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [reviewComment, setReviewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const reviewsRef = collection(db, "reviews")
      let q

      if (hasPermission("view_reviews")) {
        q = query(reviewsRef)
      } else {
        q = query(reviewsRef, where("submittedBy", "==", user?.uid))
      }

      const snapshot = await getDocs(q)
      const reviewsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      })) as Review[]

      setReviews(reviewsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
    } catch (error) {
      console.error("Erro ao carregar revisões:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as revisões",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApproveReview = async (review: Review) => {
    setSubmitting(true)

    try {
      await updateDoc(doc(db, "reviews", review.id), {
        status: "approved",
        reviewedBy: user?.uid,
        reviewedByName: user?.name,
        comments: reviewComment,
        updatedAt: serverTimestamp(),
      })

      // Atualizar status do projeto para aprovado
      await updateDoc(doc(db, "projects", review.projectId), {
        status: "approved",
        updatedAt: serverTimestamp(),
      })

      // Criar entrada no histórico de projetos aprovados
      await setDoc(doc(db, "approved-projects", `${review.projectId}-${Date.now()}`), {
        projectId: review.projectId,
        projectTitle: review.projectTitle,
        approvedBy: user?.uid,
        approvedByName: user?.name,
        approvedAt: serverTimestamp(),
      })

      toast({
        title: "Sucesso",
        description: "Projeto aprovado com sucesso",
      })

      setReviewComment("")
      setSelectedReview(null)
      loadReviews()
    } catch (error) {
      console.error("Erro ao aprovar revisão:", error)
      toast({
        title: "Erro",
        description: "Erro ao aprovar revisão",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleRejectReview = async (review: Review) => {
    setSubmitting(true)

    try {
      await updateDoc(doc(db, "reviews", review.id), {
        status: "rejected",
        reviewedBy: user?.uid,
        reviewedByName: user?.name,
        comments: reviewComment,
        updatedAt: serverTimestamp(),
      })

      toast({
        title: "Sucesso",
        description: "Projeto rejeitado. Feedback enviado ao autor.",
      })

      setReviewComment("")
      setSelectedReview(null)
      loadReviews()
    } catch (error) {
      console.error("Erro ao rejeitar revisão:", error)
      toast({
        title: "Erro",
        description: "Erro ao rejeitar revisão",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitForReview = async (projectId: string) => {
    try {
      await setDoc(doc(db, "reviews", `review-${projectId}-${Date.now()}`), {
        projectId,
        projectTitle: "Projeto",
        status: "pending",
        submittedBy: user?.uid,
        submittedByName: user?.name,
        comments: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      toast({
        title: "Sucesso",
        description: "Projeto enviado para revisão",
      })

      loadReviews()
    } catch (error) {
      console.error("Erro ao enviar para revisão:", error)
      toast({
        title: "Erro",
        description: "Erro ao enviar para revisão",
      })
    }
  }

  const filteredReviews = filterStatus === "all" ? reviews : reviews.filter((r) => r.status === filterStatus)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Revisões de Projetos</h1>
        <p className="text-muted">Gerencie e revise os projetos enviados</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved", "rejected"] as const).map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? "default" : "outline"}
            onClick={() => setFilterStatus(status)}
            className="gap-2"
          >
            {status === "all" && "Todos"}
            {status === "pending" && <Clock className="w-4 h-4" />}
            {status === "pending" && "Pendentes"}
            {status === "approved" && <CheckCircle2 className="w-4 h-4" />}
            {status === "approved" && "Aprovados"}
            {status === "rejected" && <XCircle className="w-4 h-4" />}
            {status === "rejected" && "Rejeitados"}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Revisões */}
        <div className="lg:col-span-2 space-y-4">
          {filteredReviews.length === 0 ? (
            <Card className="bg-card border-border p-6 text-center">
              <p className="text-muted">Nenhuma revisão encontrada</p>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <Card
                key={review.id}
                className={`bg-card border-border p-4 cursor-pointer transition-colors ${
                  selectedReview?.id === review.id ? "border-primary" : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedReview(review)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{review.projectTitle}</h3>
                    <p className="text-sm text-muted mt-1">Enviado por: {review.submittedByName}</p>
                    <p className="text-xs text-muted mt-1">{review.createdAt.toLocaleString("pt-BR")}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                      review.status === "pending"
                        ? "bg-warning/20 text-warning"
                        : review.status === "approved"
                          ? "bg-success/20 text-success"
                          : "bg-error/20 text-error"
                    }`}
                  >
                    {review.status === "pending" && <Clock className="w-3 h-3" />}
                    {review.status === "approved" && <CheckCircle2 className="w-3 h-3" />}
                    {review.status === "rejected" && <XCircle className="w-3 h-3" />}
                    {review.status === "pending" ? "Pendente" : review.status === "approved" ? "Aprovado" : "Rejeitado"}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Painel de Revisão */}
        {selectedReview && (
          <Card className="bg-card border-border p-6 h-fit sticky top-8">
            <h3 className="font-semibold text-foreground mb-4">Detalhes da Revisão</h3>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs text-muted mb-1">Projeto</p>
                <p className="text-sm text-foreground">{selectedReview.projectTitle}</p>
              </div>

              <div>
                <p className="text-xs text-muted mb-1">Status</p>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    selectedReview.status === "pending"
                      ? "bg-warning/20 text-warning"
                      : selectedReview.status === "approved"
                        ? "bg-success/20 text-success"
                        : "bg-error/20 text-error"
                  }`}
                >
                  {selectedReview.status === "pending"
                    ? "Pendente"
                    : selectedReview.status === "approved"
                      ? "Aprovado"
                      : "Rejeitado"}
                </span>
              </div>

              {selectedReview.reviewedByName && (
                <div>
                  <p className="text-xs text-muted mb-1">Revisado por</p>
                  <p className="text-sm text-foreground">{selectedReview.reviewedByName}</p>
                </div>
              )}

              {selectedReview.comments && (
                <div>
                  <p className="text-xs text-muted mb-1">Comentários</p>
                  <p className="text-sm text-foreground bg-background p-2 rounded">{selectedReview.comments}</p>
                </div>
              )}
            </div>

            {selectedReview.status === "pending" && hasPermission("approve_projects") && (
              <div className="space-y-3">
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Adicione comentários sobre a revisão..."
                  className="w-full h-20 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                />

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApproveReview(selectedReview)}
                    disabled={submitting}
                    className="flex-1 gap-2 bg-success hover:bg-success/90"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Aprovar
                  </Button>
                  <Button
                    onClick={() => handleRejectReview(selectedReview)}
                    disabled={submitting}
                    className="flex-1 gap-2 bg-error hover:bg-error/90"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    Rejeitar
                  </Button>
                </div>
              </div>
            )}

            <Link href={`/dashboard/projects/${selectedReview.projectId}`}>
              <Button variant="outline" className="w-full mt-4 gap-2 bg-transparent">
                <MessageSquare className="w-4 h-4" />
                Ver Projeto
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}
