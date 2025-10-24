"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isFirebaseConfigured } from "@/lib/firebase"

export interface UserRole {
  id: string
  name: string
  permissions: string[]
  level: number
}

export interface UserData {
  uid: string
  email: string
  name: string
  role: UserRole
  status: "active" | "paused" | "banned"
  whatsappNumber?: string
  createdAt: Date
  updatedAt: Date
}

interface AuthContextType {
  user: UserData | null
  firebaseUser: any | null
  loading: boolean
  signOut: () => Promise<void>
  hasPermission: (permission: string) => boolean
  isSuperAdmin: () => boolean
  isAdmin: () => boolean
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!isFirebaseConfigured()) {
          console.log("[Auth] Modo simulado ativado - Firebase não configurado")
          setIsConfigured(false)
          setLoading(false)
          return
        }

        const { initializeFirebase } = await import("@/lib/firebase")
        const firebaseResult = await initializeFirebase()

        if (!firebaseResult?.auth || !firebaseResult?.db) {
          console.log("[Auth] Modo simulado ativado - Firebase não inicializado")
          setIsConfigured(false)
          setLoading(false)
          return
        }

        const { auth, db } = firebaseResult
        setIsConfigured(true)

        const { onAuthStateChanged, signOut: firebaseSignOut } = await import("firebase/auth")
        const { doc, getDoc } = await import("firebase/firestore")

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          try {
            if (firebaseUser) {
              const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

              if (userDoc.exists()) {
                const userData = userDoc.data()

                if (userData.status === "banned") {
                  await firebaseSignOut(auth)
                  setUser(null)
                  setFirebaseUser(null)
                  setLoading(false)
                  return
                }

                setUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || "",
                  name: userData.name,
                  role: userData.role,
                  status: userData.status,
                  whatsappNumber: userData.whatsappNumber,
                  createdAt: userData.createdAt?.toDate?.() || new Date(),
                  updatedAt: userData.updatedAt?.toDate?.() || new Date(),
                })
                setFirebaseUser(firebaseUser)
              }
            } else {
              setUser(null)
              setFirebaseUser(null)
            }
          } catch (error) {
            console.error("[Auth] Erro ao carregar dados do usuário:", error)
            setUser(null)
            setFirebaseUser(null)
          } finally {
            setLoading(false)
          }
        })

        return () => unsubscribe()
      } catch (error) {
        console.error("[Auth] Erro ao inicializar autenticação:", error)
        setIsConfigured(false)
        setLoading(false)
      }
    }

    initAuth()
  }, [router])

  const signOut = async () => {
    try {
      const { initializeFirebase } = await import("@/lib/firebase")
      const firebaseResult = await initializeFirebase()
      if (!firebaseResult?.auth) return

      const { auth } = firebaseResult
      const { signOut: firebaseSignOut } = await import("firebase/auth")
      await firebaseSignOut(auth)
      setUser(null)
      setFirebaseUser(null)
    } catch (error) {
      console.error("[Auth] Erro ao fazer logout:", error)
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.role.permissions.includes(permission) || user.role.level === 0
  }

  const isSuperAdmin = (): boolean => {
    return user?.role.level === 0 || false
  }

  const isAdmin = (): boolean => {
    return user?.role.level <= 1 || false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        signOut,
        hasPermission,
        isSuperAdmin,
        isAdmin,
        isConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }
  return context
}
