'use client'

import { createContext, useState, useEffect } from 'react'

export const LocationContext = createContext()

export function LocationProvider({ children }) {
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          setLocationError(error.message)
        }
      )
    } else {
      setLocationError("Geolocation is not supported by your browser")
    }
  }, [])

  return (
    <LocationContext.Provider value={{ userLocation, locationError }}>
      {children}
    </LocationContext.Provider>
  )
} 