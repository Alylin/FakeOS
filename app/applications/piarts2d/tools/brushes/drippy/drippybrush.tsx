import { Position } from "@/app/utility/position";
import { cloneImage, setPixelColor, getPixelsBetweenPoints } from "../../../utility";
import { previewBrush } from "../../brushpreview";
import { Tool } from "../../tool";

export function getPointsBetweenPoints(point1: Position, point2: Position) {
  const verticalDistance = point2.y - point1.y;
  const horizontalDistance = point2.x - point1.x;

  const points = new Array<Position>();
  if (Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
    const h2vRatio = Math.abs(verticalDistance) / Math.abs(horizontalDistance) || 0;
    for(let i = 0; i < Math.abs(horizontalDistance)+1; i++) {
      points.push({
        y: point1.y + Math.round(i * h2vRatio) * ((verticalDistance > 0) ? 1 : -1),
        x: point1.x + (i * ((horizontalDistance > 0) ? 1 : -1))
      });
    }
  }
  else {
    const vh2Ratio = Math.abs(horizontalDistance) / Math.abs(verticalDistance) || 0;
    for(let i = 0; i < Math.abs(verticalDistance)+1; i++) {
      points.push({
        x: point1.x + Math.round(i * vh2Ratio) * ((horizontalDistance > 0) ? 1 : -1),
        y: point1.y + (i * ((verticalDistance > 0) ? 1 : -1))
      });
    }
  }
  return points;
}

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

function paintDrippyLine(
  point1: Position, 
  hexColor: string,
  point2: Position | null,
  workingLayer: ImageData
) {
  let image = cloneImage(workingLayer);
  const points = point2 ?
    getPointsBetweenPoints(point2, point1) :
    getPointsBetweenPoints(point1, point1);

  points.forEach((point: Position) => {
    image = paintLineOrPoint(
      1, 
      point, 
      hexColor, 
      {
        x: point.x,
        y: point.y + Math.round((Math.random()*1.3) ** 20)
      },
      image
    );
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
    const image = paintDrippyLine(logicalPoint, hexColor, previousPoint, workingLayer);
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

const drippyBrush: Tool = {
  id: 'drippyBrush',
  displayName: 'DRIP',
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

export default drippyBrush;