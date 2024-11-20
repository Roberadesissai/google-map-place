'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const UserDataContext = createContext()

export function UserDataProvider({ children }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [recents, setRecents] = useState([])

  const addToFavorites = async (restaurant) => {
    if (!user?.uid || !restaurant?.place_id) {
      console.error('Missing user or restaurant data:', { userId: user?.uid, restaurant })
      return
    }

    try {
      const userRef = doc(db, 'users', user.uid)
      console.log('Adding restaurant to favorites:', restaurant)
      
      // Get current favorites first
      const docSnap = await getDoc(userRef)
      const currentFavorites = docSnap.exists() ? docSnap.data().favorites || [] : []
      
      // Add new restaurant to favorites array
      const newFavorites = [...currentFavorites, {
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
      }]

      // Update the document
      await setDoc(userRef, {
        favorites: newFavorites,
        updatedAt: new Date().toISOString(),
        userId: user.uid
      }, { merge: true })

      console.log('Successfully updated Firestore')
      setFavorites(newFavorites)
    } catch (error) {
      console.error('Error adding to favorites:', error)
      throw error
    }
  }

  const removeFromFavorites = async (placeId) => {
    if (!user?.uid) {
      console.error('No user ID found')
      return
    }

    try {
      const userRef = doc(db, 'users', user.uid)
      console.log('Removing restaurant with ID:', placeId)
      
      // Get current favorites
      const docSnap = await getDoc(userRef)
      const currentFavorites = docSnap.exists() ? docSnap.data().favorites || [] : []
      
      // Remove the restaurant
      const newFavorites = currentFavorites.filter(fav => fav.place_id !== placeId)

      // Update the document
      await setDoc(userRef, {
        favorites: newFavorites,
        updatedAt: new Date().toISOString(),
        userId: user.uid
      }, { merge: true })

      console.log('Successfully removed from Firestore')
      setFavorites(newFavorites)
    } catch (error) {
      console.error('Error removing from favorites:', error)
      throw error
    }
  }

  // Load user data when auth state changes
  useEffect(() => {
    if (user?.uid) {
      const loadUserData = async () => {
        try {
          console.log('Loading user data for:', user.uid)
          const userRef = doc(db, 'users', user.uid)
          const docSnap = await getDoc(userRef)

          if (!docSnap.exists()) {
            console.log('Creating new user document')
            const initialData = {
              favorites: [],
              recents: [],
              userId: user.uid,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
            await setDoc(userRef, initialData)
            setFavorites([])
            setRecents([])
          } else {
            console.log('Found existing user document:', docSnap.data())
            const data = docSnap.data()
            setFavorites(data.favorites || [])
            setRecents(data.recents || [])
          }
        } catch (error) {
          console.error('Error loading user data:', error)
        }
      }
      loadUserData()
    }
  }, [user])

  const addToRecents = async (restaurant) => {
    if (!user?.uid || !restaurant?.place_id) return

    try {
      const userRef = doc(db, 'users', user.uid)
      
      const recentData = {
        place_id: restaurant.place_id,
        name: restaurant.name || '',
        timestamp: new Date().toISOString()
      }

      const newRecents = [recentData, ...recents].slice(0, 10)
      
      await updateDoc(userRef, {
        recents: newRecents
      })

      setRecents(newRecents)
    } catch (error) {
      console.error('Error adding to recents:', error)
    }
  }

  return (
    <UserDataContext.Provider value={{
      favorites,
      recents,
      addToFavorites,
      removeFromFavorites,
      addToRecents
    }}>
      {children}
    </UserDataContext.Provider>
  )
}

export const useUserData = () => useContext(UserDataContext) 