import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

// Função necessária para export estático
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { text, authorId, authorName } = await request.json()
    const projectId = params.id

    if (!text || !authorId || !authorName) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const commentsRef = collection(db, "projects", projectId, "comments")
    const docRef = await addDoc(commentsRef, {
      text,
      authorId,
      authorName,
      createdAt: serverTimestamp(),
    })

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: "Comentário adicionado com sucesso",
    })
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error)
    return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 })
  }
}
