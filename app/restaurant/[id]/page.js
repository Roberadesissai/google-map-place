'use client'

import { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, MapPin, Clock, DollarSign, Heart, Share2, 
  Navigation2, Phone, Globe, MessageCircle, ArrowLeft,
  Camera, ChevronLeft, ChevronRight, Info, Coffee
} from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useUserData } from '@/context/UserDataContext'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'sonner'
import GoogleMapView from '@/components/Home/GoogleMapView'
import ReviewForm from '@/components/ReviewForm'
import ShareModal from '@/components/ShareModal'
import PhotoGallery from '@/components/PhotoGallery'
import { cn } from "@/lib/utils"
import OverviewTab from '@/components/restaurant/OverviewTab'
import ReviewsTab from '@/components/restaurant/ReviewsTab'
import PhotosTab from '@/components/restaurant/PhotosTab'
import ReviewSheet from '@/components/restaurant/ReviewSheet'
import DirectionsSheet from '@/components/restaurant/DirectionsSheet'

const getRestaurantImage = (restaurant) => {
  if (restaurant?.photos?.[0]?.photo_reference) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${restaurant.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  }
  return '/restaurant-placeholder.jpg'
}

export default function RestaurantPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { favorites, addToFavorites, removeFromFavorites, addToRecents } = useUserData()
  
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showPhotos, setShowPhotos] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showDirections, setShowDirections] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (!params?.id) return
      
      try {
        const response = await fetch(`/api/place-details/${params.id}`)
        const data = await response.json()
        setRestaurant(data)
        if (user) {
          addToRecents(data)
        }
      } catch (error) {
        console.error('Error fetching restaurant details:', error)
        toast.error('Failed to load restaurant details')
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurantDetails()
  }, [params?.id, user])

  useEffect(() => {
    if (user && params?.id) {
      const checkFavorite = async () => {
        try {
          const isFav = favorites.some(f => f.place_id === params.id)
          setIsFavorite(isFav)
        } catch (error) {
          console.error('Error checking favorite status:', error)
        }
      }
      checkFavorite()
    }
  }, [user, params?.id, favorites])

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Please sign in to save favorites')
      return
    }

    try {
      if (isFavorite) {
        console.log('Removing from favorites:', params.id)
        await removeFromFavorites(params.id)
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        const restaurantData = {
          place_id: params.id,
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
        console.log('Adding to favorites:', restaurantData)
        await addToFavorites(restaurantData)
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorites')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant.name,
          text: `Check out ${restaurant.name} on our restaurant app!`,
          url: window.location.href
        })
      } catch (error) {
        setShowShareModal(true)
      }
    } else {
      setShowShareModal(true)
    }
  }

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.geometry.location.lat},${restaurant.geometry.location.lng}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Hero Section Skeleton */}
        <div className="relative h-[40vh] md:h-[50vh] bg-gray-200 animate-pulse rounded-lg">
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <div className="h-8 w-2/3 bg-gray-300 rounded" />
            <div className="flex gap-4">
              <div className="h-4 w-20 bg-gray-300 rounded" />
              <div className="h-4 w-20 bg-gray-300 rounded" />
            </div>
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <div className="h-10 w-24 bg-gray-200 rounded-md inline-block" />
            <div className="h-10 w-24 bg-gray-200 rounded-md inline-block" />
            <div className="h-10 w-24 bg-gray-200 rounded-md inline-block" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-gray-200 rounded-md" />
            <div className="h-10 w-10 bg-gray-200 rounded-md" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>

        {/* Map Skeleton */}
        <div className="h-[300px] bg-gray-200 rounded-lg" />
      </div>
    )
  }

  if (!restaurant) {
    return <ErrorState onBack={() => router.back()} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh]">
        <Button
          variant="ghost"
          className="absolute top-4 left-4 z-10"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        
        <div className="absolute inset-0">
          <Image
            src={getRestaurantImage(restaurant)}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-3xl font-bold text-white mb-2">
            {restaurant.name}
          </h1>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span>{restaurant.rating}</span>
              <span>({restaurant.user_ratings_total})</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{'$'.repeat(restaurant.price_level || 1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFavoriteToggle}
                    className={cn(
                      "transition-colors duration-200",
                      isFavorite && "bg-pink-50 dark:bg-pink-900/20"
                    )}
                  >
                    <Heart 
                      className={cn(
                        "w-4 h-4 transition-colors duration-200",
                        isFavorite ? "fill-red-500 text-red-500" : "text-gray-500 dark:text-gray-400"
                      )} 
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Main Content */}
              <div className="mt-6">
                <TabsContent value="overview" className="space-y-6">
                  <OverviewTab restaurant={restaurant} onGetDirections={handleGetDirections} />
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  <ReviewsTab 
                    reviews={restaurant.reviews} 
                    onAddReview={() => setShowReviewForm(true)} 
                  />
                </TabsContent>

                <TabsContent value="photos" className="space-y-6">
                  <PhotosTab 
                    photos={restaurant.photos} 
                    onPhotoClick={(index) => {
                      setCurrentPhotoIndex(index)
                      setShowPhotos(true)
                    }} 
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Modals and Sheets */}
      <ReviewSheet 
        open={showReviewForm} 
        onOpenChange={setShowReviewForm}
        restaurantId={params.id}
      />

      <ShareModal 
        open={showShareModal}
        onOpenChange={setShowShareModal}
        restaurant={restaurant}
      />

      <PhotoGallery 
        open={showPhotos}
        onOpenChange={setShowPhotos}
        photos={restaurant.photos}
        currentIndex={currentPhotoIndex}
        onIndexChange={setCurrentPhotoIndex}
      />

      <DirectionsSheet 
        open={showDirections}
        onOpenChange={setShowDirections}
        restaurant={restaurant}
      />
    </div>
  )
}