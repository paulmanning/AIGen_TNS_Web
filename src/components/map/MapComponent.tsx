'use client'

import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Set the access token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
if (!MAPBOX_TOKEN) {
  console.error('Mapbox token is missing!')
}
mapboxgl.accessToken = MAPBOX_TOKEN

interface MapComponentProps {
  center: [number, number]
  zoom: number
  onChange: (center: [number, number], zoom: number) => void
}

export function MapComponent({ center, zoom, onChange }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const coordinatesDivRef = useRef<HTMLDivElement | null>(null)
  const isUserInteraction = useRef(false)

  const formatCoords = (lat: number, lon: number) => {
    const latDir = lat >= 0 ? 'N' : 'S'
    const lonDir = lon >= 0 ? 'E' : 'W'
    return `${Math.abs(lat).toFixed(4)}°${latDir} ${Math.abs(lon).toFixed(4)}°${lonDir}`
  }

  const handleMapChange = () => {
    if (!map.current || !coordinatesDivRef.current) return
    
    const mapCenter = map.current.getCenter()
    const currentZoom = map.current.getZoom()
    const newCoords: [number, number] = [
      Number(mapCenter.lng.toFixed(4)),
      Number(mapCenter.lat.toFixed(4))
    ]
    
    coordinatesDivRef.current.innerHTML = formatCoords(newCoords[1], newCoords[0])
    
    if (isUserInteraction.current) {
      const roundedZoom = Number(currentZoom.toFixed(2))
      onChange(newCoords, roundedZoom)
    }
  }

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom,
        attributionControl: true,
        scrollZoom: true,
        dragPan: true,
        dragRotate: false,
        keyboard: true,
        doubleClickZoom: true,
        touchZoomRotate: true,
        maxZoom: 20,
        minZoom: 1
      })

      const coordinatesDiv = document.createElement('div')
      coordinatesDivRef.current = coordinatesDiv
      coordinatesDiv.className = 'bg-black bg-opacity-50 text-white px-4 py-1 rounded-b shadow text-center'
      coordinatesDiv.style.position = 'absolute'
      coordinatesDiv.style.top = '0'
      coordinatesDiv.style.left = '50%'
      coordinatesDiv.style.transform = 'translateX(-50%)'
      coordinatesDiv.style.zIndex = '1'
      coordinatesDiv.style.minWidth = '200px'
      coordinatesDiv.style.fontSize = '14px'
      coordinatesDiv.style.fontFamily = 'monospace'
      mapContainer.current.appendChild(coordinatesDiv)

      map.current.on('load', () => {
        if (!map.current) return

        // Disable rotation controls after map is loaded
        map.current.dragRotate.disable()
        map.current.touchZoomRotate.disableRotation()

        map.current.addControl(
          new mapboxgl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: true
          }),
          'top-right'
        )

        map.current.addControl(
          new mapboxgl.ScaleControl({
            maxWidth: 200,
            unit: 'nautical'
          }),
          'bottom-left'
        )

        handleMapChange()
      })

      // Track user interactions
      map.current.on('dragstart', () => { isUserInteraction.current = true })
      map.current.on('zoomstart', () => { isUserInteraction.current = true })
      map.current.on('movestart', () => { isUserInteraction.current = true })

      // Debounce map change events
      let moveTimeout: NodeJS.Timeout
      
      map.current.on('moveend', () => {
        clearTimeout(moveTimeout)
        moveTimeout = setTimeout(() => {
          handleMapChange()
          isUserInteraction.current = false
        }, 100)
      })

      map.current.on('zoomend', () => {
        clearTimeout(moveTimeout)
        moveTimeout = setTimeout(() => {
          handleMapChange()
          isUserInteraction.current = false
        }, 100)
      })

    } catch (error) {
      console.error('Error initializing map:', error)
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
      if (coordinatesDivRef.current) {
        coordinatesDivRef.current.remove()
        coordinatesDivRef.current = null
      }
    }
  }, []) // Only run on mount

  // Handle prop changes
  useEffect(() => {
    if (!map.current) return
    
    isUserInteraction.current = false
    const currentCenter = map.current.getCenter()
    const currentZoom = map.current.getZoom()
    
    // Only update if there's a significant change
    if (
      Math.abs(currentCenter.lng - center[0]) >= 0.0001 ||
      Math.abs(currentCenter.lat - center[1]) >= 0.0001 ||
      Math.abs(currentZoom - zoom) >= 0.01
    ) {
      map.current.setCenter(center)
      map.current.setZoom(zoom)
    }
  }, [center, zoom])

  return (
    <div className="relative w-full h-full bg-gray-200">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  )
} 