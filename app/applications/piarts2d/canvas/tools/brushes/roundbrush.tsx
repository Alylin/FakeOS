import { Position } from "@/app/utility/position";
import { cloneImage, getPixelsBetweenPoints, setPixelColor } from "../../utility";
import { Tool } from "../tool";

function paintLineOrPoint(
  lineWidth: number, 
  point1: Position, 
  hexColor: string,
  point2: Position | null,
  workingLayer: ImageData
) {
  const image = cloneImage(workingLayer);
  const points = point2 ?
    getPixelsBetweenPoints(point2, point1, image, lineWidth) :
    getPixelsBetweenPoints(point1, point1, image, lineWidth);

  [...points.values()].filter((pixelIndex) => {
    return pixelIndex !== null;
  }).forEach((pixelIndex: any) => { // [JANK] :any is a jank hack to make ts not recognize what the filter is doing. 
    setPixelColor(image, pixelIndex, hexColor)
  });
  return image;
}

function paint(
  logicalPoint: Position, 
  previousPoint: Position | null, 
  hexColor: string,
  radius: number,
  onChange: (imageData: ImageData, saveToUndoStack: boolean) => void,
  workingLayer: ImageData,
  imageData: ImageData,
  saveToUndoStack?: boolean
) {
    const image = paintLineOrPoint(radius, logicalPoint, hexColor, previousPoint, workingLayer);
    onChange(image, saveToUndoStack || false);
};

const roundBrush: Tool = {
  onMouseMove: paint,
  onMouseDown: paint,
  onMouseUp: (
    logicalPoint: Position, 
    previousPoint: Position | null, 
    hexColor: string,
    radius: number,
    onChange: (imageData: ImageData, saveToUndoStack: boolean) => void,
    workingLayer: ImageData,
    imageData: ImageData
  ) => {
    paint(logicalPoint, previousPoint, hexColor, radius, onChange, workingLayer, imageData, true);
  }
}

export default roundBrush;