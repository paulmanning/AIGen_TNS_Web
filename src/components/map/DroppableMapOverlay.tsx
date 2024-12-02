'use client'

import { FC } from 'react';
import { useDrop } from 'react-dnd';

export interface DroppableMapOverlayProps {
  onDrop: (item: any) => void;
}

export const DroppableMapOverlay: FC<DroppableMapOverlayProps> = ({ onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'DRAGGABLE_ITEM',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      data-testid="map-drop-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isOver ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        pointerEvents: 'all',
      }}
    >
      Drop here to add to map
    </div>
  );
}; 