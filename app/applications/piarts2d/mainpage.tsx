import React, { useEffect, useState } from "react";
import { Size } from "../../utility/size";
import Window from "../../os/windows/window";
import { NewWindow, WindowInstance } from "../../os/windows/windowmanager";
import MenuBar from "@/app/os/windows/menubar";
import roundBrush from "./tools/brushes/roundbrush";
import { Tool } from "./tools/tool";
import { cloneImage, mergeImages } from "./utility";
import { arcticFortress, blackAndWhite, one, winterberry } from "./palettes";
import { ColorPalette, ToolBar } from "./toolbar";
import DrawingCanvas from "./canvas/drawingcanvas";

function tempSave(imageData: ImageData) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('I have no clue how this happened...');
    }
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);


    const image = new Image();
    image.src = canvas.toDataURL();


    const element = document.createElement('a');

    element.setAttribute('href', canvas.toDataURL());
    element.setAttribute('download', 'udjaegs');
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function useUndo<Type = undefined>(maxUndoCount: number = 1000): [(value: Type) => void, (value: Type | null) => Type | undefined, (value: Type | null) => Type | undefined] {
  const [undoStack, setUndoStack] = useState<Type[]>([]);
  const [redoStack, setRedoStack] = useState<Type[]>([]);
  const pushState = (value: Type) => {
    const newUndoStack = [...undoStack, value];
    while (newUndoStack.length > maxUndoCount) {
      newUndoStack.shift();
    }
    setRedoStack([]);
    setUndoStack(newUndoStack);
  }

  const undo = (value: Type | null) => {
    if (undoStack.length === 0) {
      return;
    }
    const poppedValue = undoStack.pop();
    setUndoStack(undoStack);
    if (value) {
      const newRedoStack = [...redoStack, value];
      setRedoStack(newRedoStack);
    }
    return poppedValue;
  }

  const redo = (value: Type | null) => {
    if (redoStack.length === 0) {
      return;
    }
    const poppedValue = redoStack.pop();
    setRedoStack(redoStack);
    if (value) {
      const newUndoStack = [...undoStack, value];
      setUndoStack(newUndoStack);
    }
    return poppedValue;
  }

  return [
    pushState,
    undo,
    redo
  ]
}

const size = {width: 900, height: 600};

function getBlankCanvas(canvasSize: Size) {
  const dataArray = new Uint8ClampedArray(canvasSize.width*canvasSize.height*4);
  dataArray.forEach((ignore, index) => {
    // set the A in RGBA to be maxed out.
    dataArray[index] = 255;
  });
  return new ImageData(dataArray, canvasSize.width, canvasSize.height);
} 

