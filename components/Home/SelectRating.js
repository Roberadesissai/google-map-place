'use client'

import React, { useState } from 'react'
import { ratings } from '@/Shared/Data'
import { Star, Stars } from 'lucide-react'
import { motion } from 'framer-motion'

function SelectRating({ onRatingChange }) {
  const [selectedRatings, setSelectedRatings] = useState([])

  const handleRatingChange = (rating) => {
    let newSelectedRatings
    if (selectedRatings.includes(rating)) {
      newSelectedRatings = selectedRatings.filter(r => r !== rating)
    } else {
      newSelectedRatings = [...selectedRatings, rating]
    }
    setSelectedRatings(newSelectedRatings)
    onRatingChange(newSelectedRatings)
  }

  return (
    <div className="w-full p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 
          dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-xl p-5 shadow-xl
          border border-purple-100 dark:border-purple-900/30"
      >
        {/* Background Decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-200/20 dark:bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-200/20 dark:bg-pink-600/10 rounded-full blur-3xl" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 
              dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Rating Filter
            </h2>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 
              flex items-center justify-center shadow-lg">
              <Stars className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Rating Options */}
          <div className="space-y-3">
            {ratings.map((item, index) => (
              <motion.label
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative flex items-center justify-between
                  p-3 rounded-xl cursor-pointer
                  transition-all duration-300 group
                  ${selectedRatings.includes(item.value)
                    ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20'
                    : 'hover:bg-white/50 dark:hover:bg-white/5'
                  }
                `}
              >
                <div className="flex gap-1">
                  {[...Array(parseInt(item.name))].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 transition-all duration-300 ${
                        selectedRatings.includes(item.value)
                          ? 'text-yellow-500 scale-110'
                          : 'text-yellow-400/50 group-hover:text-yellow-400'
                      }`}
                      fill="currentColor"
                    />
                  ))}
                </div>

                {/* Custom Checkbox */}
                <div className="relative">
                  <input
                    type="checkbox"
                    className="peer absolute opacity-0 w-full h-full cursor-pointer"
                    onChange={() => handleRatingChange(item.value)}
                    checked={selectedRatings.includes(item.value)}
                  />
                  <motion.div
                    animate={{
                      scale: selectedRatings.includes(item.value) ? 1 : 0.95,
                      backgroundColor: selectedRatings.includes(item.value) 
                        ? "rgb(147, 51, 234)" 
                        : "rgb(255, 255, 255)"
                    }}
                    className={`
                      w-6 h-6 rounded-lg border-2
                      flex items-center justify-center
                      transition-all duration-300 shadow-sm
                      ${selectedRatings.includes(item.value)
                        ? 'border-purple-500 dark:border-purple-400'
                        : 'border-gray-300 dark:border-gray-600 group-hover:border-purple-400'
                      }
                    `}
                  >
                    {selectedRatings.includes(item.value) && (
                      <motion.svg
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                          opacity: selectedRatings.includes(item.value) ? 1 : 0,
                          scale: selectedRatings.includes(item.value) ? 1 : 0.5
                        }}
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ 
                            pathLength: selectedRatings.includes(item.value) ? 1 : 0 
                          }}
                          transition={{ duration: 0.2 }}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    )}
                  </motion.div>
                </div>
              </motion.label>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SelectRating