'use client'

import { createContext, useState, useEffect } from 'react'

export const UserLocationContext = createContext(null)

export const UserLocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setUserLocation({
            lat: 37.7749,
            lng: -122.4194
          })
          setLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    } else {
      console.log('Geolocation is not supported')
      setUserLocation({
        lat: 37.7749,
        lng: -122.4194
      })
      setLoading(false)
    }
  }, [])

  return (
    <UserLocationContext.Provider value={{ userLocation, setUserLocation }}>
      {!loading && userLocation ? children : <div>Loading location...</div>}
    </UserLocationContext.Provider>
  )
}