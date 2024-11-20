'use client'

import { useLoadScript } from '@react-google-maps/api'

export default function GoogleMapsWrapper({ children }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-[75vh] bg-gray-100 rounded-xl">
        <p className="text-red-500">Error loading maps</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[75vh] bg-gray-100 rounded-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return children
} 