import { addGlobalListener } from "@/app/utility/globallistener";
import { Position } from "@/app/utility/position";
import { Size } from "@/app/utility/size";
import { useEffect, useRef, useState } from "react";
import { Tool } from "./tools/tool";

function getLogicalPosition(
  event: MouseEvent | React.MouseEvent, 
  canvasBounds: DOMRect, 
  zoomLevel: number
) {
  return {
    x: Math.floor((event.clientX - canvasBounds.left) / zoomLevel),
    y: Math.floor((event.clientY - canvasBounds.top) / zoomLevel)
  };
}

function mergeImage(image1: ImageData, image2: ImageData) {
  let newImageData: Uint8ClampedArray = new Uint8ClampedArray(image1.data.length);
  for (let i = 0; i < image1.data.length; i += 4) {
    if (image2.data[i+3] > 0) {
      newImageData[i] = image2.data[i];
      newImageData[i+1] = image2.data[i+1];
      newImageData[i+2] = image2.data[i+2];
      newImageData[i+3] = image2.data[i+3];
    }
    else {
      newImageData[i] = image1.data[i];
      newImageData[i+1] = image1.data[i+1];
      newImageData[i+2] = image1.data[i+2];
      newImageData[i+3] = image1.data[i+3];
    }
  }

  return new ImageData(
    newImageData,
    image1.width,
    image1.height
  );
}

export default function Canvas({
  zoomLevel = 5, 
  size,
  radius,
  color,
  tool,
  imageData,
  workingLayer,
  onChange,
  onTemporaryChange
}: {
  zoomLevel?: number,
  size: Size,
  radius: number,
  color: string,
  tool: Tool,
  imageData: ImageData,
  workingLayer: ImageData,
  onChange: (imageData: ImageData) => void,
  onTemporaryChange: (imageData: ImageData) => void
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [previousPoint, setPreviousPoint] = useState<Position | null>(null);


  useEffect(() => {
    if (canvas.current) {
      const ctx = canvas.current.getContext('2d');
      if (ctx) {
        ctx.putImageData(mergeImage(imageData, workingLayer), 0, 0);
      }
    }
  }, [imageData, workingLayer, canvas.current]);

  useEffect(() => {
    const mouseMovedTeardown = addGlobalListener( // test108 this is a bad way of doing it, having to update every time the previous point changes. Bleh.
      'mousemove',
      (event: MouseEvent) => {
        if (canvas.current) {
          const logicalPoint = getLogicalPosition(
            event, 
            canvas.current.getBoundingClientRect(), 
            zoomLevel
          );
          setPreviousPoint(logicalPoint);
          if (canvas.current) {
            tool.onMouseMove(
              logicalPoint,
              previousPoint, 
              color,
              radius,
              (workingLayer, commitToCanvas) => {
                if (commitToCanvas) {
                  onChange(workingLayer);
                  return;
                }
                onTemporaryChange(workingLayer);
              },
              workingLayer,
              imageData
            )
          }
        }
      },
      !isDrawing
    );
    const mouseUpTeardown = addGlobalListener(
      'mouseup',
      (event: MouseEvent) => {
        if (canvas.current) {
          const logicalPoint = getLogicalPosition(
            event, 
            canvas.current.getBoundingClientRect(), 
            zoomLevel
          );
          tool.onMouseUp(
            logicalPoint,
            previousPoint, 
            color,
            radius,
            (workingLayer, commitToCanvas) => {
              if (commitToCanvas) {
                onChange(workingLayer);
                return;
              }
              onTemporaryChange(workingLayer);
            },
            workingLayer,
            imageData
          );
        }
        setPreviousPoint(null);
        setIsDrawing(false);
      },
      !isDrawing
    );
    return () => {
      mouseMovedTeardown();
      mouseUpTeardown();
    };
  }, [isDrawing, zoomLevel, previousPoint]);

  return (
    <canvas
      className="bg-white"
      width={size.width}
      height={size.height}
      style={{
        imageRendering: '-moz-crisp-edges',
        width: `${size.width*zoomLevel}px`,
        height: `${size.height*zoomLevel}px`
      }}
      ref={canvas}
      onMouseDown={(event) => {
        window.requestAnimationFrame(() => {
          if (canvas.current) {
            const logicalPoint = getLogicalPosition(
              event, 
              canvas.current.getBoundingClientRect(), 
              zoomLevel
            );
            tool.onMouseDown(
              logicalPoint,
              previousPoint, 
              color,
              radius,
              (workingLayer, commitToCanvas) => {
                if (commitToCanvas) {
                  onChange(workingLayer);
                  return;
                }
                onTemporaryChange(workingLayer);
              },
              workingLayer,
              imageData
            )
          }
        });
        setIsDrawing(true);
      }}
    />
  );
}