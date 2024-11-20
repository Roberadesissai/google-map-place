import { MarkerF, InfoWindowF } from '@react-google-maps/api'
import { useRouter } from 'next/navigation'
import React, { useState, useContext, useEffect } from 'react'
import { SelectedBusinessContext } from '@/context/SelectedBusinessContext'

function Markers({ business, map }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { selectedBusiness } = useContext(SelectedBusinessContext)

  // Open info window when business is selected from the list
  useEffect(() => {
    if (selectedBusiness?.place_id === business.place_id) {
      setIsOpen(true)
      map?.panTo(business.geometry.location)
    } else {
      setIsOpen(false)
    }
  }, [selectedBusiness, business.place_id, map])

  return (
    <MarkerF
      position={business.geometry.location}
      onClick={() => setIsOpen(true)}
      icon={{
        url: '/location-pin.png',
        scaledSize: {
          width: 40,
          height: 40
        }
      }}
    >
      {isOpen && (
        <InfoWindowF
          position={business.geometry.location}
          onCloseClick={() => setIsOpen(false)}
        >
          <div className="p-1.5 min-w-[180px] max-w-[200px]">
            <h3 className="font-semibold text-sm mb-1 truncate">{business.name}</h3>
            {business.photos?.[0]?.photo_reference && (
              <div className="relative w-full h-24 mb-1.5 rounded-md overflow-hidden">
                <img
                  src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${business.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="text-sm text-gray-600 mb-2">{business.vicinity}</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm">{business.rating} ({business.user_ratings_total} reviews)</span>
            </div>
            <button 
              onClick={() => router.push(`/restaurant/${business.place_id}`)}
              className="bg-purple-500 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-600 transition-colors w-full"
            >
              View Details
            </button>
          </div>
        </InfoWindowF>
      )}
    </MarkerF>
  )
}

export default React.memo(Markers)