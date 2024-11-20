'use client'
import { AuthContextProvider } from '@/context/AuthContext'

export default function Provider({ children }) {
  return (
    <AuthContextProvider>
      {children}
    </AuthContextProvider>
  )
} 