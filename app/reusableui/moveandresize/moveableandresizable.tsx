'use client'

import { ReactNode, useEffect } from 'react';
import 'draft-js/dist/Draft.css';
import { DraggableData } from 'react-draggable';
import { Position } from '../../utility/position';
import { Size } from '../../utility/size';
import Resizable from '@/app/reusableui/moveandresize/resizable';
import Moveable from '@/app/reusableui/moveandresize/moveable';

export default function MoveableAndResizeable({ 
   children,
   containerBounds,
   size,
   position,
   onSizeChanged,
   onPositionChanged,
   onMouseDown,
   handleID,
   minWidth = 400,
   minHeight = 400,
}: {
   children: ReactNode,
   containerBounds: DOMRect,
   size: Size,
   position: Position,
   onSizeChanged: (newSize: Size, newPosition: Position) => void,
   onPositionChanged: (newPosition: Position, data?: DraggableData) => void,
   onMouseDown: () => void,
   handleID: string,
   minWidth?: number,
   minHeight?: number
}) {
  // useEffect(() => {
  //   onPositionChanged(getFixedPosition(containerBounds, size, position));
  // }, [containerBounds]);

  return (
    <Moveable
      containerBounds={containerBounds}
      onMove={(deltas: Position, data: DraggableData) => {
        onPositionChanged(deltas, data);
      }}
      position={position}
      size={size}
      handleID={handleID}
      onMouseDown={onMouseDown}
    >
      <Resizable 
        minHeight={minHeight} 
        minWidth={minWidth} 
        size={size}
        onChange={(requestedBounds: DOMRect) => {
          onSizeChanged({
            width: requestedBounds.width,
            height: requestedBounds.height
          }, 
          {
            x: requestedBounds.left,
            y: requestedBounds.top
          });
        }}
        position={position}
        containerBounds={containerBounds}
      >
        {children}
      </Resizable>
    </Moveable>  
  );
}