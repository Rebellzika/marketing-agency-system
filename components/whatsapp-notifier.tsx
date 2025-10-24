"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, Send, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WhatsAppNotifierProps {
  phoneNumber: string
  projectTitle: string
  projectId: string
  status: "ready" | "approved"
}

export function WhatsAppNotifier({ phoneNumber, projectTitle, projectId, status }: WhatsAppNotifierProps) {
  const [showForm, setShowForm] = useState(false)
  const [customMessage, setCustomMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const defaultMessages = {
    ready: `Olá! O projeto "${projectTitle}" está pronto para revisão. Acesse o painel para visualizar.`,
    approved: `Parabéns! O projeto "${projectTitle}" foi aprovado com sucesso!`,
  }

  const handleSendWhatsApp = async () => {
    const message = customMessage || defaultMessages[status]

    if (!phoneNumber) {
      toast({
        title: "Erro",
        description: "Número de WhatsApp não configurado",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          message,
          projectId,
          projectTitle,
        }),
      })

      const data = await response.json()

      if (data.success) {
        window.open(data.url, "_blank")
        toast({
          title: "Sucesso",
          description: "WhatsApp aberto com a mensagem pronta",
        })
        setShowForm(false)
        setCustomMessage("")
      }
    } catch (error) {
      console.error("Erro ao enviar WhatsApp:", error)
      toast({
        title: "Erro",
        description: "Erro ao processar WhatsApp",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="gap-2 w-full">
          <MessageCircle className="w-4 h-4" />
          Notificar via WhatsApp
        </Button>
      ) : (
        <Card className="bg-card border-border p-4 space-y-3">
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder={defaultMessages[status]}
            className="w-full h-20 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          />

          <div className="flex gap-2">
            <Button onClick={handleSendWhatsApp} disabled={loading} className="flex-1 gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Enviar
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
