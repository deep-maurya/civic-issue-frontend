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
import IssueModal from './IssueModal'
import { useAuthSelector } from '@/features/auth/hooks.redux'
import { Issue } from '@/features/issue/type'

// Types
export interface CivicIssue {
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

interface IssuesMapProps {
  issues: CivicIssue[]
  theme?: 'light' | 'dark'
  isLoading: boolean
}

const mapContainerStyle = { width: '100%', height: '600px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }
const defaultCenter = { lat: 19.4778, lng: 72.8089 }
const libraries: Libraries = ['places']

// Light and Dark mode map styles
const mapStyles: Record<'light' | 'dark', google.maps.MapTypeStyle[]> = {
  light: [],
  dark: [
    { elementType: 'geometry', stylers: [{ color: '#1e1e2f' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#c5c6c7' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1e1e2f' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#000000' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#2c2c3d' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c3d' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f1626' }] },
  ],
}

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

// Custom Pin Marker
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

// Function to get SVG string (same as before)
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

const IssuesMap: React.FC<IssuesMapProps> = ({ issues, isLoading, theme = 'light' }) => {
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [showLoginPrompt,setShowLoginPrompt] = useState(false);
  const { isLoggedIn } = useAuthSelector();

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  })

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const newLocation = { lat: latitude, lng: longitude }
        setUserLocation(newLocation)
        setMapCenter(newLocation)
      },
      () => {}
    )
  }, [])

  useEffect(() => {
    getUserLocation()
  }, [getUserLocation])

  const handleMarkerClick = (issue: CivicIssue) => {
    setSelectedIssue(issue)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedIssue(null)
  }

  if (!isLoaded) return <div className="h-[600px] flex items-center justify-center">Loading Map...</div>
  if (loadError) return <div className="h-[600px] flex items-center justify-center text-red-600">Failed to load map</div>

  return (
    <div className="w-full relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={userLocation ? 12 : 10}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          styles: mapStyles[theme],
        }}
      >
        {!isLoading && issues.map((issue) => (
          <Marker
            key={issue?.description}
            position={{ lat: issue.lat, lng: issue.lng }}
            icon={createCustomPinMarker(issue.type, issue.status)}
            onClick={() => handleMarkerClick(issue)}
            title={`${issue.type} - ${issue.status}`}
            animation={window.google.maps.Animation.DROP}
          />
        ))}
      </GoogleMap>

      <IssueModal
        selectedIssue={selectedIssue as unknown as any}
        isModalOpen={isDialogOpen}
        setIsModalOpen={setIsDialogOpen}
        showLoginPrompt={showLoginPrompt}
        setShowLoginPrompt={setShowLoginPrompt}
      />
    </div>
  )
}

export default IssuesMap
