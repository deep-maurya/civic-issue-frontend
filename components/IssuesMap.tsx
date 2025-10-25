'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { GoogleMap, useJsApiLoader, Marker, Libraries } from '@react-google-maps/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Trash2,
  Lightbulb,
  Droplets,
  Route,
  Waves,
  Zap,
  TreePine,
  Bus,
  Cross,
  MapPin,
} from 'lucide-react'

// Types
interface CivicIssue {
  id: number
  type:
    | 'Garbage'
    | 'Street Light'
    | 'Water Leakage'
    | 'Road'
    | 'Drainage'
    | 'Electricity'
    | 'Parks'
    | 'Transport'
    | 'Health'
    | 'User Location'
  status: 'Reported' | 'In Progress' | 'Resolved' | 'Current'
  lat: number
  lng: number
  description: string
}

// Hardcoded civic issues data
const civicIssues: CivicIssue[] = [
  { id: 1, type: 'Garbage', status: 'Reported', lat: 19.4778, lng: 72.8089, description: 'Garbage dumped near Vasai Road railway station.' },
  { id: 2, type: 'Street Light', status: 'In Progress', lat: 19.4856, lng: 72.8156, description: 'Streetlight not working on Virar West main road.' },
  { id: 3, type: 'Water Leakage', status: 'Resolved', lat: 19.4723, lng: 72.8023, description: 'Pipeline leakage near Vasai fort area fixed.' },
  { id: 4, type: 'Road', status: 'Reported', lat: 19.4891, lng: 72.8212, description: 'Potholes on Mumbai-Ahmedabad highway near Virar.' },
  { id: 5, type: 'Drainage', status: 'In Progress', lat: 19.4654, lng: 72.7891, description: 'Blocked drainage causing waterlogging in Vasai East.' },
  { id: 6, type: 'Electricity', status: 'Reported', lat: 19.4923, lng: 72.8345, description: 'Power outage in Virar East residential area.' },
  { id: 7, type: 'Parks', status: 'In Progress', lat: 19.4789, lng: 72.8123, description: 'Maintenance required for Vasai public garden.' },
  { id: 8, type: 'Transport', status: 'Reported', lat: 19.4756, lng: 72.8067, description: 'Bus stop shelter damaged near Vasai station.' },
  { id: 9, type: 'Health', status: 'Resolved', lat: 19.4812, lng: 72.8189, description: 'Medical waste disposal issue resolved at Virar hospital.' },
  { id: 10, type: 'Garbage', status: 'In Progress', lat: 19.4678, lng: 72.7956, description: 'Garbage collection irregular in Vasai West slums.' },
  { id: 11, type: 'Road', status: 'Reported', lat: 19.4945, lng: 72.8278, description: 'Speed breaker missing near Virar school zone.' },
  { id: 12, type: 'Street Light', status: 'Reported', lat: 19.4634, lng: 72.7834, description: 'Dark spot near Vasai fort entrance needs lighting.' },
  { id: 13, type: 'Water Leakage', status: 'In Progress', lat: 19.4867, lng: 72.8098, description: 'Water pipeline burst near Virar market area.' },
  { id: 14, type: 'Drainage', status: 'Reported', lat: 19.4723, lng: 72.8012, description: 'Sewage overflow in Vasai East residential colony.' },
  { id: 15, type: 'Electricity', status: 'In Progress', lat: 19.4898, lng: 72.8234, description: 'Street light pole damaged in Virar West.' },
  { id: 16, type: 'Parks', status: 'Reported', lat: 19.4756, lng: 72.8145, description: 'Playground equipment broken in Vasai children park.' },
  { id: 17, type: 'Transport', status: 'In Progress', lat: 19.4812, lng: 72.8167, description: 'Auto-rickshaw stand encroachment on main road.' },
  { id: 18, type: 'Health', status: 'Reported', lat: 19.4689, lng: 72.7923, description: 'Mosquito breeding in stagnant water near Vasai creek.' },
  { id: 19, type: 'Garbage', status: 'Resolved', lat: 19.4956, lng: 72.8298, description: 'Garbage collection point cleaned in Virar North.' },
  { id: 20, type: 'Road', status: 'In Progress', lat: 19.4645, lng: 72.7876, description: 'Road widening work in progress near Vasai station.' },
]

