'use client'

import { useState, useEffect, useCallback } from 'react'
import { GoogleMap, MarkerF, InfoWindow } from '@react-google-maps/api'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  MapPin, Navigation2, Coffee, Clock, Star,
  ChevronDown, Filter, DollarSign, X, Heart,
  Grid, List, LayoutList, Utensils, Search,
  ChevronUp, Info
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useAuth } from '@/context/AuthContext'
import { useUserData } from '@/context/UserDataContext'

// Constants
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

const viewOptions = [
  { id: 'grid', icon: Grid, label: 'Grid View' },
  { id: 'list', icon: List, label: 'List View' },
  { id: 'detailed', icon: LayoutList, label: 'Detailed View' }
]

const cuisineTypes = [
  "All",
  "Italian",
  "Japanese",
  "Chinese",
  "Mexican",
  "Indian",
  "Thai",
  "Mediterranean",
  "American",
  "French",
  "Korean",
  "Vietnamese",
  "Greek",
  "Spanish",
  "Middle Eastern"
]

const sortOptions = [
  { value: 'distance', label: 'Distance' },
  { value: 'rating', label: 'Rating (High to Low)' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' }
]

// Utility Functions
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return (R * c).toFixed(1)
}

// Custom Hooks
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Components
const RestaurantCard = ({ 
  restaurant, 
  viewType, 
  selected, 
  onSelect,
  onFavorite,
  isFavorite,
  userLocation 
}) => {
  const router = useRouter()

  // Add this click handler function
  const handleCardClick = () => {
    onSelect(restaurant)
    // For detailed view, navigate to restaurant details
    if (viewType === 'detailed') {
      router.push(`/restaurant/${restaurant.id}`)
    }
  }

  if (viewType === 'detailed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={handleCardClick}
        className="cursor-pointer"
      >
        <Card className={cn(
          "h-full transition-shadow hover:shadow-md",
          "dark:bg-gray-800/50 dark:border-gray-700",
          "backdrop-blur-sm",
          selected && "ring-2 ring-primary"
        )}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl dark:text-white">{restaurant.name}</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {restaurant.address}
                  </div>
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Badge variant={restaurant.isOpen ? "default" : "secondary"} 
                  className="dark:text-white">
                  {restaurant.isOpen ? 'Open Now' : 'Closed'}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onFavorite(restaurant)
                  }}
                >
                  <Heart className={cn(
                    "w-4 h-4",
                    isFavorite && "fill-red-500 text-red-500"
                  )} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Detailed Rating and Reviews */}
            <div className="bg-secondary/10 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-medium text-lg dark:text-white">{restaurant.rating}</span>
                  <span className="text-gray-500 dark:text-gray-400">({restaurant.reviews} reviews)</span>
                </div>
                <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                  {'$'.repeat(restaurant.priceLevel)}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {restaurant.cuisine && (
                  <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                    {restaurant.cuisine}
                  </Badge>
                )}
                <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                  {restaurant.distance}km away
                </Badge>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium dark:text-gray-300">Distance</p>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Navigation2 className="w-4 h-4" />
                  <span>{restaurant.distance}km from you</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium dark:text-gray-300">Price Level</p>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <DollarSign className="w-4 h-4" />
                  <span>{'$'.repeat(restaurant.priceLevel)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation() // Prevent card click
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.geometry.location.lat},${restaurant.geometry.location.lng}`
                  window.open(url, '_blank')
                }}
              >
                <Navigation2 className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
              <Button 
                className="flex-1"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation() // Prevent card click
                  router.push(`/restaurant/${restaurant.id}`)
                }}
              >
                <Info className="w-4 h-4 mr-2" />
                More Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // List View
  if (viewType === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={handleCardClick}
        className="cursor-pointer"
      >
        <Card className={cn(
          "transition-shadow hover:shadow-md",
          "dark:bg-gray-800/50 dark:border-gray-700",
          selected && "ring-2 ring-primary"
        )}>
          <CardHeader className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <CardTitle className="text-base dark:text-white">{restaurant.name}</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-medium dark:text-white">{restaurant.rating}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({restaurant.reviews})</span>
                  </div>
                  <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                    {restaurant.distance}km
                  </Badge>
                </div>
              </div>
              <Badge variant={restaurant.isOpen ? "default" : "secondary"}>
                {restaurant.isOpen ? 'Open' : 'Closed'}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    )
  }

  // Grid View (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onClick={handleCardClick}
      className="cursor-pointer"
    >
      <Card className={cn(
        "h-full transition-shadow hover:shadow-md",
        "dark:bg-gray-800/50 dark:border-gray-700",
        selected && "ring-2 ring-primary"
      )}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg dark:text-white">{restaurant.name}</CardTitle>
              <CardDescription className="dark:text-gray-400">{restaurant.address}</CardDescription>
            </div>
            <Badge variant={restaurant.isOpen ? "default" : "secondary"}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="font-medium dark:text-white">{restaurant.rating}</span>
              <span className="text-gray-500 dark:text-gray-400">({restaurant.reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Navigation2 className="w-4 h-4" />
              <span>{restaurant.distance}km</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
              {'$'.repeat(restaurant.priceLevel)}
            </Badge>
            <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
              {restaurant.cuisine}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Main Component
export default function NearbyPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [viewType, setViewType] = useState('grid')
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [restaurants, setRestaurants] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    cuisine: 'All',
    maxDistance: 5,
    minRating: 0,
    priceLevel: 'all',
    openNow: false
  })
  const [sortBy, setSortBy] = useState('distance')
  const { favorites, addToFavorites, removeFromFavorites } = useUserData()
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Please enable location services to find nearby restaurants",
            variant: "destructive"
          })
        }
      )
    }
  }, [])

  // Fetch restaurants
  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      if (!userLocation) return

      try {
        setLoading(true)
        const response = await fetch(
          `/api/google-place?` + 
          `lat=${userLocation.lat}` +
          `&lng=${userLocation.lng}` +
          `&radius=5000` +
          `&category=restaurant`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch restaurants')
        }

        const data = await response.json()

        if (!data.results?.length) {
          setRestaurants([])
          toast.error('No restaurants found in this area')
          return
        }

        const formattedRestaurants = data.results.map(place => ({
          id: place.place_id,
          place_id: place.place_id,
          name: place.name,
          rating: place.rating || 0,
          cuisine: place.types?.filter(type => 
            !['restaurant', 'food', 'point_of_interest', 'establishment'].includes(type)
          )[0]?.replace(/_/g, ' ') || 'Restaurant',
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            place.geometry.location.lat,
            place.geometry.location.lng
          ),
          geometry: {
            location: {
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng
            }
          },
          isOpen: place.opening_hours?.open_now || false,
          priceLevel: place.price_level || 1,
          reviews: place.user_ratings_total || 0,
          address: place.vicinity,
          photos: place.photos || []
        }))

        setRestaurants(formattedRestaurants)
      } catch (error) {
        console.error('Error fetching places:', error)
        toast.error('Failed to load nearby restaurants')
      } finally {
        setLoading(false)
      }
    }

    if (userLocation) {
      fetchNearbyPlaces()
    }
  }, [userLocation])

  // Filter and sort restaurants
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = !filters.search || 
      restaurant.name.toLowerCase().includes(filters.search.toLowerCase())

    const matchesCuisine = filters.cuisine === 'All' || 
      restaurant.types?.includes(filters.cuisine.toLowerCase().replace(' ', '_'))

    const matchesRating = restaurant.rating >= filters.minRating

    const matchesPrice = filters.priceLevel === 'all' || 
      restaurant.price_level === parseInt(filters.priceLevel)

    const matchesOpenNow = !filters.openNow || 
      restaurant.opening_hours?.open_now

    const withinDistance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      restaurant.geometry.location.lat,
      restaurant.geometry.location.lng
    ) <= filters.maxDistance

    return matchesSearch && matchesCuisine && matchesRating && 
           matchesPrice && matchesOpenNow && withinDistance
  }).sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return (
          calculateDistance(
            userLocation.lat,
            userLocation.lng,
            a.geometry.location.lat,
            a.geometry.location.lng
          ) -
          calculateDistance(
            userLocation.lat,
            userLocation.lng,
            b.geometry.location.lat,
            b.geometry.location.lng
          )
        )
      case 'rating':
        return b.rating - a.rating
      case 'reviews':
        return b.user_ratings_total - a.user_ratings_total
      case 'price-low':
        return (a.price_level || 1) - (b.price_level || 1)
      case 'price-high':
        return (b.price_level || 1) - (a.price_level || 1)
      default:
        return 0
    }
  })

  const handleFavoriteToggle = async (restaurant) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save favorites",
        variant: "destructive"
      })
      return
    }

    try {
      const restaurantData = {
        place_id: restaurant.id || restaurant.place_id,
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

      const isFavorite = favorites.some(fav => fav.place_id === restaurantData.place_id)
      
      if (isFavorite) {
        await removeFromFavorites(restaurantData.place_id)
        toast({
          title: "Removed from favorites",
          description: `${restaurant.name} has been removed from your favorites`
        })
      } else {
        await addToFavorites(restaurantData)
        toast({
          title: "Added to favorites",
          description: `${restaurant.name} has been added to your favorites`
        })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      })
    }
  }

  // In the main component, update the restaurant selection handler
  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant)
    if (window.innerWidth < 1024) { // For mobile devices
      setViewType('details')
    }
  }

  if (loading) {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Nearby Restaurants</CardTitle>
              <CardDescription>
                Found {filteredRestaurants.length} restaurants near you
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Search restaurants..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full sm:w-auto"
              />

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    {(() => {
                      const selectedViewOption = viewOptions.find(v => v.id === viewType)
                      const ViewIcon = selectedViewOption?.icon
                      return ViewIcon ? <ViewIcon className="w-4 h-4" /> : null
                    })()}
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {viewOptions.map(option => {
                    const OptionIcon = option.icon
                    return (
                      <DropdownMenuItem
                        key={option.id}
                        onClick={() => setViewType(option.id)}
                      >
                        <OptionIcon className="w-4 h-4 mr-2" />
                        {option.label}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Restaurants</SheetTitle>
                    <SheetDescription>
                      Customize your search results
                    </SheetDescription>
                  </SheetHeader>

                  <div className="py-4 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cuisine Type</label>
                      <Select
                        value={filters.cuisine}
                        onValueChange={(value) => 
                          setFilters({ ...filters, cuisine: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cuisine" />
                        </SelectTrigger>
                        <SelectContent>
                          {cuisineTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Maximum Distance ({filters.maxDistance}km)
                      </label>
                      <Slider
                        value={[filters.maxDistance]}
                        onValueChange={([value]) => 
                          setFilters({ ...filters, maxDistance: value })
                        }
                        max={10}
                        step={0.5}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Minimum Rating ({filters.minRating} stars)
                      </label>
                      <Slider
                        value={[filters.minRating]}
                        onValueChange={([value]) => 
                          setFilters({ ...filters, minRating: value })
                        }
                        max={5}
                        step={0.5}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price Range</label>
                      <Select
                        value={filters.priceLevel}
                        onValueChange={(value) => 
                          setFilters({ ...filters, priceLevel: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select price range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          {[1, 2, 3, 4].map(level => (
                            <SelectItem key={level} value={level.toString()}>
                              {'$'.repeat(level)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Open Now</label>
                      <Switch
                        checked={filters.openNow}
                        onCheckedChange={(checked) => 
                          setFilters({ ...filters, openNow: checked })
                        }
                      />
                    </div>
                  </div>

                  <SheetFooter>
                    <Button
                      variant="outline"
                      onClick={() => setFilters({
                        search: '',
                        cuisine: 'All',
                        maxDistance: 5,
                        minRating: 0,
                        priceLevel: 'all',
                        openNow: false
                      })}
                    >
                      Reset Filters
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className={cn(
        "grid gap-6",
        viewType === 'grid' && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        viewType !== 'grid' && "grid-cols-1"
      )}>
        <AnimatePresence mode="popLayout">
          {filteredRestaurants.map(restaurant => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              viewType={viewType}
              selected={selectedRestaurant?.id === restaurant.id}
              onSelect={handleRestaurantSelect}
              onFavorite={handleFavoriteToggle}
              isFavorite={favorites.some(fav => fav.id === restaurant.id)}
              userLocation={userLocation}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <Utensils className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No restaurants found</h3>
          <p className="text-gray-500">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}

      <RestaurantDetails 
        restaurant={selectedRestaurant}
        onClose={() => {
          setIsDetailsOpen(false)
          setSelectedRestaurant(null)
        }}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  )
}

// Add this component for restaurant details
const RestaurantDetails = ({ restaurant, onClose, isOpen, onOpenChange }) => {
  if (!restaurant) return null

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[540px] dark:bg-gray-800/95 backdrop-blur-lg">
        <SheetHeader className="space-y-4">
          <SheetTitle className="text-2xl dark:text-white">
            {restaurant.name}
          </SheetTitle>
          <SheetDescription>
            <div className="flex items-center gap-2 dark:text-gray-300">
              <MapPin className="w-4 h-4" />
              {restaurant.address}
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Rating and Reviews */}
          <div className="bg-secondary/10 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                <span className="font-medium text-lg dark:text-white">
                  {restaurant.rating}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  ({restaurant.reviews} reviews)
                </span>
              </div>
              <Badge variant={restaurant.isOpen ? "default" : "secondary"}>
                {restaurant.isOpen ? 'Open Now' : 'Closed'}
              </Badge>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium dark:text-gray-200">Distance</h4>
              <p className="text-gray-500 dark:text-gray-400">
                {restaurant.distance}km away
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium dark:text-gray-200">Price Level</h4>
              <p className="text-gray-500 dark:text-gray-400">
                {'$'.repeat(restaurant.priceLevel)}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium dark:text-gray-200">Cuisine</h4>
              <p className="text-gray-500 dark:text-gray-400">
                {restaurant.cuisine}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <Button 
              className="flex-1"
              onClick={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.geometry.location.lat},${restaurant.geometry.location.lng}`
                window.open(url, '_blank')
              }}
            >
              <Navigation2 className="w-4 h-4 mr-2" />
              Get Directions
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onClose()}
            >
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}