'use client'

import { useState, useEffect, useContext } from 'react'
import { useAuth } from "@/context/AuthContext"
import { LocationContext } from '@/context/LocationContext'
import Link from "next/link"
import { useRef } from "react"
import { 
  Home, Search, Heart, MapPin, Clock, Settings, LogOut, UtensilsCrossed, X, Menu 
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Moon, Sun, Laptop } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

export default function HeaderNavBar() {
  const { user, signOut } = useAuth()
  const { userLocation, locationError } = useContext(LocationContext)
  const [profileClick, setProfileClick] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const dropdownRef = useRef(null)
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const { settings, updateSetting } = useSettings()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isTabletMenuOpen, setIsTabletMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (settings?.preferences?.theme) {
      setTheme(settings.preferences.theme)
    }
  }, [settings?.preferences?.theme, setTheme])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleNearby = () => {
    if (userLocation) {
      router.push(`/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}`)
    } else if (!locationError) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          router.push(`/nearby?lat=${position.coords.latitude}&lng=${position.coords.longitude}`)
          setIsLoading(false)
        },
        (error) => {
          alert("Please enable location services to find nearby restaurants")
          setIsLoading(false)
        }
      )
    }
  }

  const menuItems = [
    { name: 'Home', icon: <Home className="w-4 h-4" />, href: '/' },
    { 
      name: 'Near Me', 
      icon: <MapPin className="w-4 h-4" />, 
      onClick: handleNearby,
      showLocation: true
    },
    { name: 'Favorites', icon: <Heart className="w-4 h-4" />, href: '/favorites' },
    { name: 'Recent', icon: <Clock className="w-4 h-4" />, href: '/recent' },
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileClick(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!mounted) {
    return null
  }

  return user && (
    <div className="relative">
      <div className="flex items-center justify-between p-3 bg-background border-b shadow-sm relative z-50">
        {/* Logo - Always visible */}
        <Link href="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="font-bold text-lg sm:text-xl whitespace-nowrap bg-gradient-to-r from-foreground via-foreground/70 to-foreground bg-clip-text text-transparent">
            Arcaureus Limit
          </span>
        </Link>

        {/* Desktop Navigation (Large Screens) */}
        <nav className="hidden xl:flex items-center gap-1">
          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="relative mr-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants..."
              className="w-64 px-4 py-2 rounded-full bg-muted focus:bg-background focus:ring-2 focus:ring-foreground/5 outline-none transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="w-4 h-4 text-muted-foreground" />
            </button>
          </form>

          {/* Desktop Nav Items */}
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-muted-foreground hover:bg-foreground hover:text-background transition-all"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ) : (
                <button
                  onClick={item.onClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-muted-foreground hover:bg-foreground hover:text-background transition-all"
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {item.showLocation && (
                    <div className={`w-2 h-2 rounded-full ${
                      isLoading ? 'bg-yellow-500' :
                      userLocation ? 'bg-green-500' : 
                      'bg-red-500'
                    }`} />
                  )}
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Tablet Navigation (Medium Screens) */}
        <div className="hidden md:flex xl:hidden items-center gap-4">
          {/* Search Bar - Tablet */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-48 px-4 py-2 rounded-full bg-muted focus:bg-background focus:ring-2 focus:ring-foreground/5 outline-none transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="w-4 h-4 text-muted-foreground" />
            </button>
          </form>

          {/* Theme Toggle - Tablet */}
          <button
            onClick={() => {
              const newTheme = theme === 'dark' ? 'light' : 'dark'
              setTheme(newTheme)
              updateSetting('preferences', 'theme', newTheme)
            }}
            className="p-2 rounded-full hover:bg-muted"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Menu Dropdown - Tablet */}
          <div className="relative">
            <button
              onClick={() => setIsTabletMenuOpen(!isTabletMenuOpen)}
              className="p-2 rounded-full hover:bg-muted flex items-center gap-2"
            >
              <Menu className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {isTabletMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-background rounded-xl shadow-lg ring-1 ring-black/5"
                >
                  <div className="p-2 space-y-1">
                    {menuItems.map((item) => (
                      <div key={item.name}>
                        {item.href ? (
                          <Link
                            href={item.href}
                            onClick={() => setIsTabletMenuOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-lg text-muted-foreground hover:bg-muted transition-all"
                          >
                            {item.icon}
                            <span>{item.name}</span>
                          </Link>
                        ) : (
                          <button
                            onClick={() => {
                              item.onClick?.()
                              setIsTabletMenuOpen(false)
                            }}
                            className="flex items-center gap-3 w-full p-2 rounded-lg text-muted-foreground hover:bg-muted transition-all"
                          >
                            {item.icon}
                            <span>{item.name}</span>
                            {item.showLocation && (
                              <div className={`ml-auto w-2 h-2 rounded-full ${
                                isLoading ? 'bg-yellow-500' :
                                userLocation ? 'bg-green-500' : 
                                'bg-red-500'
                              }`} />
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Profile and Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileClick(!profileClick)}
              className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden hover:ring-2 hover:ring-black/5 transition-all"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  {user.email?.[0].toUpperCase()}
                </div>
              )}
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {profileClick && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black/5"
                >
                  <div className="p-3 border-b border-gray-100">
                    <p className="font-medium text-sm">{user.displayName || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  
                  <div className="p-2">
                    <Link 
                      href="/settings" 
                      className="flex items-center gap-2 w-full p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setProfileClick(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        setProfileClick(false)
                      }}
                      className="flex items-center gap-2 w-full p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button (Only visible on mobile) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu (Only visible on mobile) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-0 top-[57px] bg-background border-b shadow-lg z-40"
          >
            <div className="p-4 space-y-4">
              {/* Search Bar - Mobile */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants..."
                  className="w-full px-4 py-2 rounded-full bg-muted focus:bg-background focus:ring-2 focus:ring-foreground/5 outline-none transition-all"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                </button>
              </form>

              {/* Mobile Nav Items */}
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <div key={item.name}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:bg-muted transition-all"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          item.onClick()
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex items-center gap-3 w-full p-3 rounded-lg text-muted-foreground hover:bg-muted transition-all"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                        {item.showLocation && (
                          <div className={`w-2 h-2 rounded-full ${
                            isLoading ? 'bg-yellow-500' :
                            userLocation ? 'bg-green-500' : 
                            'bg-red-500'
                          }`} />
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}