// Map configuration
const mapContainerStyle = { width: '100%', height: '600px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }
const center = { lat: 19.4778, lng: 72.8089 }
const libraries: Libraries = ['places']

// Map Lucide icons
const getLucideIcon = (type: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    Garbage: Trash2,
    'Street Light': Lightbulb,
    'Water Leakage': Droplets,
    Road: Route,
    Drainage: Waves,
    Electricity: Zap,
    Parks: TreePine,
    Transport: Bus,
    Health: Cross,
    'User Location': MapPin,
  }
  return iconMap[type] || Trash2
}

// Get icon SVG string
const getLucideIconSVG = (type: string) => {
  const iconSVGs: Record<string, string> = {
    Garbage: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18l-2 13H5L3 6zM8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>',
    'Street Light': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9c0-4.97 4.03-9 9-9s9 4.03 9 9z"/></svg>',
    'Water Leakage': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    Road: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>',
    Drainage: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20M2 6h20M2 18h20"/></svg>',
    Electricity: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    Parks: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    Transport: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 17h8M8 13h8M8 9h8M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>',
    Health: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2H9a2 2 0 0 0-2 2v5.586a1 1 0 0 0 .293.707l5.414 5.414a1 1 0 0 0 .707.293H19a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2z"/></svg>',
    'User Location': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  }
  return iconSVGs[type] || iconSVGs.Garbage
}

// Custom pin marker
const createCustomPinMarker = (type: string, status: string) => {
  const statusColors: Record<string, { gradient: string[] }> = {
    Reported: { gradient: ['#FF6B6B', '#EE5A52'] },
    'In Progress': { gradient: ['#FFB347', '#FF8C42'] },
    Resolved: { gradient: ['#4ECDC4', '#44A08D'] },
    Current: { gradient: ['#667eea', '#764ba2'] },
  }
  const colors = statusColors[status] || statusColors.Reported

  const svgString = `
    <svg width="50" height="60" viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.gradient[0]};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.gradient[1]};stop-opacity:1" />
        </linearGradient>
      </defs>
      <ellipse cx="25" cy="57" rx="10" ry="3" fill="rgba(0,0,0,0.3)"/>
      <path d="M25 3 C35 3, 45 13, 45 23 C45 33, 35 43, 25 43 L25 57 C15 43, 5 33, 5 23 C5 13, 15 3, 25 3 Z" fill="url(#pinGradient)" stroke="white" stroke-width="2"/>
      <path d="M25 5 C33 5, 41 13, 41 21 C41 29, 33 37, 25 37 C17 37, 9 29, 9 21 C9 13, 17 5, 25 5 Z" fill="rgba(255,255,255,0.2)" stroke="none"/>
      <g transform="translate(13, 13)">${getLucideIconSVG(type)}</g>
    </svg>
  `
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const svgUrl = URL.createObjectURL(svgBlob)
  return {
    url: svgUrl,
    scaledSize: new window.google.maps.Size(50, 60),
    anchor: new window.google.maps.Point(25, 60),
    origin: new window.google.maps.Point(0, 0),
  }
}

