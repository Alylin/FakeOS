import { KeyboardEvent, useEffect, useState } from "react";
import { Direction, directions } from "../../utility/direction";
import { addGlobalListener } from "../../utility/globallistener";
import { Position } from "../../utility/position";
import { Size } from "../../utility/size";

function restrictGrowthToContainer(
  growingBounds: DOMRect, 
  containerBounds: DOMRect, 
  direction: Direction
) {
  if (
    growingBounds.left > containerBounds.right || 
    growingBounds.top > containerBounds.bottom ||
    containerBounds.left > growingBounds.right || 
    containerBounds.top > growingBounds.bottom
  ) {
    console.log('The element\'s bounds are completely outside of their parent. Returning to 0, 0.');
    return new DOMRect(
      0,
      0,
      growingBounds.width,
      growingBounds.height
    );
  }

  let left = growingBounds.left;
  let top = growingBounds.top;
  let right = growingBounds.right;
  let bottom = growingBounds.bottom;  

  if (direction === 'n' || direction === 'ne' || direction === 'nw') {
    top = Math.max(growingBounds.top, containerBounds.top);
  }
  else if (direction === 's' || direction === 'se' || direction === 'sw') {
    bottom = Math.min(growingBounds.bottom, containerBounds.bottom);
  }
  if (direction === 'e' || direction === 'ne' || direction === 'se') {
    right = Math.min(growingBounds.right, containerBounds.right);
  }
  else if (direction === 'w' || direction === 'nw' || direction === 'sw') {
    left = Math.max(growingBounds.left, containerBounds.left);
  }

  return new DOMRect(
    left,
    top,
    right - left,
    bottom - top
  );
}

function calculateSizeChange(
  startingPosition: Position, 
  currentPosition: Position, 
  direction: Direction,
  currentSize: Size,
  fixedRatio: boolean
) {
  let widthChange = 0;
  let heightChange = 0;
  if (direction === 'n' || direction === 'ne' || direction === 'nw') {
    heightChange = startingPosition.y - currentPosition.y;
  }
  else if (direction === 's' || direction === 'se' || direction === 'sw') {
    heightChange = currentPosition.y - startingPosition.y;
  }
  if (direction === 'e' || direction === 'ne' || direction === 'se') {
    widthChange = currentPosition.x - startingPosition.x;
  }
  else if (direction === 'w' || direction === 'nw' || direction === 'sw') {
    widthChange = startingPosition.x - currentPosition.x;
  }

  if (fixedRatio) {
    const verticalToHorizontalRatio = currentSize.width / currentSize.height;
    const horizontalToVerticalRatio = currentSize.height / currentSize.width;
    if ((widthChange * horizontalToVerticalRatio) > heightChange) {
      heightChange = widthChange * horizontalToVerticalRatio;
    }
    else {
      widthChange = heightChange * verticalToHorizontalRatio;
    }
  }

  return {
    width: widthChange,
    height: heightChange
  };
}

function getHandleStyles(direction: Direction) {
  switch (direction) {
    case 'n':
      return 'w-full h-2 absolute -top-1 cursor-n-resize z-20';
    case 's':
      return 'w-full h-2 absolute -bottom-1 cursor-s-resize z-20';
    case 'e':
      return 'w-2 h-full absolute -right-1 cursor-e-resize z-20';
    case 'w':
      return 'w-2 h-full absolute -left-1 cursor-w-resize z-20';
    case 'ne':
      return 'w-3 h-3 absolute -right-1 -top-1 cursor-ne-resize z-20';
    case 'nw':
      return 'w-3 h-3 absolute -left-1 -top-1 cursor-nw-resize z-20';
    case 'se':
      return 'w-3 h-3 absolute -right-1 -bottom-1 cursor-se-resize z-20';
    case 'sw':
      return 'w-3 h-3 absolute -left-1 -bottom-1 cursor-sw-resize z-20';
    default:
      break;
  }
}

function ResizeHandle({
  onResize, 
  currentSize,
  direction
}: {
  onResize: (newSize: Size) => void, 
  currentSize: Size,
  direction: Direction
}) {
  const [size, setSize] = useState(currentSize);
  const [startingPosition, setStartingPosition] = useState<Position | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  useEffect(() => {
    const mouseMovedTeardown = addGlobalListener(
      'mousemove',
      (mouseEvent: MouseEvent) => {
        if (!startingPosition) {
          return;
        }
        mouseEvent.preventDefault();

        const changeAmount = calculateSizeChange(
          startingPosition, 
          {
            x: mouseEvent.pageX,
            y: mouseEvent.pageY
          }, 
          direction,
          currentSize,
          mouseEvent.shiftKey
        )
        onResize({
          width: size.width + changeAmount.width,
          height: size.height + changeAmount.height
        });
      },
      !isResizing
    );
    const mouseUpTeardown = addGlobalListener(
      'mouseup',
      () => {
        setIsResizing(false);
      },
      !isResizing
    );
    const keyUpTeardown = addGlobalListener(
      'keyup',
      (event: KeyboardEvent) => {
        switch (event.code) {
          case 'Escape':
            setIsResizing(false);
            onResize(size);
            break;
          default:
            break;
        }
      },
      !isResizing
    );
    return () => {
      mouseMovedTeardown();
      mouseUpTeardown();
      keyUpTeardown();
    };
  }, [isResizing, size]);
  return (
    <div 
      className={getHandleStyles(direction)}
      onMouseDown={(event: React.MouseEvent) => {
        event.preventDefault();
        setStartingPosition({x: event.pageX, y: event.pageY})
        setSize(currentSize);
        setIsResizing(true);
      }}
    />
  );
}

export default function Resizable({
  minWidth = 200, 
  minHeight = 100, 
  children,
  size,
  onChange,
  position,
  containerBounds
}: {
  minWidth?: number, 
  minHeight?: number, 
  children: React.ReactNode,
  size: Size,
  onChange: (newRect: DOMRect) => void,
  position: Position,
  containerBounds: DOMRect
}) {
  return (
    <div
      className="absolute" 
      style={{
        height: size.height,
        width: size.width
      }}
    >
      {
        directions.map((direction) => {
          return (
            <ResizeHandle 
              currentSize={size}
              direction={direction}
              onResize={(requestedSize: Size) => {
                const newSize = {
                  width: Math.max(minWidth, requestedSize.width),
                  height: Math.max(minHeight, requestedSize.height) 
                }
                let newPosition = {...position};
                if (direction === 'n' || direction === 'ne' || direction === 'nw') {
                  newPosition.y -= (newSize.height - size.height);
                }
                if (direction === 'w' || direction === 'nw' || direction === 'sw') {
                  newPosition.x -= (newSize.width - size.width);
                }
                onChange(
                  restrictGrowthToContainer(
                    new DOMRect(
                      newPosition.x,
                      newPosition.y,
                      newSize.width,
                      newSize.height
                    ), 
                    containerBounds,
                    direction
                  )
                );
              }} 
            />
          );
        })
      }
    {children}
   </div>
 );
}