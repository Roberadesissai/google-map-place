import React, { useState } from 'react'

function RangeSelect({onRadiusChange}) {
    const [radius, setRadius] = useState(2)

    const handleRadiusChange = (value) => {
        setRadius(value)
        onRadiusChange(value * 1609.34)
    }

    return (
        <div className='mt-5 px-2'>
            <h2 className='font-bold dark:text-gray-100'>
                Select Distance
            </h2>
            <input 
                type='range'
                className='w-full accent-purple-500 hover:accent-purple-600
                    cursor-pointer rounded-lg appearance-none
                    bg-gradient-to-r from-purple-200 to-purple-400
                    dark:from-purple-900 dark:to-purple-600
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:dark:bg-gray-200
                    [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-purple-500
                    [&::-webkit-slider-thumb]:dark:border-purple-400
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:transition-all
                    [&::-webkit-slider-thumb]:hover:scale-110'
                min="0.5"
                max="10"
                step="0.5"
                onChange={(e) => handleRadiusChange(e.target.value)}
                defaultValue={radius}
            />
            <label className='text-gray-500 dark:text-gray-400 text-sm'>
                {radius} {radius === 1 ? "mile" : "miles"}
            </label>
        </div>
    )
}

export default RangeSelect