'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function PhotoGallery({ 
  open, 
  onOpenChange, 
  photos, 
  currentIndex, 
  onIndexChange 
}) {
  const handlePrevious = () => {
    onIndexChange(currentIndex === 0 ? photos.length - 1 : currentIndex - 1)
  }

  const handleNext = () => {
    onIndexChange(currentIndex === photos.length - 1 ? 0 : currentIndex + 1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <div className="relative h-[60vh]">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4" />
          </Button>

          {photos?.length > 0 && (
            <>
              <Image
                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${photos[currentIndex].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                alt={`Photo ${currentIndex + 1}`}
                fill
                className="object-contain"
              />

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={handleNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 