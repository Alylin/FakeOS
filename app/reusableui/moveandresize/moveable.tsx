'use client'

import { useEffect, ReactNode, ReactElement } from 'react';
import 'draft-js/dist/Draft.css';
import { DraggableCore, DraggableData } from 'react-draggable';
import { Position } from '../../utility/position';
import { Size } from '../../utility/size';

function getContainedDeltas(
  childBounds: DOMRect, 
  parentBounds: DOMRect, 
  movementDelta: Position
) {
  const maxDeltaX = parentBounds.right - childBounds.right;
  const maxDeltaY = parentBounds.bottom - childBounds.bottom;
  const minDeltaX = parentBounds.left - childBounds.left;
  const minDeltaY = parentBounds.top - childBounds.top;

  return {
    x: Math.max(minDeltaX, Math.min(maxDeltaX, movementDelta.x)),
    y: Math.max(minDeltaY, Math.min(maxDeltaY, movementDelta.y))
  }
}

function getRestrictedDeltas(
  movingBounds: DOMRect,
  containerBounds: DOMRect,
  delta: Position
) {
  const effectiveParentBounds = new DOMRect(
    containerBounds.left-(movingBounds.width-50),
    containerBounds.top, 
    containerBounds.width+((movingBounds.width-50)*2),
    containerBounds.height+(movingBounds.height-50)
  );
  return getContainedDeltas(
    movingBounds,
    effectiveParentBounds,
    delta
  );
}

export default function Moveable({ 
   children,
   containerBounds,
   onMove,
   position,
   size,
   handleID,
   requiredAmountContained = 50,
   onMouseDown
}: {
   children: ReactNode,
   containerBounds: DOMRect,
   onMove: (deltas: Position, data: DraggableData) => void,
   position: Position,
   size: Size,
   handleID: string,
   requiredAmountContained?: number,
   onMouseDown?: () => void
}) {

  useEffect(() => {
    containerBounds
  }, [containerBounds]);

   return (
    <DraggableCore
      onDrag={(event, data) => {
        const restrictedDeltas = getRestrictedDeltas(
          new DOMRect(position.x, position.y, size.width, size.height), 
          containerBounds,
          {
            x: data.deltaX,
            y: data.deltaY
          }
        );
        onMove(restrictedDeltas, data);
      }}
      onMouseDown={onMouseDown}
      handle={handleID}
    >
      <div
        className="absolute" 
        style={{
          left: position.x,
          top: position.y
        }}
      >
        {children}
      </div>
    </DraggableCore>
  );
}