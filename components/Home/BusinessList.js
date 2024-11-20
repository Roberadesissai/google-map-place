import React, { useContext, useRef } from 'react'
import BusinessItem from './BusinessItem'
import { SelectedBusinessContext } from '@/context/SelectedBusinessContext'
import { motion } from 'framer-motion'
import { useSettings } from '@/context/SettingsContext'

function BusinessList({ businessList }) {
  const elementRef = useRef(null)
  const { selectedBusiness, setSelectedBusiness } = useContext(SelectedBusinessContext)
  const { settings, formatCurrency } = useSettings()

  const slideRight = (element) => {
    element.scrollLeft += 500
  }
  
  const slideLeft = (element) => {
    element.scrollLeft -= 500
  }

  return (
    <div className='fixed bottom-5 w-[90%] md:w-[75%]'>
      <div className='relative'>
        <svg 
          xmlns="http://www.w3.org/2000/svg"  
          fill="none" 
          viewBox="0 0 24 24" 
          onClick={() => slideLeft(elementRef.current)} 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-8 h-8 absolute -left-10 top-[35%]
          bg-white cursor-pointer p-1 rounded-full text-gray-700 z-10 hover:bg-gray-100"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>

        <div 
          className='flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth pb-5' 
          ref={elementRef}
        >
          {businessList?.map((item, index) => (
            <div 
              key={index} 
              className={`cursor-pointer flex-shrink-0
                ${selectedBusiness?.place_id === item.place_id ? 'scale-105' : 'scale-100'}`}
              onClick={() => setSelectedBusiness(item)}
            >
              <BusinessItem business={item} />
            </div>
          ))}
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          onClick={() => slideRight(elementRef.current)}
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 absolute -right-10 top-[35%]
          bg-white cursor-pointer p-1 rounded-full text-gray-700 z-10 hover:bg-gray-100"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </div>
  )
}

export default BusinessList