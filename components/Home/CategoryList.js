import React, { useState } from 'react'
import Data from './../../Shared/Data'
import Image from 'next/image'

function CategoryList({onCategoryChange}) {
    const [categoryList] = useState(Data.categories)
    const [selectedCategory, setSelectedCategory] = useState()

    const handleCategoryClick = (item, index) => {
        setSelectedCategory(index)
        const categoryValue = item.value.toLowerCase().replace(' ', '_')
        onCategoryChange(categoryValue)
    }

    return (
        <div>
            <h2 className='font-bold px-2 dark:text-gray-100'>
                Select Food Type
            </h2>
            <div className='grid 
            grid-cols-2 
            md:grid-cols-2 
            lg:grid-cols-3'>
                {categoryList.map((item,index)=>(
                    <div key={index} 
                        className={`flex flex-col
                        justify-center items-center 
                        bg-gray-100/80 dark:bg-gray-800/80
                        backdrop-blur-sm
                        p-2 m-2 rounded-lg grayscale 
                        hover:grayscale-0 cursor-pointer
                        text-[13px] transition-all duration-300
                        hover:bg-white/80 dark:hover:bg-gray-700/80 
                        hover:shadow-md
                        border-purple-400
                        ${selectedCategory === index ? 
                          'grayscale-0 border-[1px] dark:border-purple-500' : null}`}
                        onClick={() => handleCategoryClick(item, index)}>
                        <div className="relative w-[32px] h-[32px] overflow-hidden group">
                            <Image 
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="32px"
                                className="object-contain transition-transform duration-300 group-hover:scale-110"
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                        <span className="mt-1 font-medium dark:text-gray-100">
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategoryList