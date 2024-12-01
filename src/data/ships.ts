import { VesselType } from '@/types/simulation'

export interface ShipData {
  id: string
  name: string
  hullNumber?: string
  type: VesselType
  nationality: string
  characteristics: {
    maxSpeed: number  // knots
    minSpeed: number  // knots
    maxDepth: number  // meters (0 for surface ships)
    minDepth: number  // meters
    turnRate: number  // degrees per minute
    accelerationRate: number // knots per minute
    depthChangeRate: number // meters per minute
    propulsion: {
      type: 'PROPELLER' | 'JET' | 'OTHER'
      configuration: {
        bladeCount?: number
        bladeType?: string
      }
    }[]
  }
  acousticSignatures: {
    type: 'BROADBAND' | 'NARROWBAND' | 'TRANSIENT'
    centerFrequency: number
    bandwidth: number
    signalStrength: number
    driftRate?: number
    driftMin?: number
    driftMax?: number
    pulseRepetitionFrequency?: number
    pulseDuration?: number
    pulseRepetitionInterval?: number
  }[]
}

export const defaultShips: ShipData[] = [
  {
    id: 'ddg-51',
    name: 'USS Arleigh Burke',
    hullNumber: 'DDG-51',
    type: VesselType.SURFACE_WARSHIP,
    nationality: 'USA',
    characteristics: {
      maxSpeed: 30,
      minSpeed: 0,
      maxDepth: 0,
      minDepth: 0,
      turnRate: 3,
      accelerationRate: 1,
      depthChangeRate: 0,
      propulsion: [
        {
          type: 'PROPELLER',
          configuration: {
            bladeCount: 5,
            bladeType: 'Fixed Pitch'
          }
        }
      ]
    },
    acousticSignatures: [
      {
        type: 'BROADBAND',
        centerFrequency: 150,
        bandwidth: 30,
        signalStrength: 120
      },
      {
        type: 'NARROWBAND',
        centerFrequency: 60,
        bandwidth: 2,
        signalStrength: 140,
        driftRate: 0.1
      }
    ]
  },
  {
    id: 'ssn-688',
    name: 'USS Los Angeles',
    hullNumber: 'SSN-688',
    type: VesselType.SUBMARINE,
    nationality: 'USA',
    characteristics: {
      maxSpeed: 25,
      minSpeed: 0,
      maxDepth: 450,
      minDepth: 0,
      turnRate: 2,
      accelerationRate: 0.5,
      depthChangeRate: 5,
      propulsion: [
        {
          type: 'PROPELLER',
          configuration: {
            bladeCount: 7,
            bladeType: 'Skewed'
          }
        }
      ]
    },
    acousticSignatures: [
      {
        type: 'BROADBAND',
        centerFrequency: 80,
        bandwidth: 20,
        signalStrength: 90
      },
      {
        type: 'NARROWBAND',
        centerFrequency: 50,
        bandwidth: 1,
        signalStrength: 110,
        driftRate: 0.05
      }
    ]
  },
  {
    id: 'type-45',
    name: 'HMS Daring',
    hullNumber: 'D32',
    type: VesselType.SURFACE_WARSHIP,
    nationality: 'GBR',
    characteristics: {
      maxSpeed: 29,
      minSpeed: 0,
      maxDepth: 0,
      minDepth: 0,
      turnRate: 2.8,
      accelerationRate: 0.9,
      depthChangeRate: 0,
      propulsion: [
        {
          type: 'PROPELLER',
          configuration: {
            bladeCount: 5,
            bladeType: 'Controllable Pitch'
          }
        }
      ]
    },
    acousticSignatures: [
      {
        type: 'BROADBAND',
        centerFrequency: 140,
        bandwidth: 25,
        signalStrength: 115
      }
    ]
  },
  {
    id: 'akula',
    name: 'K-335 Gepard',
    hullNumber: 'K-335',
    type: VesselType.SUBMARINE,
    nationality: 'RUS',
    characteristics: {
      maxSpeed: 28,
      minSpeed: 0,
      maxDepth: 600,
      minDepth: 0,
      turnRate: 2,
      accelerationRate: 0.6,
      depthChangeRate: 6,
      propulsion: [
        {
          type: 'PROPELLER',
          configuration: {
            bladeCount: 7,
            bladeType: 'Advanced Skewed'
          }
        }
      ]
    },
    acousticSignatures: [
      {
        type: 'BROADBAND',
        centerFrequency: 90,
        bandwidth: 25,
        signalStrength: 95
      },
      {
        type: 'NARROWBAND',
        centerFrequency: 55,
        bandwidth: 1.5,
        signalStrength: 115,
        driftRate: 0.07
      }
    ]
  },
  {
    id: 'type-055',
    name: 'Nanchang',
    hullNumber: '101',
    type: VesselType.SURFACE_WARSHIP,
    nationality: 'CHN',
    characteristics: {
      maxSpeed: 30,
      minSpeed: 0,
      maxDepth: 0,
      minDepth: 0,
      turnRate: 3,
      accelerationRate: 1,
      depthChangeRate: 0,
      propulsion: [
        {
          type: 'PROPELLER',
          configuration: {
            bladeCount: 6,
            bladeType: 'Fixed Pitch'
          }
        }
      ]
    },
    acousticSignatures: [
      {
        type: 'BROADBAND',
        centerFrequency: 145,
        bandwidth: 28,
        signalStrength: 118
      }
    ]
  },
  {
    id: 'soryu',
    name: 'JS Sōryū',
    hullNumber: 'SS-501',
    type: VesselType.SUBMARINE,
    nationality: 'JPN',
    characteristics: {
      maxSpeed: 20,
      minSpeed: 0,
      maxDepth: 400,
      minDepth: 0,
      turnRate: 2.2,
      accelerationRate: 0.4,
      depthChangeRate: 4,
      propulsion: [
        {
          type: 'PROPELLER',
          configuration: {
            bladeCount: 7,
            bladeType: 'High-Skew'
          }
        }
      ]
    },
    acousticSignatures: [
      {
        type: 'BROADBAND',
        centerFrequency: 75,
        bandwidth: 18,
        signalStrength: 85
      }
    ]
  },
  {
    id: 'suffren',
    name: 'FS Suffren',
    hullNumber: 'S635',
    type: VesselType.SUBMARINE,
    nationality: 'FRA',
    characteristics: {
      maxSpeed: 25,
      minSpeed: 0,
      maxDepth: 350,
      minDepth: 0,
      turnRate: 2.1,
      accelerationRate: 0.5,
      depthChangeRate: 4.5,
      propulsion: [
        {
          type: 'PROPELLER',
          configuration: {
            bladeCount: 7,
            bladeType: 'Pump-Jet'
          }
        }
      ]
    },
    acousticSignatures: [
      {
        type: 'BROADBAND',
        centerFrequency: 70,
        bandwidth: 15,
        signalStrength: 80
      }
    ]
  },
  {
    id: 'type-212',
    name: 'U-31',
    hullNumber: 'S181',
    type: VesselType.SUBMARINE,
    nationality: 'DEU',
    characteristics: {
      maxSpeed: 20,
      minSpeed: 0,
      maxDepth: 300,
      minDepth: 0,
      turnRate: 2,
      accelerationRate: 0.4,
      depthChangeRate: 4,
      propulsion: [
        {
          type: 'PROPELLER',
          configuration: {
            bladeCount: 7,
            bladeType: 'Skewed'
          }
        }
      ]
    },
    acousticSignatures: [
      {
        type: 'BROADBAND',
        centerFrequency: 65,
        bandwidth: 12,
        signalStrength: 75
      }
    ]
  },
  {
    id: 'whale-1',
    name: 'Humpback Pod',
    hullNumber: 'BIO-01',
    type: VesselType.BIOLOGIC,
    nationality: 'USA',
    characteristics: {
      maxSpeed: 15,
      minSpeed: 0,
      maxDepth: 200,
      minDepth: 0,
      turnRate: 4,
      accelerationRate: 2,
      depthChangeRate: 3,
      propulsion: [
        {
          type: 'OTHER',
          configuration: {}
        }
      ]
    },
    acousticSignatures: [
      {
        type: 'BROADBAND',
        centerFrequency: 200,
        bandwidth: 100,
        signalStrength: 160
      }
    ]
  },
  {
    id: 'merchant-1',
    name: 'Ever Given',
    hullNumber: 'IMO-9811000',
    type: VesselType.MERCHANT,
    nationality: 'JPN',
    characteristics: {
      maxSpeed: 22,
      minSpeed: 0,
      maxDepth: 0,
      minDepth: 0,
      turnRate: 1,
      accelerationRate: 0.2,
      depthChangeRate: 0,
      propulsion: [
        {
          type: 'PROPELLER',
          configuration: {
            bladeCount: 6,
            bladeType: 'Fixed Pitch'
          }
        }
      ]
    },
    acousticSignatures: [
      {
        type: 'BROADBAND',
        centerFrequency: 100,
        bandwidth: 40,
        signalStrength: 140
      }
    ]
  }
] 