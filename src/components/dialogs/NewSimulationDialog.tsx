'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MapComponent } from '@/components/map/MapComponent'
import { useRouter } from 'next/navigation'
import type { SimulationData } from '@/types/simulation'
import { v4 as uuidv4 } from 'uuid';

interface NewSimulationDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (simulationData: SimulationData) => void
}

export function NewSimulationDialog({ isOpen, onClose, onCreate }: NewSimulationDialogProps) {
  const router = useRouter()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<SimulationData>({
    id: uuidv4(),
    name: '',
    description: '',
    location: {
      center: [-155.5, 19.5], // Hawaii coordinates
      zoom: 5
    },
    startTime: new Date().toISOString().slice(0, 16),
    duration: 120,
    vessels: []
  })

  // Auto-focus the name input when dialog opens
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create final simulation data with trimmed strings
    const finalData = {
      ...formData,
      id: formData.id,
      name: formData.name.trim(),
      description: formData.description.trim(),
      location: {
        center: [
          Number(formData.location.center[0].toFixed(4)),
          Number(formData.location.center[1].toFixed(4))
        ] as [number, number],
        zoom: Number(formData.location.zoom.toFixed(2))
      },
      startTime: formData.startTime,
      duration: formData.duration,
      vessels: []
    }
    
    // Save to localStorage before creating
    localStorage.setItem('currentSimulation', JSON.stringify(finalData))
    
    // Call onCreate and navigate
    onCreate(finalData)
    onClose()
  }

  const handleMapChange = (center: [number, number], zoom: number) => {
    console.log('Map location updated:', { center, zoom })
    setFormData(prev => {
      const updated = {
        ...prev,
        location: {
          center: [
            Number(center[0].toFixed(4)),
            Number(center[1].toFixed(4))
          ] as [number, number],
          zoom: Number(zoom.toFixed(2))
        }
      }
      console.log('Updated form data:', updated)
      return updated
    })
  }

  // Add debug output for initial render
  console.log('Current form data:', formData)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[800px] h-[600px]" style={{ maxHeight: '90vh' }}>
        <form onSubmit={handleSubmit} className="h-full flex flex-col p-6">
          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex-none">
            Create New Simulation
          </h2>

          {/* Content area with fixed heights */}
          <div className="flex-1 flex flex-col gap-4" style={{ fontSize: '14px', lineHeight: '1.2' }}>
            {/* Name and Description - Fixed height */}
            <div className="flex-none h-[120px] space-y-3">
              <div>
                <label 
                  htmlFor="simulation-name" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Simulation Name
                </label>
                <input
                  id="simulation-name"
                  ref={nameInputRef}
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full h-[32px] rounded-md border-gray-300 dark:border-gray-600 
                           dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 
                           focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label 
                  htmlFor="simulation-description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="simulation-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="block w-full h-[48px] resize-none rounded-md border-gray-300 dark:border-gray-600 
                           dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 
                           focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>

            {/* Map Selection - Flex grow */}
            <div className="flex-1 min-h-0">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Area
              </label>
              <div className="h-[200px] border rounded-lg overflow-hidden">
                <MapComponent
                  center={formData.location.center}
                  zoom={formData.location.zoom}
                  onChange={handleMapChange}
                />
              </div>
            </div>

            {/* Time Settings - Fixed height */}
            <div className="flex-none h-[80px]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label 
                    htmlFor="start-time" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Start Time
                  </label>
                  <input
                    id="start-time"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="block w-full h-[32px] rounded-md border-gray-300 dark:border-gray-600 
                             dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 
                             focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label 
                    htmlFor="duration" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Duration (minutes)
                  </label>
                  <input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    min="1"
                    className="block w-full h-[32px] rounded-md border-gray-300 dark:border-gray-600 
                             dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 
                             focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons - Fixed height */}
          <div className="flex-none h-[48px] flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border 
                       border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                       rounded-md hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 