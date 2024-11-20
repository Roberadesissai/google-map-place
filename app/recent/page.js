'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, Star, Navigation2, Trash2, Filter, Search,
  MapPin, DollarSign, Calendar, ArrowUpDown, X 
} from 'lucide-react'
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { GoogleMap, MarkerF, LoadScript } from '@react-google-maps/api'
import Image from 'next/image'
import { format, formatDistanceToNow } from 'date-fns'

// UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

// Constants
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
const DEFAULT_CENTER = { lat: 40.7128, lng: -74.0060 }

const sortOptions = [
  { value: 'date-desc', label: 'Most Recent' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'price-desc', label: 'Highest Spent' },
  { value: 'price-asc', label: 'Lowest Spent' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'rating-asc', label: 'Lowest Rated' }
]

const cuisineTypes = [
  'All',
  'Italian',
  'Japanese',
  'Chinese',
  'Indian',
  'Mexican',
  'Thai',
  'French',
  'Mediterranean',
  'American',
  'Korean',
  'Vietnamese'
]

const defaultFilters = {
  dateRange: null,
  minAmount: 0,
  maxAmount: 1000,
  cuisine: 'All',
  rating: 0,
  hasPhotos: false,
  searchTerm: ''
}

import RecentPageSkeleton from '../../components/RecentPageSkeleton'

