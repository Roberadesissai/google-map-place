import { Camera } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function PhotosTab({ photos = [], onPhotoClick }) {
  const getPhotoUrl = (photo) => {
    if (photo.photo_reference) {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    }
    return '/restaurant-placeholder.jpg'
  }

  if (!photos?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No photos available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo, index) => (
        <Button
          key={index}
          variant="ghost"
          className="p-0 h-auto aspect-square relative overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
          onClick={() => onPhotoClick(index)}
        >
          <Image
            src={getPhotoUrl(photo)}
            alt={`Restaurant photo ${index + 1}`}
            fill
            className="object-cover"
          />
        </Button>
      ))}
    </div>
  )
} 