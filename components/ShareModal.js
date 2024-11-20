'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, Facebook, Twitter, Link } from 'lucide-react'
import { toast } from 'sonner'

export default function ShareModal({ open, onOpenChange, restaurant }) {
  if (!restaurant) return null

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `Check out ${restaurant.name} on our restaurant app!`

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share {restaurant.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 p-2 border rounded-lg">
              <Link className="w-4 h-4 text-gray-500" />
              <span className="flex-1 text-sm truncate">{shareUrl}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCopyLink}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(socialLinks.facebook, '_blank')}
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(socialLinks.twitter, '_blank')}
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 