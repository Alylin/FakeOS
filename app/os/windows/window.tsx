'use client'

import { useEffect, useState, ReactNode, ReactElement } from 'react';
import 'draft-js/dist/Draft.css';
import { DraggableData } from 'react-draggable';
import TopBar from './topbar';
import { Position } from '../../utility/position';
import { Size } from '../../utility/size';
import { closeWindow, minimizeWindow, moveToFront, WindowInstance } from './windowmanager';
import MoveableAndResizeable from '@/app/reusableui/moveandresize/moveableandresizable';

const bounds = 50;

function fullScreen(
  desktopSize: Size, 
  setSize: (size: Size) => void, 
  setPosition: (position: Position) => void
) {
  setSize({
    width: desktopSize.width,
    height: desktopSize.height
  });
  setPosition({
      x: 0,
      y: 0
  });
}

function getFixedPosition(
  desktopSize: Size, 
  windowSize: Size,
  position: Position
) {
  return {
    x: Math.max(Math.min(position.x, desktopSize.width-bounds), bounds-windowSize.width),
    y: Math.max(Math.min(position.y, desktopSize.height-bounds), bounds-windowSize.height)
  };
}

export default function Window({ 
   title, 
   children,
   topBarAddon,
   desktopSize,
   setWindows,
   windows,
   windowID,
   icon,
   isCollapsed,
   defaultSize = { width: 400, height: 400 },
   minWidth = 400,
   minHeight = 400
}: {
   title: string,
   children: ReactNode,
   topBarAddon?: ReactNode,
   desktopSize: Size,
   setWindows: (windows: WindowInstance[]) => void, 
   windows: WindowInstance[],
   windowID: string,
   icon: ReactElement,
   isCollapsed: boolean,
   defaultSize?: Size,
   minWidth?: number,
   minHeight?: number
}) {
  const [size, setSize] = useState(defaultSize);
  const [position, setPosition] = useState<Position>({
    x: 0,
    y: 0
  });
  
  const [pastSize, setPastSize] = useState<Size>();
  const [pastPosition, setPastPosition] = useState<Position>();
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (isFullScreen) {
      fullScreen(desktopSize, setSize, setPosition);
      return;
    }
    const positionUpdated2 = getFixedPosition(desktopSize, size, position);
    setPosition(positionUpdated2);
  }, [desktopSize]);

  if (isCollapsed) {
    return null;
  }

  return (
    <MoveableAndResizeable
      containerBounds={new DOMRect(0, 0, desktopSize.width, desktopSize.height)}
      onPositionChanged={(deltas: Position, data?: DraggableData) => {
        if (pastSize && isFullScreen && data) {
          setIsFullScreen(false);
          setSize(pastSize);
          setPosition({
            x: data.x - (pastSize.width / 2),
            y: data.y - 10
          });
        }
        else {
          setPosition({
            x: position.x + deltas.x,
            y: position.y + deltas.y
          });
        }
      }}
      onSizeChanged={(newSize, newPosition) => {
        setSize(newSize);
        setPosition(newPosition);
      }}
      position={position}
      size={size}
      minHeight={minHeight} 
      minWidth={minWidth} 
      handleID='#movingHandle'
      onMouseDown={() => {
        moveToFront(
          windows, 
          setWindows, 
          windowID
        );
      }}
    >
      <div className="flex flex-col text-[13px] w-full h-full shadow-powerful border-solid border-2 border-t-0 border-windowPrimary bg-white">
        <TopBar 
          title={title} 
          topBarAddon={topBarAddon} 
          isFullScreen={isFullScreen}
          onFullScreen={() => {
            if (!isFullScreen) {
              setPastSize(size);
              setPastPosition(position);
              fullScreen(desktopSize, setSize, setPosition);
            }
            else if (pastSize && pastPosition) {
              setSize(pastSize);
              const positionUpdated = getFixedPosition(desktopSize, size, pastPosition);
              setPosition(positionUpdated);
            }
            setIsFullScreen(!isFullScreen);
          }}
          onClose={() => {
            closeWindow(windows, setWindows, windowID);
          }} 
          onMinimize={() => {
            minimizeWindow(
              windows, 
              setWindows, 
              windowID
            );
          }}
          icon={icon}
        />
        <div className="flex-1 min-h-0 relative max-h-full">
          {children}
        </div>
      </div>
    </MoveableAndResizeable>  
  );
}