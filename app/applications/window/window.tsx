'use client'

import { useEffect, useState, ReactNode, SyntheticEvent, ReactElement } from 'react';
import 'draft-js/dist/Draft.css';
import { Resizable, ResizeCallbackData } from 'react-resizable'
import { DraggableCore } from 'react-draggable';
import TopBar from './topbar';
import { Position } from '../generic/position';
import { Size } from '../generic/size';
import { minimizeWindow, moveToFront, WindowInstance } from './windowmanager';

export default function Window({ 
   title, 
   children,
   topBarAddon,
   desktopSize,
   onClose,
   setWindows,
   windows,
   windowID,
   icon,
   isCollapsed
}: {
   title: string,
   children: ReactNode,
   topBarAddon?: ReactNode,
   desktopSize: Size,
   onClose: () => void, 
   setWindows: (windows: WindowInstance[]) => void, 
   windows: WindowInstance[],
   windowID: string,
   icon: ReactElement,
   isCollapsed: boolean
}) {
  const [size, setSize] = useState({
    width: 500,
    height: 500
  });
  const [position, setPosition] = useState<Position>({
    x: 0,
    y: 0
  });

  useEffect(() => {
      setPosition({
          x: Math.max(Math.min(position.x, desktopSize.width-50), 0),
          y: Math.max(Math.min(position.y, desktopSize.height-50), 0)
      });
  }, [desktopSize]);


  const onResize = (event: SyntheticEvent, data: ResizeCallbackData) => {
    const newSize = data.size;
    const currentSize = size;
    const xChange = currentSize.width - newSize.width;
    const yChange = currentSize.height - newSize.height;

    let maxWidth = 0;
    let maxHeight = 0;


    switch (data.handle) {
      case 'se':
      case 's':
      case 'e':
        maxWidth = desktopSize.width - position.x;
        maxHeight = desktopSize.height - position.y;
        break;
      case 'w':
      case 'sw':
        maxWidth = size.width + position.x;
        maxHeight = desktopSize.height - position.y;
        setPosition({
          x: Math.max(position.x + xChange, 0),
          y: position.y
        });
        break
      case 'n': 
      case 'ne':
        maxWidth = desktopSize.width - position.x;
        maxHeight = size.height + position.y;
        setPosition({
          x: position.x,
          y: Math.max(position.y + yChange, 0)
        });
        break
      case 'nw':
        maxWidth = size.width + position.x;
        maxHeight = size.height + position.y;
        setPosition({
          x: Math.max(position.x + xChange, 0),
          y: Math.max(position.y + yChange, 0)
        });
        break
      default:
        break;
    }

    setSize({
      width: Math.min(newSize.width, maxWidth),
      height: Math.min(newSize.height, maxHeight)
    });
  };

  if (isCollapsed) {
    return null;
  }

   return (
      <>
        <DraggableCore
          onDrag={(event, data) => {
            setPosition({
              x: position.x + data.deltaX,
              y: Math.min(Math.max(position.y + data.deltaY, 0), desktopSize.height-50)
            });
          }}
          onMouseDown={(e) => {
            moveToFront(
              windows, 
              setWindows, 
              windowID
            );
          }}
          handle="#movingHandle"
        >
          <Resizable 
            width={size.width} 
            height={size.height}
            minConstraints={[
              400,
              400
            ]}
            onResize={onResize}
            resizeHandles={['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w']}
            handle={(
              (resizeHandle, ref) => {
                switch (resizeHandle) {
                  case 'se':
                    return <div className="w-3 h-3 absolute -right-1 -bottom-1 cursor-se-resize" ref={ref}/>
                  case 'sw':
                    return <div className="w-3 h-3 absolute -left-1 -bottom-1 cursor-sw-resize" ref={ref}/>
                  case 'ne':
                    return <div className="w-3 h-3 absolute -right-1 -top-1 cursor-ne-resize" ref={ref}/>
                  case 'nw':
                    return <div className="w-3 h-3 absolute -left-1 -top-1 cursor-nw-resize" ref={ref}/>
                  case 'n':
                    return (
                        <div className="w-full h-2 absolute px-2 left-0 -top-1">
                            <div className="cursor-n-resize w-full h-full" ref={ref}/>
                        </div>
                    );
                  case 's':
                    return (
                        <div className="w-full h-2 absolute px-2 left-0 -bottom-1">
                            <div className="cursor-s-resize w-full h-full" ref={ref}/>
                        </div>
                    );
                  case 'e':
                    return (
                        <div className="w-2 h-full absolute py-2 -right-1 top-0">
                            <div className="cursor-e-resize w-full h-full" ref={ref}/>
                        </div>
                    );
                case 'w':
                    return (
                        <div className="w-2 h-full absolute py-2 -left-1 top-0">
                            <div className="cursor-w-resize w-full h-full" ref={ref}/>
                        </div>
                    );
                default:
                    break;
                }
              }
            )}
          > 
            <div
              className="flex flex-col pb-6 text-[13px] absolute shadow-powerful border-solid border-2 border-t-0 border-windowPrimary bg-white" 
              style={{
                width: size.width + 'px', 
                height: size.height + 'px',
                left: position.x,
                top: position.y
              }}
            >
              <TopBar 
                title={title} 
                setSize={setSize} 
                setPosition={setPosition} 
                topBarAddon={topBarAddon} 
                desktopSize={desktopSize} 
                onClose={onClose} 
                onMinimize={() => {
                  minimizeWindow(
                    windows, 
                    setWindows, 
                    windowID
                  );
                }}
                icon={icon}
              />
              {children}
            </div>
          </Resizable>
         </DraggableCore>
      </>
   );
}