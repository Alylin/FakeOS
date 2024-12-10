import { Position } from "@/app/utility/position";
import { Size } from "@/app/utility/size";

type ToolFunction = 
  (
    logicalPoint: Position, 
    previousPoint: Position | null, 
    hexColor: string,
    radius: number,
    onChange: (workingLayer: ImageData, saveToUndoStack: boolean) => void,
    workingLayer: ImageData,
    imageData: ImageData
  ) => void

export type Tool = {
  onMouseUp: ToolFunction,
  onMouseDown: ToolFunction,
  onMouseMove: ToolFunction
};