export default function Recent() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  
  // State
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(defaultFilters)
  const [sortBy, setSortBy] = useState('date-desc')
  const [selectedVisit, setSelectedVisit] = useState(null)
  const [showDirections, setShowDirections] = useState(false)
  const [userLocation, setUserLocation] = useState(null)

  // Get user's location
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
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  // Fetch visits from Firebase
  const fetchVisits = useCallback(async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const visitsRef = collection(db, 'visits')
      const q = query(
        visitsRef,
        where('userId', '==', user.uid),
        orderBy('visitDate', 'desc')
      )
      
      const snapshot = await getDocs(q)
      const visitData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        visitDate: doc.data().visitDate.toDate()
      }))
      
      setVisits(visitData)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching visits",
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }, [user, toast])

  useEffect(() => {
    fetchVisits()
  }, [fetchVisits])

  // Filter and sort visits
  const filteredVisits = visits.filter(visit => {
    const matchesSearch = !filters.searchTerm || 
      visit.restaurantName.toLowerCase().includes(filters.searchTerm.toLowerCase())
    
    const matchesCuisine = filters.cuisine === 'All' || 
      visit.cuisine === filters.cuisine
    
    const matchesDateRange = !filters.dateRange || (
      visit.visitDate >= filters.dateRange.from &&
      visit.visitDate <= filters.dateRange.to
    )
    
    const matchesAmount = visit.amount >= filters.minAmount && 
      visit.amount <= filters.maxAmount
    
    const matchesRating = visit.rating >= filters.rating
    
    const matchesPhotos = !filters.hasPhotos || 
      (visit.photos && visit.photos.length > 0)

    return matchesSearch && matchesCuisine && matchesDateRange && 
           matchesAmount && matchesRating && matchesPhotos
  })

  const sortedVisits = [...filteredVisits].sort((a, b) => {
    const [criteria, direction] = sortBy.split('-')
    const modifier = direction === 'desc' ? -1 : 1

    switch (criteria) {
      case 'date':
        return (a.visitDate - b.visitDate) * modifier
      case 'price':
        return (a.amount - b.amount) * modifier
      case 'rating':
        return (a.rating - b.rating) * modifier
      default:
        return 0
    }
  })

  // Delete visit
  const handleDeleteVisit = async (visitId) => {
    try {
      await deleteDoc(doc(db, 'visits', visitId))
      setVisits(prev => prev.filter(visit => visit.id !== visitId))
      toast({
        title: "Visit deleted",
        description: "Visit history has been removed successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting visit",
        description: error.message
      })
    }
  }

  if (loading) {
    return <RecentPageSkeleton />
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="h-12 w-12 rounded-full bg-black/5 flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Recent Visits</h1>
            <p className="text-gray-500">
              {filteredVisits.length} {filteredVisits.length === 1 ? 'visit' : 'visits'} found
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search visits..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="pl-9 w-full sm:w-[200px]"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Visits</SheetTitle>
                <SheetDescription>
                  Refine your visit history
                </SheetDescription>
              </SheetHeader>

              <div className="py-4 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {filters.dateRange?.from ? (
                          filters.dateRange.to ? (
                            <>
                              {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                              {format(filters.dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(filters.dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        selected={filters.dateRange}
                        onSelect={(range) => 
                          setFilters(prev => ({ ...prev, dateRange: range }))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount Spent Range</label>
                  <div className="pt-2">
                    <Slider
                      min={0}
                      max={1000}
                      step={10}
                      value={[filters.minAmount, filters.maxAmount]}
                      onValueChange={([min, max]) => 
                        setFilters(prev => ({ 
                          ...prev, 
                          minAmount: min,
                          maxAmount: max 
                        }))
                      }
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">
                        ${filters.minAmount}
                      </span>
                      <span className="text-sm text-gray-500">
                        ${filters.maxAmount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cuisine Type</label>
                  <Select
                    value={filters.cuisine}
                    onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, cuisine: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisineTypes.map(cuisine => (
                        <SelectItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Rating</label>
                  <Select
                    value={filters.rating.toString()}
                    onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, rating: Number(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select minimum rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5].map(rating => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating === 0 ? 'Any rating' : `${rating}+ stars`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Has Photos</label>
                  <Switch
                    checked={filters.hasPhotos}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({ ...prev, hasPhotos: checked }))
                    }
                  />
                </div>
              </div>

              <SheetFooter>
                <Button
                  variant="outline"
                  onClick={() => setFilters(defaultFilters)}
                >
                  Reset Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

{/* Visit Grid */}
<ScrollArea className="h-[calc(100vh-12rem)]">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <AnimatePresence mode="popLayout">
      {sortedVisits.map((visit, index) => (
        <VisitCard
          key={visit.id}
          visit={visit}
          index={index}
          onDelete={handleDeleteVisit}
          onClick={() => setSelectedVisit(visit)}
        />
      ))}
    </AnimatePresence>
  </div>
</ScrollArea>

{/* Visit Details Dialog */}
<Dialog open={!!selectedVisit} onOpenChange={() => setSelectedVisit(null)}>
  <DialogContent className="max-w-3xl">
    <DialogHeader>
      <DialogTitle>{selectedVisit?.restaurantName}</DialogTitle>
      <DialogDescription>
        Visited {selectedVisit && format(selectedVisit.visitDate, 'PPP')}
      </DialogDescription>
    </DialogHeader>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="relative h-64 rounded-lg overflow-hidden">
        {selectedVisit?.photos?.[0] ? (
          <Image
            src={selectedVisit.photos[0]}
            alt={selectedVisit.restaurantName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Clock className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge>{selectedVisit?.cuisine}</Badge>
          <Badge variant="outline">
            {'$'.repeat(selectedVisit?.priceLevel || 1)}
          </Badge>
          <Badge variant="secondary">
            {selectedVisit?.rating} ★
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Amount Spent:</strong> ${selectedVisit?.amount}
          </p>
          <p>
            <strong>Orders:</strong> {selectedVisit?.orders?.join(', ')}
          </p>
          <p>
            <strong>Notes:</strong> {selectedVisit?.notes || 'No notes added'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            onClick={() => router.push(`/restaurant/${selectedVisit.restaurantId}`)}
          >
            Visit Restaurant
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowDirections(true)
              setSelectedVisit(null)
            }}
          >
            Get Directions
          </Button>
        </div>
      </div>
    </div>
  </DialogContent>
</Dialog>

{/* Directions Dialog */}
<Dialog open={showDirections} onOpenChange={setShowDirections}>
  <DialogContent className="max-w-4xl h-[80vh]">
    <DialogHeader>
      <DialogTitle>Directions to {selectedVisit?.restaurantName}</DialogTitle>
    </DialogHeader>
    
    <div className="flex-1 relative h-full">
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={selectedVisit?.location || DEFAULT_CENTER}
          zoom={14}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {userLocation && (
            <MarkerF
              position={userLocation}
              icon={{
                path: "M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
                fillColor: "#000",
                fillOpacity: 1,
                strokeColor: "#fff",
                strokeWeight: 2,
                scale: 2,
              }}
            />
          )}
          
          {selectedVisit?.location && (
            <MarkerF
              position={selectedVisit.location}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: "#000",
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: "#fff",
                scale: 8,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
      </DialogContent>
    </Dialog>
    </div>
  )
}