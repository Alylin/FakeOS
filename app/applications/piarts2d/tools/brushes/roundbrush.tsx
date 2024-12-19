import { Position } from "@/app/utility/position";
import { cloneImage, getPixelsBetweenPoints, setPixelColor } from "../../utility";
import { previewBrush } from "../brushpreview";
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
  onOverlayChange: (workingLayer: ImageData) => void,
  workingLayer: ImageData,
  imageData: ImageData,
  isMouseDown: boolean,
  saveToUndoStack?: boolean
) {
  if (isMouseDown) {
    onOverlayChange(new ImageData(workingLayer.width, workingLayer.height));
    const image = paintLineOrPoint(radius, logicalPoint, hexColor, previousPoint, workingLayer);
    onChange(image, saveToUndoStack || false);
  }
  else {
    onOverlayChange(previewBrush(
      logicalPoint,
      radius,
      imageData,
      workingLayer
    ));
  }
};

const roundBrush: Tool = {
  id: 'roundBrush',
  displayName: 'PEN',
  onMouseMove: paint,
  onMouseDown: paint,
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
    paint(logicalPoint, previousPoint, hexColor, radius, onChange, onOverlayChange, workingLayer, imageData, true, true);
  }
}

export default roundBrush;