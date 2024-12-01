import { VesselType } from '@/types/simulation'

// Flag emojis for nationalities
const FLAGS: { [key: string]: string } = {
  USA: '🇺🇸',
  GBR: '🇬🇧',
  RUS: '🇷🇺',
  CHN: '🇨🇳',
  JPN: '🇯🇵',
  FRA: '🇫🇷',
  DEU: '🇩🇪'
}

// Type-specific icons when no nationality applies
const TYPE_ICONS: { [key in VesselType]: string } = {
  SURFACE_WARSHIP: '⚔️',
  SUBMARINE: '🌊',
  MERCHANT: '🚢',
  FISHING: '🎣',
  BIOLOGIC: '🐋'
}

// Special case icons for specific vessel types
const SPECIAL_ICONS: { [key: string]: string } = {
  'whale-1': '🐋',  // Humpback whale
  'dolphin-1': '🐬', // Dolphin pod
  'fishing-1': '🎣'  // Fishing vessel
}

export function getShipIcon(type: VesselType, nationality?: string, shipId?: string): string {
  // Check for special cases first
  if (shipId && SPECIAL_ICONS[shipId]) {
    return SPECIAL_ICONS[shipId]
  }
  
  // Return nationality flag if available
  if (nationality && FLAGS[nationality]) {
    return FLAGS[nationality]
  }
  
  // Fall back to type-specific icon
  return TYPE_ICONS[type]
} 