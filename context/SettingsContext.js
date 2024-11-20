'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useTheme } from 'next-themes'

const defaultSettings = {
  preferences: {
    theme: 'system',
    language: 'en',
    currency: 'USD',
    radius: 5,
    defaultRating: 4
  },
  notifications: {
    email: true,
    push: true
  },
  privacy: {
    shareLocation: true,
    shareHistory: false
  }
}

const SettingsContext = createContext({})

export const useSettings = () => useContext(SettingsContext)

export function SettingsProvider({ children }) {
  const { user } = useAuth()
  const [settings, setSettings] = useState(defaultSettings)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const fetchSettings = async () => {
      if (!user) return
      
      try {
        const docRef = doc(db, 'userSettings', user.uid)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const userSettings = docSnap.data()
          setSettings(userSettings)
          setTheme(userSettings.preferences.theme)
        } else {
          const newSettings = {
            ...defaultSettings,
            userId: user.uid,
            createdAt: new Date(),
            updatedAt: new Date()
          }
          await setDoc(docRef, newSettings)
          setSettings(newSettings)
          setTheme(newSettings.preferences.theme)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }

    if (user) {
      fetchSettings()
    }
  }, [user, setTheme])

  const updateSetting = async (category, key, value) => {
    if (!user) return

    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      },
      updatedAt: new Date()
    }

    setSettings(newSettings)

    if (category === 'preferences' && key === 'theme') {
      setTheme(value)
    }

    try {
      const docRef = doc(db, 'userSettings', user.uid)
      await setDoc(docRef, newSettings, { merge: true })
    } catch (error) {
      console.error('Error updating setting:', error)
    }
  }

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSetting,
      isLoading: !mounted 
    }}>
      {mounted && children}
    </SettingsContext.Provider>
  )
} 