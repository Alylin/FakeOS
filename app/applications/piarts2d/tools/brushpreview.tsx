import { Position } from "@/app/utility/position";
import { distanceBetweenPoints, getPointIndex, isColorDark, setPixelColor } from "../utility";

function getPixelsOnRadius(centerPoint: Position | null, radius: number) {
  if (!centerPoint) {
    return [];
  }
  const points = new Set<Position>();

  for (let x = centerPoint.x - radius; x < centerPoint.x + radius; x++) {
    for (let y = centerPoint.y - radius; y < centerPoint.y + radius; y++) {
      const distance = distanceBetweenPoints({x: x, y: y}, centerPoint);
      if (distance > radius - 1.1 && distance < radius)
      {
        points.add({
          x: x,
          y: y
        });
      }
    }   
  } 
  return points;
}

function paintCircle(
  lineWidth: number, 
  point: Position, 
  imageData: ImageData,
  workingLayer: ImageData
) {
  const image = new ImageData(workingLayer.width, workingLayer.height);
  const points = getPixelsOnRadius(point, lineWidth)
  points.forEach((point: Position) => { // [JANK] :any is a jank hack to make ts not recognize what the filter is doing. 
    const index = getPointIndex(point, workingLayer);
    if (index !== null) {
      const hexColor = isColorDark([
        imageData.data[index], 
        imageData.data[index+1],
        imageData.data[index+2],
        imageData.data[index+3]
      ]) ? '#ffffff' : '#000000';
      setPixelColor(image, index, hexColor);
    }
  });
  return image;
}

export function previewBrush(
  logicalPoint: Position,
  radius: number,
  image: ImageData,
  workingLayer: ImageData
) {
  return paintCircle(
    radius, 
    logicalPoint,
    image,
    workingLayer
  );
}