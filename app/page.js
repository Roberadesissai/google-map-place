"use client"
import GlobalApi from '@/Shared/GlobalApi'
import CategoryList from '@/components/Home/CategoryList'
import GoogleMapView from '@/components/Home/GoogleMapView'
import BusinessList from '@/components/Home/BusinessList'
import RangeSelect from '@/components/Home/RangeSelect'
import SelectRating from '@/components/Home/SelectRating'
import { useContext, useEffect, useState } from 'react'
import { UserLocationContext } from '@/context/UserLocationContext'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const { userLocation } = useContext(UserLocationContext)
  const [category, setCategory] = useState()
  const [radius, setRadius] = useState(2500)
  const [businessList, setBusinessList] = useState([])
  const [businessListOrg, setBusinessListOrg] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    if (category && userLocation) {
      getBusinessList(category)
    }
  }, [category, radius, userLocation])

  const getBusinessList = async (category) => {
    if (!userLocation) return
    
    const location = `${userLocation.lat},${userLocation.lng}`
    let searchQuery = 'restaurant'
    
    if (category && category !== 'all') {
      searchQuery = `${category} restaurant`
    }

    try {
      const response = await fetch(
        `/api/google-place?` +
        `lat=${userLocation.lat}&` +
        `lng=${userLocation.lng}&` +
        `radius=${radius}&` +
        `category=${searchQuery}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch restaurants')
      }

      const data = await response.json()
      setBusinessList(data.results)
      setBusinessListOrg(data.results)
    } catch (error) {
      console.error('Error fetching businesses:', error)
    }
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-4'>
      <div className='p-3'>
        <CategoryList onCategoryChange={setCategory} />
        <RangeSelect onRadiusChange={(value) => setRadius(value)} />
        <SelectRating onRatingChange={(rating) => {
          if (rating.length === 0) {
            setBusinessList(businessListOrg)
          } else {
            const filtered = businessListOrg.filter(item => 
              rating.some(r => item.rating >= r)
            )
            setBusinessList(filtered)
          }
        }} />
      </div>
      <div className='col-span-3'>
        <GoogleMapView businessList={businessList} />
        <div className='absolute bottom-0 w-full z-10'>
          <BusinessList businessList={businessList} />
        </div>
      </div>
    </div>
  )
}