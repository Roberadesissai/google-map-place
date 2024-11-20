import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const id = await params.id

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=name,rating,formatted_phone_number,formatted_address,opening_hours,photos,reviews,website,price_level,user_ratings_total,geometry&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`

  try {
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.status !== 'OK') {
      throw new Error('Failed to fetch place details')
    }

    return NextResponse.json(data.result)
  } catch (error) {
    console.error('Error fetching place details:', error)
    return NextResponse.json(
      { message: 'Failed to fetch restaurant details' },
      { status: 500 }
    )
  }
} 