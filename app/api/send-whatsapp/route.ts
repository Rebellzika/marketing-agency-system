import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, message, projectId, projectTitle } = await request.json()

    if (!phoneNumber || !message) {
      return NextResponse.json({ error: "Telefone e mensagem são obrigatórios" }, { status: 400 })
    }

    // Formatar número para WhatsApp
    const formattedPhone = phoneNumber.replace(/\D/g, "")
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`

    return NextResponse.json({
      success: true,
      url: whatsappUrl,
      message: "Link do WhatsApp gerado com sucesso",
    })
  } catch (error) {
    console.error("Erro ao gerar link WhatsApp:", error)
    return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 })
  }
}
