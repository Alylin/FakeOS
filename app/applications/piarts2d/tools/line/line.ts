import { Position } from "@/app/utility/position";
import { getPixelsBetweenPoints, setPixelColor } from "../../utility";
import { previewBrush } from "../brushpreview";
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
  onOverlayChange: (workingLayer: ImageData) => void,
  image: ImageData,
  workingLayer: ImageData,
  saveToUndoStack: boolean
) {
  if (point1) {
    onOverlayChange(new ImageData(workingLayer.width, workingLayer.height));
    const image = paintLineOrPoint(radius, logicalPoint, hexColor, point1, workingLayer);
    onChange(image, saveToUndoStack);
  }
  else {
    onOverlayChange(
      previewBrush(
        logicalPoint,
        radius,
        image,
        workingLayer
      )
    );
  }
};

const line: Tool = {
  id: 'line',
  displayName: 'LINE',
  onMouseMove: (
    logicalPoint: Position, 
    previousPoint: Position | null, 
    hexColor: string,
    radius: number,
    onChange: (imageData: ImageData, saveToUndoStack: boolean) => void,
    onOverlayChange: (workingLayer: ImageData) => void,
    workingLayer: ImageData,
    imageData: ImageData
  ) => {
    paint(
      logicalPoint, 
      hexColor,
      radius,
      onChange,
      onOverlayChange,
      imageData,
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
    onOverlayChange: (workingLayer: ImageData) => void,
    workingLayer: ImageData,
    imageData: ImageData
  ) => {
    paint(
      logicalPoint, 
      hexColor,
      radius,
      onChange,
      onOverlayChange,
      imageData,
      workingLayer,
      true
    );
    point1 = null;
  }
}

export default line;