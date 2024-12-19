import { Position } from "@/app/utility/position";
import { Size } from "@/app/utility/size";
import { useState } from "react";
import { Tool } from "../tools/tool";
import { getLogicalPosition } from "../utility";
import LayeredCanvas from "./layeredcanvas";

export default function DrawingCanvas({
  zoomLevel = 5, 
  size,
  radius,
  color,
  tool,
  imageData,
  workingLayer,
  overlayLayer,
  onChange,
  onTemporaryChange,
  onOverlayChange
}: {
  zoomLevel?: number,
  size: Size,
  radius: number,
  color: string,
  tool: Tool,
  imageData: ImageData,
  workingLayer: ImageData,
  overlayLayer: ImageData,
  onChange: (imageData: ImageData) => void,
  onTemporaryChange: (imageData: ImageData) => void,
  onOverlayChange: (imageData: ImageData) => void
}) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [previousPoint, setPreviousPoint] = useState<Position | null>(null);

  return (
    <LayeredCanvas
      size={size}
      zoomLevel={zoomLevel}
      layers={[imageData, workingLayer, overlayLayer]}
      onMouseDown={(event: React.MouseEvent, canvas: HTMLCanvasElement) => {
        window.requestAnimationFrame(() => {
          const logicalPoint = getLogicalPosition(
            event, 
            canvas.getBoundingClientRect(), 
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
            onOverlayChange,
            workingLayer,
            imageData,
            isDrawing
          );
        });
        setIsDrawing(true);
      }}
      onMouseMove={(event: React.MouseEvent, canvas: HTMLCanvasElement) => {
        const logicalPoint = getLogicalPosition(
          event, 
          canvas.getBoundingClientRect(), 
          zoomLevel
        );
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
          onOverlayChange,
          workingLayer,
          imageData,
          isDrawing
        )
        setPreviousPoint(logicalPoint);
      }}
      onMouseUp={(event: React.MouseEvent, canvas: HTMLCanvasElement) => {
        const logicalPoint = getLogicalPosition(
          event, 
          canvas.getBoundingClientRect(), 
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
          onOverlayChange,
          workingLayer,
          imageData,
          isDrawing
        );
        setPreviousPoint(null);
        setIsDrawing(false);
      }}
    />
  );
}