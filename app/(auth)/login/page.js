// pages/login.js
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import { BiUser, BiLockAlt } from 'react-icons/bi'
import { getRandomImage } from '@/utils/images'
import { motion } from 'framer-motion'

export default function Login() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/')
      }
    })

    return () => unsubscribe()
  }, [router])

  // Fetch background image
  useEffect(() => {
    const randomImagePath = getRandomImage()
    setBackgroundImage(randomImagePath)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )
      router.push('/')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push('/')
    } catch (error) {
      setError(error.message)
    }
  }

  const handleGithubSignIn = async () => {
    try {
      const provider = new GithubAuthProvider()
      await signInWithPopup(auth, provider)
      router.push('/')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"
      >
        {backgroundImage && (
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img 
              src={backgroundImage}
              alt="Luxury restaurant interior"
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{
                imageRendering: 'high-quality',
                WebkitBackfaceVisibility: 'hidden',
                MozBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden'
              }}
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
          </motion.div>
        )}
        <div className="absolute inset-0 [clip-path:polygon(0_0,90%_0,100%_100%,0_100%)]">
          <motion.div 
            className="relative h-full flex flex-col items-center justify-center p-12 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center">
              <h2 className="text-5xl font-bold mb-4">Welcome Back</h2>
              <p className="text-xl text-white/80">
                Continue your gastronomic adventure
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F2F2F7]"
      >
        <div className="w-full max-w-lg space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-black">Arcaureus Limit</h1>
            <p className="mt-2 text-[#3C3C43] opacity-60">
              Access your account
            </p>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            >
              {error}
            </motion.div>
          )}
          
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  className="w-full bg-[#787880]/[0.08] border border-[#E5E5EA] rounded-lg px-4 py-3 pl-12 text-black placeholder-[#3C3C43]/60 focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-all"
                />
                <BiUser className="absolute left-4 top-3.5 text-[#3C3C43]" size={20} />
              </div>
              
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full bg-[#787880]/[0.08] border border-[#E5E5EA] rounded-lg px-4 py-3 pl-12 text-black placeholder-[#3C3C43]/60 focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-all"
                />
                <BiLockAlt className="absolute left-4 top-3.5 text-[#3C3C43]" size={20} />
              </div>
              <div className="flex justify-end">
                <Link 
                  href="/forgot-password"
                  className="text-sm text-[#3C3C43] hover:text-black transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <motion.button 
              type="submit"
              disabled={loading}
              className="w-full bg-black rounded-lg px-4 py-3 text-white font-medium hover:bg-black/90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Processing...' : 'Sign In'}
            </motion.button>
          </motion.form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E5EA]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#F2F2F7] text-[#3C3C43]/60">Or continue with</span>
            </div>
          </div>

          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 bg-[#787880]/[0.08] border border-[#E5E5EA] rounded-lg px-4 py-3 text-[#000000] hover:bg-[#787880]/[0.12] transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaGoogle className="text-[#3C3C43]" />
              Google
            </motion.button>

            <motion.button
              onClick={handleGithubSignIn}
              className="w-full flex items-center justify-center gap-2 bg-[#787880]/[0.08] border border-[#E5E5EA] rounded-lg px-4 py-3 text-[#000000] hover:bg-[#787880]/[0.12] transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaGithub className="text-[#3C3C43]" />
              GitHub
            </motion.button>
          </motion.div>

          <div className="text-center">
            <Link
              href="/signup"
              className="text-[#3C3C43] hover:text-black transition-colors"
            >
              Need an account? Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}