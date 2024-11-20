'use client'

import { UserLocationContext } from '@/context/UserLocationContext'
import { useSettings } from '@/context/SettingsContext'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function BusinessItem({ business }) {
    const { userLocation } = useContext(UserLocationContext)
    const { settings, formatCurrency } = useSettings()
    const [distance, setDistance] = useState()
    const [imageError, setImageError] = useState(false)

    const getPhotoUrl = () => {
        if (imageError || !business?.photos?.[0]?.photo_reference) {
            return '/placeholder.jpeg'
        }
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${business.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    }

    useEffect(() => {
        if (business?.geometry?.location && userLocation) {
            calculateDistance(
                business.geometry.location.lat,
                business.geometry.location.lng,
                userLocation.lat,
                userLocation.lng
            )
        }
    }, [business, userLocation])

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371
        const dLat = deg2rad(lat2 - lat1)
        const dLon = deg2rad(lon2 - lon1)
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        const d = R * c
        setDistance(d.toFixed(1))
    }

    const deg2rad = (deg) => deg * (Math.PI/180)

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-[280px] h-[120px] relative flex gap-3 p-2.5 bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 hover:shadow-md transition-all duration-300"
        >
            {/* Image Container */}
            <div className="w-[100px] h-full relative flex-shrink-0 rounded-lg overflow-hidden">
                <Image 
                    src={getPhotoUrl()}
                    alt={business.name}
                    className="object-cover transition-transform duration-300 hover:scale-110"
                    fill
                    onError={() => setImageError(true)}
                    priority
                />
                {business.rating && (
                    <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-sm flex items-center gap-0.5 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
                            fill="currentColor" className="w-3.5 h-3.5 text-yellow-500">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{business.rating}</span>
                    </div>
                )}
            </div>
            
            {/* Content Container */}
            <div className="flex flex-col justify-between flex-grow min-w-0">
                <div>
                    <h2 className="font-semibold text-[15px] line-clamp-1 text-gray-800">
                        {business.name}
                    </h2>
                    <p className="text-gray-500 text-xs line-clamp-2 mt-1">
                        {business.vicinity}
                    </p>
                </div>
                
                <div className="flex items-center justify-between">
                    {distance && (
                        <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                                strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <span className="text-gray-500 text-xs">{distance} km</span>
                        </div>
                    )}
                    
                    {business.price_level && (
                        <span className="text-green-600 text-xs font-medium">
                            {settings?.preferences?.currency === 'EUR' ? '€' :
                             settings?.preferences?.currency === 'GBP' ? '£' : '$'}
                            {business.price_level}
                        </span>
                    )}
                </div>
            </div>

            {/* Right Gradient Accent */}
            <div className="absolute right-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-gradient-to-b from-purple-500 via-fuchsia-500 to-pink-500 opacity-40" />
        </motion.div>
    )
}

export default BusinessItem