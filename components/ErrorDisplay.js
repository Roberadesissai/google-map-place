'use client'

import { motion } from 'framer-motion'
import { SearchX, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

export default function ErrorDisplay({ 
  title = "Not Found",
  message = "The page you're looking for doesn't exist.",
  type = "404"
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] p-4"
    >
      {type === "404" ? (
        <SearchX className="w-24 h-24 text-muted-foreground mb-6" />
      ) : (
        <AlertCircle className="w-24 h-24 text-destructive mb-6" />
      )}
      
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        {message}
      </p>
      
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">
            Go Home
          </Link>
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </motion.div>
  )
} 