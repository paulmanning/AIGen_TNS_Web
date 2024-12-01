import { useDragLayer } from 'react-dnd'
import type { XYCoord } from 'react-dnd'

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
}

function getItemStyles(currentOffset: XYCoord | null): React.CSSProperties {
  if (!currentOffset) {
    return {
      display: 'none'
    }
  }

  const { x, y } = currentOffset
  const transform = `translate(${x - 16}px, ${y - 16}px)`
  return {
    transform,
    WebkitTransform: transform
  }
}

export function CustomDragLayer() {
  const { itemType, isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  if (!isDragging) {
    return null
  }

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(currentOffset)}>
        {item?.preview}
      </div>
    </div>
  )
} 