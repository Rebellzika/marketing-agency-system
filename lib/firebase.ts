"use client"

const isV0Environment = typeof window !== "undefined" && window.location.hostname.includes("v0.app")

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

export const isFirebaseConfigured = () => {
  if (isV0Environment) {
    console.log("[Firebase] Ambiente v0 detectado - usando modo simulado")
    return false
  }

  return !!(
    firebaseConfig.projectId &&
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  )
}

let firebaseApp: any = null
let firebaseAuth: any = null
let firebaseDb: any = null
let initPromise: Promise<any> | null = null

export const initializeFirebase = async () => {
  if (isV0Environment) {
    console.log("[Firebase] Modo simulado ativado (ambiente v0)")
    return null
  }

  if (!isFirebaseConfigured()) {
    console.warn("[Firebase] Variáveis de ambiente não configuradas")
    return null
  }

  if (firebaseApp && firebaseAuth && firebaseDb) {
    return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb }
  }

  if (initPromise) {
    return initPromise
  }

  initPromise = (async () => {
    try {
      const { initializeApp, getApps, getApp } = await import("firebase/app")
      await import("firebase/auth")
      await import("firebase/firestore")

      const { initializeAuth, browserLocalPersistence, getAuth: getAuthFromFirebase } = await import("firebase/auth")
      const { getFirestore } = await import("firebase/firestore")

      if (getApps().length === 0) {
        firebaseApp = initializeApp(firebaseConfig)
      } else {
        firebaseApp = getApp()
      }

      try {
        firebaseAuth = initializeAuth(firebaseApp, {
          persistence: browserLocalPersistence,
        })
      } catch (error: any) {
        if (error.code === "auth/already-initialized") {
          firebaseAuth = getAuthFromFirebase(firebaseApp)
        } else {
          throw error
        }
      }

      firebaseDb = getFirestore(firebaseApp)

      console.log("[Firebase] Inicializado com sucesso")
      return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb }
    } catch (error) {
      console.error("[Firebase] Erro ao inicializar:", error)
      initPromise = null
      return null
    }
  })()

  return initPromise
}

export const getAuth = async () => {
  if (!firebaseAuth) {
    const result = await initializeFirebase()
    return result?.auth || null
  }
  return firebaseAuth
}

export const getDb = async () => {
  if (!firebaseDb) {
    const result = await initializeFirebase()
    return result?.db || null
  }
  return firebaseDb
}

export const getApp_ = async () => {
  if (!firebaseApp) {
    const result = await initializeFirebase()
    return result?.app || null
  }
  return firebaseApp
}

export const db: any = null
