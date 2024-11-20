import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { LoadScript, GoogleMap, MarkerF, DirectionsRenderer } from '@react-google-maps/api'
import { Button } from '@/components/ui/button'
import { Navigation2 } from 'lucide-react'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export default function DirectionsSheet({ open, onOpenChange, restaurant }) {
  const [userLocation, setUserLocation] = useState(null)
  const [directions, setDirections] = useState(null)

  useEffect(() => {
    if (open && navigator.geolocation) {
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
  }, [open])

  useEffect(() => {
    if (userLocation && restaurant?.geometry?.location) {
      const directionsService = new google.maps.DirectionsService()

      directionsService.route(
        {
          origin: userLocation,
          destination: restaurant.geometry.location,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result)
          } else {
            console.error('Error fetching directions:', status)
          }
        }
      )
    }
  }, [userLocation, restaurant])

  const handleOpenInMaps = () => {
    if (restaurant?.geometry?.location) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.geometry.location.lat},${restaurant.geometry.location.lng}`
      window.open(url, '_blank')
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Directions to {restaurant?.name}</SheetTitle>
        </SheetHeader>

        <div className="relative h-[calc(100%-5rem)] mt-6">
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={restaurant?.geometry?.location || { lat: 0, lng: 0 }}
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

              {restaurant?.geometry?.location && !directions && (
                <MarkerF
                  position={restaurant.geometry.location}
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

              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </LoadScript>

          <Button
            className="absolute bottom-4 left-1/2 -translate-x-1/2 gap-2"
            onClick={handleOpenInMaps}
          >
            <Navigation2 className="w-4 h-4" />
            Open in Google Maps
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
} 