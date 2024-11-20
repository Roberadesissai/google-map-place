import Image from "next/image"
import { motion } from "framer-motion"

export default function CategoryCard({ item, selected, onClick }) {
  return (
    <motion.div
      onClick={() => onClick(item)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative group cursor-pointer
        backdrop-blur-md backdrop-saturate-150
        rounded-2xl p-4 transition-all duration-300
        ${selected 
          ? 'bg-white/80 shadow-lg scale-[1.02] ring-1 ring-black/5' 
          : 'bg-white/60 hover:bg-white/70 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-center gap-4">
        {/* Image */}
        <div className={`
          relative w-16 h-16 rounded-xl overflow-hidden
          transition-transform duration-300
          ${selected ? 'scale-105' : 'group-hover:scale-105'}
        `}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-semibold text-black/80">{item.name}</h3>
          <p className="text-sm text-black/50 line-clamp-2 mt-1">
            {item.description}
          </p>
        </div>

        {/* Count Badge */}
        <div className="h-6 px-2 rounded-full bg-black/5 flex items-center justify-center">
          <span className="text-xs font-medium text-black/70">
            {item.itemCount}
          </span>
        </div>
      </div>
    </motion.div>
  )
} 