export default function PiArt2D(
  { 
    desktopSize, 
    setWindows, 
    windows, 
    windowID, 
    isCollapsed
  }: { 
    desktopSize: Size, 
    setWindows: (windows: WindowInstance[]) => void, 
    windows: WindowInstance[],
    windowID: string,
    isCollapsed: boolean
}) {
  const [zoom, setZoom] = useState(1);
  const [brushRadius, setBrushRadius] = useState(1);
  const [color, setColor] = useState('000000');
  const [tool, setTool] = useState<Tool>(roundBrush);
  const [pushState, undo, redo] = useUndo<ImageData>();
  const [imageData, setImageData] = useState<ImageData>(() => {
    return getBlankCanvas(size);
  });
  const [workingLayer, setWorkingLayer] = useState<ImageData>(() => {
    return new ImageData(size.width, size.height)
  });
  const [overlayLayer, setOverlayLayer] = useState<ImageData>(() => {
    return new ImageData(size.width, size.height)
  });
  const [backgroundLayer, setBackgroundLayer] = useState<ImageData>(() => {
    return new ImageData(size.width, size.height)
  });
  const [palette, setPalette] = useState(one);

  return (
    <Window
      title="PiArt 2D"
      desktopSize={desktopSize}
      setWindows={setWindows}
      windows={windows}
      windowID={windowID}
      icon={
        <div 
          className={`h-5 w-5 bg-contain`} 
          style={{
            'backgroundImage': `url("/icons/uglypoorlycutout.png")`
          }}
        />
      }
      isCollapsed={isCollapsed}
      minWidth={400}
      minHeight={400}
      topBarAddon={
        <MenuBar menus={[
          {
            title: 'File',
            menuItems: [
              {
                title: 'New',
                shortcut: 'Ctrl+N',
                onClick: () => {
                  setImageData(getBlankCanvas(size));
                }
              },
              {
                title: 'Open',
                shortcut: 'Ctrl+O'
              },
              {
                title: 'Save',
                shortcut: 'Ctrl+S',
                onClick: () => {
                  if (imageData) {
                    tempSave(imageData);
                  }
                }
              },
              {
                title: 'Save As',
                shortcut: 'Ctrl+Shift+S'
              }
            ]
          },
          {
            title: 'Edit',
            menuItems: [
              {
                title: 'Undo',
                shortcut: 'Ctrl+Z',
                onClick: () => {
                  if (!imageData) {
                    return;
                  }
                  const newState = undo(imageData);
                  if (newState) {
                    setImageData(cloneImage(newState));
                  }
                }
              },
              {
                title: 'Redo',
                shortcut: 'Ctrl+Shift+Z',
                onClick: () => {
                  if (!imageData) {
                    return;
                  }
                  const newState = redo(imageData);
                  if (newState) {
                    setImageData(cloneImage(newState));
                  }
                }
              }
            ]
          },
          {
            title: 'Palettes',
            menuItems: [
              {
                title: 'One',
                shortcut: '',
                onClick: () => {
                  setPalette(one);
                }
              },
              {
                title: 'Winterberry',
                shortcut: '',
                onClick: () => {
                  setPalette(winterberry);
                }
              },
              {
                title: 'Black & White',
                shortcut: '',
                onClick: () => {
                  setPalette(blackAndWhite);
                }
              },
              {
                title: 'Arctic Fortress',
                shortcut: '',
                onClick: () => {
                  setPalette(arcticFortress);
                }
              }
            ]
          },
          {
            title: 'Help',
            menuItems: [
               
            ]
          }
        ]}
      />
      }
    >
      <div className="w-full h-full bg-neutral-300">
        <div className="h-full w-full flex flex-col relative overflow-hidden">
          <div className="flex w-full flex-1 min-h-0">
            <ToolBar
              brushRadius={brushRadius}
              onBrushRadiusChange={setBrushRadius}
              currentTool={tool}
              onToolChange={setTool}
            />
            <div className="flex-1 overflow-auto">
              <DrawingCanvas 
                zoomLevel={zoom} 
                radius={brushRadius} 
                color={color} 
                tool={tool} 
                onChange={(workingLayer) => {
                  const newImageData = mergeImages([imageData, workingLayer]);
                  setWorkingLayer(new ImageData(size.width, size.height));
                  pushState(cloneImage(imageData)); 
                  setImageData(cloneImage(newImageData));
                }}
                onTemporaryChange={(newImageData) => {
                  setWorkingLayer(newImageData);
                }}
                onOverlayChange={(newImageData) => {
                  setOverlayLayer(newImageData)
                }}
                imageData={imageData}
                workingLayer={workingLayer}
                overlayLayer={overlayLayer}
                size={size}
              />
              <div className="absolute bottom-2 right-2">
                <button 
                  className="w-5 h-5 mr-2 bg-neutral-200"
                  onClick={() => {
                    setZoom(zoom*1.2);
                  }}
                >
                  +
                </button>
                <button 
                  className="w-5 h-5 bg-neutral-200"
                  onClick={() => {
                    setZoom(zoom/1.2);
                  }}
                >
                  -
                </button>
              </div>
            </div>
          </div>
          <ColorPalette color={color} onColorChanged={setColor} palette={palette} />
        </div>
      </div>
    </Window>
  );
}

export function getPiArt2DData(): NewWindow {
  return {
    applicationID: 'piart2d', 
    windowDisplayName: 'PiArt 2D',
    icon: "bg-[url('/icons/uglypoorlycutout.png')]",
    render: (
      currentDesktopSize: Size, 
      setWindows: (windows: WindowInstance[]) => void, 
      windows: WindowInstance[], 
      windowID: string, 
      isCollapsed: boolean
    ) => {
      return (
        <PiArt2D 
          desktopSize={currentDesktopSize}
          setWindows={setWindows}
          windows={windows}
          windowID={windowID}
          key={windowID}
          isCollapsed={isCollapsed}
        />
      );
    }
  }
}