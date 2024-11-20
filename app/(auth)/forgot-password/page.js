'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { BiEnvelope } from 'react-icons/bi'
import { Toaster, toast } from 'sonner'

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Reset link sent! Check your inbox.', {
        position: 'top-right',
      })
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('No account found with this email')
          break
        case 'auth/invalid-email':
          toast.error('Please enter a valid email address')
          break
        default:
          toast.error('Failed to send reset email')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <Toaster />
      
      {/* Left Side - Form */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#F2F2F7]"
      >
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl font-bold text-black">Reset Password</h1>
            <p className="mt-2 text-[#3C3C43] opacity-60">
              Enter your email to receive reset instructions
            </p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#787880]/[0.08] border border-[#E5E5EA] rounded-lg px-4 py-3 pl-12 text-black placeholder-[#3C3C43]/60 focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-all"
                required
              />
              <BiEnvelope className="absolute left-4 top-3.5 text-[#3C3C43]" size={20} />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-black rounded-lg px-4 py-3 text-white font-medium hover:bg-black/90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </motion.button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-[#3C3C43] hover:text-black transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </motion.form>
        </div>
      </motion.div>

      {/* Right Side - Decorative */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 [clip-path:polygon(0_0,90%_0,100%_100%,0_100%)]">
          <motion.div 
            className="relative h-full flex flex-col items-center justify-center p-12 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-3">Forgot Password?</h2>
              <p className="text-lg text-white/80">
                Don't worry, we'll help you recover it
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}