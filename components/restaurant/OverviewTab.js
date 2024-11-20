import { MapPin, Clock, Navigation2, Phone, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import GoogleMapView from '@/components/Home/GoogleMapView'

export default function OverviewTab({ restaurant, onGetDirections }) {
  return (
    <>
      {/* Info Card */}
      <Card className="p-4 space-y-4">
        {/* Address */}
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 mt-1 text-gray-500" />
          <div>
            <h3 className="font-medium">Address</h3>
            <p className="text-gray-600">{restaurant.formatted_address}</p>
          </div>
        </div>

        {/* Opening Hours */}
        {restaurant.opening_hours && (
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 mt-1 text-gray-500" />
            <div>
              <h3 className="font-medium">Opening Hours</h3>
              <ul className="text-gray-600 space-y-1">
                {restaurant.opening_hours.weekday_text?.map((hours, index) => (
                  <li key={index}>{hours}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Contact Buttons */}
        <div className="flex flex-col gap-2">
          <Button className="w-full" onClick={onGetDirections}>
            <Navigation2 className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
          
          {restaurant.formatted_phone_number && (
            <Button variant="outline" className="w-full" 
              onClick={() => window.location.href = `tel:${restaurant.formatted_phone_number}`}
            >
              <Phone className="w-4 h-4 mr-2" />
              {restaurant.formatted_phone_number}
            </Button>
          )}
          
          {restaurant.website && (
            <Button variant="outline" className="w-full"
              onClick={() => window.open(restaurant.website, '_blank')}
            >
              <Globe className="w-4 h-4 mr-2" />
              Visit Website
            </Button>
          )}
        </div>
      </Card>

      {/* Map */}
      {restaurant.geometry && (
        <Card className="overflow-hidden">
          <div className="h-[300px]">
            <GoogleMapView 
              businessList={[restaurant]}
              center={{
                lat: restaurant.geometry.location.lat,
                lng: restaurant.geometry.location.lng
              }}
            />
          </div>
        </Card>
      )}
    </>
  )
} 