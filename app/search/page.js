'use client'

import { useState, useEffect, useContext } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, SearchX, Star, MapPin, Clock, DollarSign, Phone } from 'lucide-react'
import { UserLocationContext } from '@/context/UserLocationContext'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import GoogleMapView from '@/components/Home/GoogleMapView'
import Link from 'next/link'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { userLocation } = useContext(UserLocationContext)
  const [selectedView, setSelectedView] = useState('grid') // 'grid' or 'map'

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || !userLocation) return
      
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/google-place?category=${query}&lat=${userLocation.lat}&lng=${userLocation.lng}&radius=5000`)
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.message)
        
        if (data.results.length === 0) {
          setError('No restaurants found matching your search')
        }
        
        setResults(data.results)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, userLocation])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-primary" />
        </motion.div>
        <p className="mt-4 text-muted-foreground">Searching for restaurants...</p>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[50vh] p-4"
      >
        <SearchX className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Results Found</h2>
        <p className="text-muted-foreground text-center max-w-md">
          We couldn't find any restaurants matching "{query}". 
          Try checking your spelling or using different keywords.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Search Results for "{query}"
          </h1>
          <p className="text-muted-foreground mt-2">
            Found {results.length} restaurants near you
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedView('grid')}
            className={`px-4 py-2 rounded-lg ${
              selectedView === 'grid' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setSelectedView('map')}
            className={`px-4 py-2 rounded-lg ${
              selectedView === 'map' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}
          >
            Map View
          </button>
        </div>
      </div>

      {selectedView === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((business) => (
            <motion.div
              key={business.place_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={`/restaurant/${business.place_id}`}>
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full">
                    <Image
                      src={
                        business.photos?.[0]?.photo_reference
                          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${business.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
                          : '/placeholder.jpeg'
                      }
                      alt={business.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{business.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{business.rating}</span>
                      <span className="text-muted-foreground">
                        ({business.user_ratings_total} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm truncate">{business.vicinity}</span>
                    </div>
                    
                    {business.opening_hours && (
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Clock className="w-4 h-4" />
                        <span className={`text-sm ${
                          business.opening_hours.open_now 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {business.opening_hours.open_now ? 'Open Now' : 'Closed'}
                        </span>
                      </div>
                    )}
                    
                    {business.price_level && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">
                          {'$'.repeat(business.price_level)}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="h-[calc(100vh-200px)] rounded-xl overflow-hidden">
          <GoogleMapView businessList={results} />
        </div>
      )}
    </div>
  )
} 