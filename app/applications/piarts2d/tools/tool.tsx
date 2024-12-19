import { Position } from "@/app/utility/position";
import { Size } from "@/app/utility/size";

type ToolFunction = 
  (
    logicalPoint: Position, 
    previousPoint: Position | null, 
    hexColor: string,
    radius: number,
    onChange: (workingLayer: ImageData, saveToUndoStack: boolean) => void,
    onOverlayChange: (workingLayer: ImageData) => void,
    workingLayer: ImageData,
    imageData: ImageData,
    isMouseDown: boolean
  ) => void

export type Tool = {
  id: string,
  displayName: string,
  onMouseUp: ToolFunction,
  onMouseDown: ToolFunction,
  onMouseMove: ToolFunction
};