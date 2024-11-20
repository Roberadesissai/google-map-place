import { UserLocationContext } from '@/context/UserLocationContext'
import { GoogleMap, MarkerF } from '@react-google-maps/api'
import React, { useContext, useEffect, useState } from 'react'
import Markers from './Markers'
import { SelectedBusinessContext } from '@/context/SelectedBusinessContext'

function GoogleMapView({businessList}) {
  const {userLocation} = useContext(UserLocationContext)
  const {selectedBusiness} = useContext(SelectedBusinessContext)
  const [map, setMap] = useState(null)

  const containerStyle = {
    width: '100%',
    height: '100vh',
  }

  useEffect(() => {
    if(map && selectedBusiness?.geometry) {
      map.panTo(selectedBusiness.geometry.location)
    }
  }, [selectedBusiness, map])

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation}
        options={{
          mapId: '6e96c5741eb8d946',
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
        zoom={13}
        onLoad={map => setMap(map)}
      >
        <MarkerF
          position={userLocation}
          icon={{
            url: '/user-location.png',
            scaledSize: {
              width: 50,
              height: 50
            }
          }}
        />
        
        {businessList?.map((item, index) => (
          <Markers 
            key={item.place_id || index}
            business={item}
            map={map}
          />
        ))}
      </GoogleMap>
    </div>
  )
}

export default React.memo(GoogleMapView)