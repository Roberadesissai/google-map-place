'use client'

import Image from 'next/image'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useUserData } from '@/context/UserDataContext'
import { useRouter } from 'next/navigation'
import { useSettings } from '@/context/SettingsContext'

export default function RestaurantCard({ restaurant, isFavorite }) {
  const { user } = useAuth()
  const { addToFavorites, removeFromFavorites } = useUserData()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { settings, formatCurrency } = useSettings()
  
  const toggleFavorite = async (e) => {
    e.stopPropagation()
    if (!user) {
      router.push('/login')
      return
    }

    setIsLoading(true)
    try {
      if (isFavorite) {
        await removeFromFavorites(restaurant.place_id)
      } else {
        const restaurantData = {
          place_id: restaurant.place_id,
          name: restaurant.name,
          rating: restaurant.rating || 0,
          vicinity: restaurant.vicinity || '',
          photos: restaurant.photos || [],
          geometry: {
            location: {
              lat: restaurant.geometry?.location?.lat || 0,
              lng: restaurant.geometry?.location?.lng || 0
            }
          }
        }
        await addToFavorites(restaurantData)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/restaurant/${restaurant.id}`)}
    >
      <div className="relative h-48">
        <Image
          src={restaurant.image || '/default-restaurant.jpg'}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
        <button
          onClick={toggleFavorite}
          disabled={isLoading}
          className={`absolute top-2 right-2 p-2 rounded-full 
            ${isFavorite ? 'bg-primary text-white' : 'bg-white text-gray-600'}
            hover:scale-110 transition-transform`}
        >
          <Heart className={isFavorite ? 'fill-current' : ''} />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{restaurant.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine}</p>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">{restaurant.location}</span>
          <div className="flex items-center">
            {restaurant.price && (
              <span className="text-gray-600 mr-2">
                {formatCurrency(restaurant.price)}
              </span>
            )}
            <span className="text-primary font-bold">
              {restaurant.rating || settings.preferences.defaultRating}★
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 