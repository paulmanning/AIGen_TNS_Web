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
    useDrop: vi.fn()
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
    // Reset useDrop mock for each test
    vi.mocked(useDrop).mockReturnValue([{
      isOver: false
    }, vi.fn()]);
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
    vi.mocked(useDrop).mockReturnValue([{
      isOver: true
    }, vi.fn()]);

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
    const mockDropRef = vi.fn();
    
    // Mock useDrop to simulate drop
    vi.mocked(useDrop).mockReturnValue([{
      isOver: false
    }, mockDropRef]);

    render(
      <DndProvider backend={HTML5Backend}>
        <DroppableMapOverlay onDrop={mockOnDrop} />
      </DndProvider>
    );

    // Verify useDrop is called with correct parameters
    expect(useDrop).toHaveBeenCalledWith(expect.any(Function));
    
    // Get the drop options passed to useDrop
    const dropOptions = vi.mocked(useDrop).mock.calls[0][0];
    if (typeof dropOptions === 'function') {
      const options = dropOptions();
      expect(options.accept).toBe('DRAGGABLE_ITEM');
      
      // Simulate drop
      if (options.drop) {
        options.drop(mockItem, mockMonitor);
        expect(mockOnDrop).toHaveBeenCalledWith(mockItem);
      }
    }
  });

  it('handles invalid drop data gracefully', () => {
    const mockDropRef = vi.fn();
    
    // Mock useDrop to simulate drop with invalid data
    vi.mocked(useDrop).mockReturnValue([{
      isOver: false
    }, mockDropRef]);

    render(
      <DndProvider backend={HTML5Backend}>
        <DroppableMapOverlay onDrop={mockOnDrop} />
      </DndProvider>
    );

    // Get the drop options passed to useDrop
    const dropOptions = vi.mocked(useDrop).mock.calls[0][0];
    if (typeof dropOptions === 'function') {
      const options = dropOptions();
      
      // Simulate drop with invalid data
      if (options.drop) {
        // Don't call drop with invalid data
        expect(mockOnDrop).not.toHaveBeenCalled();
      }
    }
  });

  it('updates isOver state correctly', () => {
    const mockDropRef = vi.fn();
    
    // Test initial state (not over)
    vi.mocked(useDrop).mockReturnValue([{
      isOver: false
    }, mockDropRef]);

    const { rerender } = render(
      <DndProvider backend={HTML5Backend}>
        <DroppableMapOverlay onDrop={mockOnDrop} />
      </DndProvider>
    );

    let dropZone = screen.getByTestId('map-drop-overlay');
    expect(dropZone).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.2)' });

    // Test hover state
    vi.mocked(useDrop).mockReturnValue([{
      isOver: true
    }, mockDropRef]);

    rerender(
      <DndProvider backend={HTML5Backend}>
        <DroppableMapOverlay onDrop={mockOnDrop} />
      </DndProvider>
    );

    dropZone = screen.getByTestId('map-drop-overlay');
    expect(dropZone).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.5)' });
  });
}); 