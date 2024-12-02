import { render, screen } from '@testing-library/react';
import { DroppableMapOverlay } from '../DroppableMapOverlay';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { DropTargetMonitor } from 'react-dnd';

// Mock react-dnd hooks
vi.mock('react-dnd', async () => {
  const actual = await vi.importActual('react-dnd');
  return {
    ...actual,
    useDrop: vi.fn((options) => {
      const opts = typeof options === 'function' ? options() : options;
      return [{
        isOver: false,
        canDrop: true,
      }, vi.fn()];
    })
  };
});

describe('DroppableMapOverlay', () => {
  const mockOnDrop = vi.fn();
  const mockMonitor = {
    isOver: () => false,
    canDrop: () => true,
    getItemType: () => 'DRAGGABLE_ITEM'
  } as DropTargetMonitor;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <DroppableMapOverlay onDrop={mockOnDrop} />
      </DndProvider>
    );
    expect(screen.getByTestId('map-drop-overlay')).toBeInTheDocument();
  });

  it('displays the drop zone message', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <DroppableMapOverlay onDrop={mockOnDrop} />
      </DndProvider>
    );
    expect(screen.getByText(/Drop here to add to map/i)).toBeInTheDocument();
  });

  it('changes style when dragging over', () => {
    // Mock useDrop to simulate hover state
    vi.mocked(useDrop).mockImplementationOnce((options) => {
      const opts = typeof options === 'function' ? options() : options;
      return [{
        isOver: true,
        canDrop: true,
      }, vi.fn()];
    });

    render(
      <DndProvider backend={HTML5Backend}>
        <DroppableMapOverlay onDrop={mockOnDrop} />
      </DndProvider>
    );

    const dropZone = screen.getByTestId('map-drop-overlay');
    expect(dropZone).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.5)' });
  });

  it('calls onDrop when item is dropped', () => {
    const mockItem = { type: 'DRAGGABLE_ITEM', id: '123' };
    let dropCallback: ((item: any) => void) | undefined;
    
    // Mock useDrop to capture drop callback
    vi.mocked(useDrop).mockImplementationOnce((options) => {
      const opts = typeof options === 'function' ? options() : options;
      dropCallback = opts.drop;
      return [{
        isOver: false,
        canDrop: true,
      }, vi.fn()];
    });

    render(
      <DndProvider backend={HTML5Backend}>
        <DroppableMapOverlay onDrop={mockOnDrop} />
      </DndProvider>
    );

    // Simulate drop
    if (dropCallback) {
      dropCallback(mockItem);
      expect(mockOnDrop).toHaveBeenCalledWith(mockItem);
    }
  });

  it('handles invalid drop data gracefully', () => {
    let dropCallback: ((item: any) => void) | undefined;
    
    // Mock useDrop to capture drop callback
    vi.mocked(useDrop).mockImplementationOnce((options) => {
      const opts = typeof options === 'function' ? options() : options;
      dropCallback = opts.drop;
      return [{
        isOver: false,
        canDrop: true,
      }, vi.fn()];
    });

    render(
      <DndProvider backend={HTML5Backend}>
        <DroppableMapOverlay onDrop={mockOnDrop} />
      </DndProvider>
    );

    // Simulate drop with invalid data
    if (dropCallback) {
      dropCallback(undefined);
      expect(mockOnDrop).toHaveBeenCalledWith(undefined);
    }
  });

  it('updates isOver state correctly', () => {
    // Test initial state (not over)
    vi.mocked(useDrop).mockImplementationOnce((options) => {
      const opts = typeof options === 'function' ? options() : options;
      return [{
        isOver: false,
        canDrop: true,
      }, vi.fn()];
    });

    const { rerender } = render(
      <DndProvider backend={HTML5Backend}>
        <DroppableMapOverlay onDrop={mockOnDrop} />
      </DndProvider>
    );

    let dropZone = screen.getByTestId('map-drop-overlay');
    expect(dropZone).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.2)' });

    // Test hover state
    vi.mocked(useDrop).mockImplementationOnce((options) => {
      const opts = typeof options === 'function' ? options() : options;
      return [{
        isOver: true,
        canDrop: true,
      }, vi.fn()];
    });

    rerender(
      <DndProvider backend={HTML5Backend}>
        <DroppableMapOverlay onDrop={mockOnDrop} />
      </DndProvider>
    );

    dropZone = screen.getByTestId('map-drop-overlay');
    expect(dropZone).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.5)' });
  });
}); 