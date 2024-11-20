"use client"
import HeaderNavBar from '@/components/HeaderNavBar'
import { ThemeProvider } from "@/components/theme-provider"
import './globals.css'
import { Raleway } from 'next/font/google'
import { useEffect, useState } from 'react'
import { UserLocationContext } from '@/context/UserLocationContext'
import { SelectedBusinessContext } from '@/context/SelectedBusinessContext'
import { LocationProvider } from '@/context/LocationContext'
import GoogleMapsWrapper from '@/components/GoogleMapsWrapper'
import { GoogleMapsProvider } from '@/components/GoogleMapsProvider'
import { Toaster } from "@/components/ui/toaster"
import { SettingsProvider } from '@/context/SettingsContext'
import { AuthProvider } from '@/context/AuthContext'
import { UserDataProvider } from '@/context/UserDataContext'

const raleway = Raleway({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const [userLocation, setUserLocation] = useState({
    lat: 37.7749,
    lng: -122.4194
  });
  const [selectedBusiness, setSelectedBusiness] = useState({});
  
  useEffect(() => {
    getUserLocation();
  }, [])

  const getUserLocation = async () => {
    // Check if we're in a secure context (HTTPS or localhost)
    const isSecureContext = window.isSecureContext;
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    if (!isSecureContext && !isLocalhost) {
      console.warn("Geolocation requires a secure context (HTTPS) unless on localhost");
      // Fallback to IP-based geolocation
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserLocation({
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude)
        });
      } catch (error) {
        console.error("Error getting location from IP:", error);
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function(pos) {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      function(error) {
        console.error("Geolocation error:", error);
        // Fallback to IP-based geolocation
        fetch('https://ipapi.co/json/')
          .then(response => response.json())
          .then(data => {
            setUserLocation({
              lat: parseFloat(data.latitude),
              lng: parseFloat(data.longitude)
            });
          })
          .catch(error => console.error("IP geolocation error:", error));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };
 
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={raleway.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <AuthProvider>
            <UserDataProvider>
              <SettingsProvider>
                <LocationProvider>
                  <UserLocationContext.Provider value={{userLocation, setUserLocation}}>
                    <SelectedBusinessContext.Provider value={{selectedBusiness, setSelectedBusiness}}>
                      <GoogleMapsProvider>
                        <GoogleMapsWrapper>
                          <HeaderNavBar/>
                          {children}
                          <Toaster />
                        </GoogleMapsWrapper>
                      </GoogleMapsProvider>
                    </SelectedBusinessContext.Provider>
                  </UserLocationContext.Provider>
                </LocationProvider>
              </SettingsProvider>
            </UserDataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
