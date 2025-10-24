"use client"

import { initializeFirebase, isFirebaseConfigured } from "@/lib/firebase"
import { useEffect, useState } from "react"

export function useFirebase() {
  const [firebase, setFirebase] = useState<any>({ db: null, auth: null, app: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      if (!isFirebaseConfigured()) {
        console.error("[useFirebase] Firebase não está configurado")
        setLoading(false)
        return
      }

      try {
        const result = await initializeFirebase()
        if (!result) {
          console.error("[useFirebase] Falha ao inicializar Firebase")
          setLoading(false)
          return
        }

        setFirebase(result)
      } catch (error) {
        console.error("[useFirebase] Erro:", error)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  return { ...firebase, loading }
}
