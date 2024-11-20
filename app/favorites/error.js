'use client'

export default function Error({ error, reset }) {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button 
        onClick={() => reset()}
        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  )
} 