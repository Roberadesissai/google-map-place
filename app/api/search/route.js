import { NextResponse } from 'next/server'
import { searchNearbyPlaces } from '@/lib/google-maps'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  if (!query || !lat || !lng) {
    return NextResponse.json(
      { message: 'Missing required parameters' },
      { status: 400 }
    )
  }

  try {
    const results = await searchNearbyPlaces(query, lat, lng)
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { message: 'Failed to search restaurants' },
      { status: 500 }
    )
  }
} 