const IssuesMap: React.FC = () => {
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [issues] = useState<CivicIssue[]>(civicIssues)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [mapCenter, setMapCenter] = useState(center)

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  })

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.')
      return
    }
    setIsLoadingLocation(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const newLocation = { lat: latitude, lng: longitude }
        setUserLocation(newLocation)
        setMapCenter(newLocation)
        setIsLoadingLocation(false)
      },
      (error) => {
        setIsLoadingLocation(false)
        let errorMessage = 'Unable to get your location.'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Using default location.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        setLocationError(errorMessage)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }, [])

  useEffect(() => {
    getUserLocation()
  }, [getUserLocation])

  const handleMarkerClick = useCallback((issue: CivicIssue) => {
    setSelectedIssue(issue)
    setIsDialogOpen(true)
  }, [])

  const handleUserLocationClick = useCallback(() => {
    if (userLocation) {
      setSelectedIssue({
        id: 0,
        type: 'User Location',
        status: 'Current',
        lat: userLocation.lat,
        lng: userLocation.lng,
        description: 'Your current location',
      })
      setIsDialogOpen(true)
    }
  }, [userLocation])

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false)
    setSelectedIssue(null)
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Map</h3>
          <p className="text-gray-500">Preparing your civic issues dashboard...</p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-700 mb-2">Map Loading Failed</h3>
          <p className="text-red-600 mb-4">Unable to load the map. Please check your Google Maps API key configuration.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full relative">
      {/* Location Controls */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
        <button
          onClick={getUserLocation}
          disabled={isLoadingLocation}
          className="bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 px-4 py-3 rounded-xl shadow-lg border border-gray-200 flex items-center gap-3 text-sm font-semibold transition-all duration-200 hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
        >
          {isLoadingLocation ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
              <span>Locating...</span>
            </>
          ) : (
            <>
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>My Location</span>
            </>
          )}
        </button>

        {userLocation && (
          <div className="bg-green-500 px-3 py-2 rounded-full shadow-md text-xs text-white font-medium">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <span>Located</span>
            </div>
          </div>
        )}

        {locationError && (
          <div className="bg-amber-500 px-3 py-2 rounded-full shadow-md text-xs text-white font-medium max-w-48">
            <div className="flex items-center gap-2">
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="truncate">{locationError}</span>
            </div>
          </div>
        )}
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={userLocation ? 12 : 10}
        options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: true }}
      >
        {/* User Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={createCustomPinMarker('User Location', 'Current')}
            title="Your Location"
            animation={window.google.maps.Animation.BOUNCE}
            onClick={handleUserLocationClick}
            zIndex={1000}
          />
        )}

        {/* Issue Markers */}
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={{ lat: issue.lat, lng: issue.lng }}
            icon={createCustomPinMarker(issue.type, issue.status)}
            onClick={() => handleMarkerClick(issue)}
            title={`${issue.type} - ${issue.status}`}
            animation={window.google.maps.Animation.DROP}
          />
        ))}
      </GoogleMap>

      {/* Issue Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-6">
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl ${
                  selectedIssue?.status === 'Reported'
                    ? 'bg-gradient-to-br from-red-400 to-red-600'
                    : selectedIssue?.status === 'In Progress'
                    ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                    : selectedIssue?.status === 'Resolved'
                    ? 'bg-gradient-to-br from-green-400 to-green-600'
                    : 'bg-gradient-to-br from-blue-400 to-blue-600'
                }`}
              >
                {selectedIssue && React.createElement(getLucideIcon(selectedIssue.type), { className: 'w-10 h-10 text-white' })}
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white">{selectedIssue?.type}</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300 text-lg">
                  {selectedIssue?.type === 'User Location' ? 'Your Current Location' : 'Civic Issue Report'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedIssue && (
            <div className="space-y-8">
              {/* Status */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      selectedIssue.status === 'Reported'
                        ? 'bg-red-500'
                        : selectedIssue.status === 'In Progress'
                        ? 'bg-orange-500'
                        : selectedIssue.status === 'Resolved'
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}
                  ></div>
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Current Status</span>
                </div>
                <span
                  className={`px-6 py-3 rounded-2xl text-lg font-bold shadow-lg ${
                    selectedIssue.status === 'Reported'
                      ? 'bg-red-100 text-red-800 border-2 border-red-200'
                      : selectedIssue.status === 'In Progress'
                      ? 'bg-orange-100 text-orange-800 border-2 border-orange-200'
                      : selectedIssue.status === 'Resolved'
                      ? 'bg-green-100 text-green-800 border-2 border-green-200'
                      : 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                  }`}
                >
                  {selectedIssue.status}
                </span>
              </div>

              {/* Description */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">Description</h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{selectedIssue.description}</p>
              </div>

              {/* Coordinates */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center shadow-md">
                    <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">Location Coordinates</h4>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 shadow-md">
                    <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">LATITUDE</div>
                    <div className="text-lg font-mono font-bold text-gray-900 dark:text-white">{selectedIssue.lat.toFixed(6)}</div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 shadow-md">
                    <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">LONGITUDE</div>
                    <div className="text-lg font-mono font-bold text-gray-900 dark:text-white">{selectedIssue.lng.toFixed(6)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default IssuesMap
