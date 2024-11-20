import { NextResponse } from "next/server"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const category = searchParams.get("category")

  if (!lat || !lng) {
    return NextResponse.json({ error: "Location is required" }, { status: 400 })
  }

  const location = `${lat},${lng}`
  let searchQuery = 'restaurant'

  if (category && category !== 'all') {
    searchQuery = `${category} restaurant`
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${location}&` +
      `radius=5000&` +
      `type=restaurant&` +
      `keyword=${searchQuery}&` +
      `key=${process.env.GOOGLE_MAPS_API_KEY}`
    )

    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(data.error_message || 'Failed to fetch places')
    }

    const filteredResults = data.results?.filter(place => 
      place.types.includes('restaurant') || 
      place.types.includes('food')
    ) || []

    return NextResponse.json(filteredResults)
  } catch (error) {
    console.error('Error fetching places:', error)
    return NextResponse.json(
      { error: 'Failed to fetch places' }, 
      { status: 500 }
    )
  }
} 