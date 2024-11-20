export async function searchNearbyPlaces(query, lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=restaurant&keyword=${query}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`

  try {
    const response = await fetch(url)
    const data = await response.json()
    
    const restaurants = data.results.filter(place => 
      place.types.includes('restaurant') || 
      place.types.includes('food') || 
      place.types.includes('meal_takeaway')
    )
    
    return restaurants
  } catch (error) {
    console.error('Error searching places:', error)
    throw new Error('Failed to search places')
  }
} 