import { Position } from "@/app/utility/position";
import { Size } from "@/app/utility/size";
import { cloneImage, getPixelsBetweenPoints, setPixelColor } from "../../utility";
import { Tool } from "../tool";

let point1: Position | null;

function paintLineOrPoint(
  lineWidth: number, 
  point1: Position, 
  hexColor: string,
  point2: Position,
  workingLayer: ImageData
) {
  const image = new ImageData(workingLayer.width, workingLayer.height);
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
  hexColor: string,
  radius: number,
  onChange: (imageData: ImageData, saveToUndoStack: boolean) => void,
  workingLayer: ImageData,
  saveToUndoStack: boolean
) {
  if (point1) {
    const image = paintLineOrPoint(radius, logicalPoint, hexColor, point1, workingLayer);
    onChange(image, saveToUndoStack);
  }
};

const line: Tool = {
  onMouseMove: (
    logicalPoint: Position, 
    previousPoint: Position | null, 
    hexColor: string,
    radius: number,
    onChange: (imageData: ImageData, saveToUndoStack: boolean) => void,
    workingLayer: ImageData,
    imageData: ImageData
  ) => {
    paint(
      logicalPoint, 
      hexColor,
      radius,
      onChange,
      workingLayer,
      false
    );
  },
  onMouseDown: (logicalPoint: Position) => {
    point1 = logicalPoint;
  },
  onMouseUp: (
    logicalPoint: Position, 
    previousPoint: Position | null, 
    hexColor: string,
    radius: number,
    onChange: (imageData: ImageData, saveToUndoStack: boolean) => void,
    workingLayer: ImageData,
    imageData: ImageData
  ) => {
    paint(
      logicalPoint, 
      hexColor,
      radius,
      onChange,
      workingLayer,
      true
    );
    point1 = null;
  }
}

export default line;