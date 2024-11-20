import { NextResponse } from "next/server";

export async function GET(request){

    const {searchParams}=new URL(request.url)
    const category=searchParams.get('category');
    const radius = searchParams.get("radius");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${lat},${lng}&` +
        `radius=${radius}&` +
        `type=restaurant&` +
        `keyword=${category}&` +
        `key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`

    try {
        const response = await fetch(url)
        const data = await response.json()
        
        if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
            throw new Error(data.error_message || 'Failed to fetch places')
        }
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching places:', error)
        return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 })
    }
}