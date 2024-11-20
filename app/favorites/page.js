'use client'

import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { GoogleMap, MarkerF, InfoWindow } from '@react-google-maps/api'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserData } from '@/context/UserDataContext'
import { useAuth } from '@/context/AuthContext'
import {
  MapPin, Navigation2, List, Coffee, Clock, Star, 
  Filter, SlidersHorizontal, ChevronDown, Utensils, Heart, Phone, Globe
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image'
import locationPin from '/public/location-pin.png'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

const cuisineTypes = [
  "All", "Italian", "Japanese", "Mexican", "Indian", 
  "Chinese", "Thai", "American", "Mediterranean"
]

export default function FavoritesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { favorites } = useUserData()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [selectedView, setSelectedView] = useState('map')
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [filters, setFilters] = useState({
    cuisine: "All",
    maxDistance: 5,
    minRating: 0,
    priceLevel: "all",
    isOpenNow: false
  })
  const [hoveredRestaurant, setHoveredRestaurant] = useState(null)

  const mapContainerStyle = {
    width: '100%',
    height: '75vh',
    borderRadius: '1rem'
  }

  const mapOptions = {
    styles: [
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [{ color: "#000000" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#e9e9e9" }]
      }
    ],
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true
  }

  const center = useMemo(() => {
    if (favorites.length === 0) {
      return { lat: 51.5074, lng: -0.1278 }
    }

    const avgLat = favorites.reduce((sum, rest) => 
      sum + (rest.geometry?.location?.lat || 0), 0) / favorites.length
    const avgLng = favorites.reduce((sum, rest) => 
      sum + (rest.geometry?.location?.lng || 0), 0) / favorites.length

    return { lat: avgLat, lng: avgLng }
  }, [favorites])

  useEffect(() => {
    setLoading(false)
  }, [favorites])

  const filteredRestaurants = favorites.filter(restaurant => {
    return (
      (filters.cuisine === "All" || restaurant.types?.includes(filters.cuisine.toLowerCase())) &&
      parseFloat(restaurant.rating || 0) >= filters.minRating &&
      (filters.priceLevel === "all" || restaurant.price_level?.toString() === filters.priceLevel)
    )
  })

  const getMarkerIcon = () => ({
    url: locationPin.src,
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 40),
    clickable: true,
    labelOrigin: new google.maps.Point(20, 20)
  })

  const handleMarkerHover = useCallback((restaurant) => {
    setHoveredRestaurant(restaurant)
  }, [])

  const getInfoWindowPosition = (restaurant) => ({
    lat: restaurant.geometry?.location?.lat + 0.0015 || center.lat,
    lng: restaurant.geometry?.location?.lng || center.lng
  })

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Utensils className="w-8 h-8 text-black" />
        </motion.div>
        <p className="text-gray-500">Loading your favorites...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Please sign in to view your favorites</p>
        <Button onClick={() => router.push('/login')}>Sign In</Button>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">You haven't added any favorites yet</p>
        <Button onClick={() => router.push('/nearby')}>Explore Restaurants</Button>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-black/5 flex items-center justify-center">
                <Heart className="w-5 h-5 text-black" />
              </div>
              <div>
                <CardTitle>Your Favorites</CardTitle>
                <CardDescription>
                  {filteredRestaurants.length} saved restaurants
                </CardDescription>
              </div>
            </div>

            {/* Filters Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Restaurants</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cuisine Type</label>
                    <Select
                      value={filters.cuisine}
                      onValueChange={(value) => setFilters({...filters, cuisine: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        {cuisineTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Maximum Distance (km)</label>
                    <Slider
                      value={[filters.maxDistance]}
                      onValueChange={([value]) => setFilters({...filters, maxDistance: value})}
                      max={10}
                      step={0.5}
                    />
                    <span className="text-sm text-gray-500">{filters.maxDistance}km</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Minimum Rating</label>
                    <Slider
                      value={[filters.minRating]}
                      onValueChange={([value]) => setFilters({...filters, minRating: value})}
                      max={5}
                      step={0.5}
                    />
                    <span className="text-sm text-gray-500">{filters.minRating} stars</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price Level</label>
                    <Select
                      value={filters.priceLevel}
                      onValueChange={(value) => setFilters({...filters, priceLevel: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select price level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="1">$</SelectItem>
                        <SelectItem value="2">$$</SelectItem>
                        <SelectItem value="3">$$$</SelectItem>
                        <SelectItem value="4">$$$$</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => setFilters({
                      cuisine: "All",
                      maxDistance: 5,
                      minRating: 0,
                      priceLevel: "all",
                      isOpenNow: false
                    })}
                    variant="outline"
                    className="w-full"
                  >
                    Reset Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardHeader>
      </Card>

      {/* View Toggle Buttons */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={selectedView === 'map' ? 'default' : 'outline'}
          onClick={() => setSelectedView('map')}
          className="flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          Map View
        </Button>
        <Button
          variant={selectedView === 'list' ? 'default' : 'outline'}
          onClick={() => setSelectedView('list')}
          className="flex items-center gap-2"
        >
          <List className="w-4 h-4" />
          List View
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className={`lg:col-span-2 ${selectedView === 'list' ? 'hidden lg:block' : ''}`}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={14}
            options={mapOptions}
          >
            {filteredRestaurants.map(restaurant => (
              <div key={restaurant.place_id}>
                <MarkerF
                  position={{ 
                    lat: restaurant.geometry?.location?.lat || center.lat,
                    lng: restaurant.geometry?.location?.lng || center.lng
                  }}
                  onClick={() => router.push(`/restaurant/${restaurant.place_id}`)}
                  onMouseOver={() => handleMarkerHover(restaurant)}
                  icon={{
                    url: locationPin.src,
                    scaledSize: new google.maps.Size(40, 40),
                    anchor: new google.maps.Point(20, 40)
                  }}
                />
                
                {hoveredRestaurant?.place_id === restaurant.place_id && (
                  <InfoWindow
                    position={getInfoWindowPosition(restaurant)}
                    onCloseClick={() => setHoveredRestaurant(null)}
                    options={{
                      pixelOffset: new google.maps.Size(0, -45),
                      disableAutoPan: true
                    }}
                  >
                    <div className="p-2 min-w-[150px]">
                      <h3 className="font-semibold">{restaurant.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span>{restaurant.rating}</span>
                        {restaurant.price_level && (
                          <span className="text-gray-500">
                            {'$'.repeat(restaurant.price_level)}
                          </span>
                        )}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </div>
            ))}
          </GoogleMap>
        </div>

        {/* Restaurant List/Details */}
        <div className={selectedView === 'map' ? 'hidden lg:block' : ''}>
          <ScrollArea className="h-[75vh]">
            <div className="space-y-4">
              {filteredRestaurants.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No restaurants match your filters
                  </CardContent>
                </Card>
              ) : (
                filteredRestaurants.map(restaurant => (
                  <Card 
                    key={restaurant.place_id}
                    className={`
                      cursor-pointer 
                      relative 
                      overflow-hidden
                      bg-white/80 
                      backdrop-blur-sm
                      border-gray-200
                      mb-4
                    `}
                    onClick={() => router.push(`/restaurant/${restaurant.place_id}`)}
                  >
                    {/* Image Container with Overlay */}
                    <div className="relative h-56">
                      {restaurant.photos?.[0] ? (
                        <Image
                          src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${restaurant.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`}
                          alt={restaurant.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full bg-gray-200 flex items-center justify-center">
                          <Utensils className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Top Right Badges */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                          {restaurant.isOpen ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <Clock className="w-3 h-3" /> Open
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600">
                              <Clock className="w-3 h-3" /> Closed
                            </span>
                          )}
                        </Badge>
                        <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                          {'$'.repeat(restaurant.price_level || 1)}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">
                            {restaurant.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {restaurant.vicinity}
                          </CardDescription>
                        </div>
                      </div>

                      {/* Rating and Reviews */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                          <span className="font-medium text-lg">{restaurant.rating}</span>
                          <span className="text-gray-500">({restaurant.user_ratings_total || 0})</span>
                        </div>
                        {restaurant.distance && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <Navigation2 className="w-4 h-4" />
                            <span>{restaurant.distance}km</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Cuisine Types */}
                      <div className="flex flex-wrap gap-2">
                        {restaurant.types?.map(type => (
                          <Badge 
                            key={type} 
                            variant="secondary"
                            className="capitalize"
                          >
                            {type.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${restaurant.geometry.location.lat},${restaurant.geometry.location.lng}`, '_blank')
                          }}
                        >
                          <Navigation2 className="w-4 h-4 mr-2" />
                          Directions
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`tel:${restaurant.phone_number}`, '_blank')
                          }}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(restaurant.website, '_blank')
                          }}
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Website
                        </Button>
                      </div>
                    </CardContent>

                    {/* Footer with Additional Info */}
                    <CardFooter className="border-t pt-4">
                      <div className="flex justify-between items-center w-full text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {restaurant.opening_hours?.weekday_text?.[0] || 'Hours not available'}
                        </div>
                        <Button variant="ghost" size="sm">
                          View Details →
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}