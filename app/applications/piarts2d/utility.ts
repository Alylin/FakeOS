import { Position } from "@/app/utility/position";
import { Size } from "@/app/utility/size";

export function getPointIndex(position: Position, imageSize: Size) {
  if (!Number.isInteger(position.x) || !Number.isInteger(position.y)) {
    throw new Error(`Invalid pixel position! (x:${position.x}, y:${position.y})`);
  }
  if (
    position.x > imageSize.width || 
    position.x < 0 || 
    position.y > imageSize.height ||
    position.y < 0
  ) {
    // if the pixel coordinate is outside the image's range
    return null;
  }
  return (position.x + (position.y * imageSize.width)) * 4;
}

export function distanceBetweenPoints(point1: Position, point2: Position) {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function getPixelsInRadius(centerPoint: Position | null, radius: number) {
  if (!centerPoint) {
    return [];
  }
  const points = new Set<Position>();

  for (let x = centerPoint.x - radius; x < centerPoint.x + radius; x++) {
    for (let y = centerPoint.y - radius; y < centerPoint.y + radius; y++) {
      if (distanceBetweenPoints({x: x, y: y}, centerPoint) < radius)
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

export function getPixelsBetweenPoints(point1: Position, point2: Position, imageSize: Size, radius: number) {
  const verticalDistance = point2.y - point1.y;
  const horizontalDistance = point2.x - point1.x;

  const pointIndexes = new Set<Number | null>();
  if (Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
    const h2vRatio = Math.abs(verticalDistance) / Math.abs(horizontalDistance) || 0;
    for(let i = 0; i < Math.abs(horizontalDistance)+1; i++) {
      getPixelsInRadius({
        y: point1.y + Math.round(i * h2vRatio) * ((verticalDistance > 0) ? 1 : -1),
        x: point1.x + (i * ((horizontalDistance > 0) ? 1 : -1))
      }, radius).forEach((point) => {
        pointIndexes.add(
          getPointIndex(
            point,
            imageSize
          )
        );
      });
    }
  }
  else {
    const vh2Ratio = Math.abs(horizontalDistance) / Math.abs(verticalDistance) || 0;
    for(let i = 0; i < Math.abs(verticalDistance)+1; i++) {
      getPixelsInRadius({
        x: point1.x + Math.round(i * vh2Ratio) * ((horizontalDistance > 0) ? 1 : -1),
        y: point1.y + (i * ((verticalDistance > 0) ? 1 : -1))
      }, radius).forEach((point) => {
        pointIndexes.add(
          getPointIndex(
            point,
            imageSize
          )
        );
      });
    }
  }
  return pointIndexes;
}

function hexToDec(hex: string) {
  return Number(`0x${hex}`);
}

export type RGBA = [number, number, number, number];

export function hexToRGBA(hexCode: string, alpha: number = 255): RGBA {
  return [
    hexToDec(hexCode.substring(1,3)),
    hexToDec(hexCode.substring(3,5)),
    hexToDec(hexCode.substring(5,7)),
    alpha
  ];
}

export function isColorDark(rgba: RGBA) {
  return (rgba[0] + (rgba[1] * 1.2) + (rgba[2] * 0.90) + rgba[3]) < 550;
}

export function setPixelColor(image: ImageData, pixelIndex: number, hexCode: string, alpha?: number) {
  const rgba = hexToRGBA(hexCode, alpha);
  image.data.set(rgba, pixelIndex);
}

export function cloneImage(imageData: ImageData) {
  return new ImageData(
    new Uint8ClampedArray(imageData.data), 
    imageData.width, 
    imageData.height
  );
}

export function getLogicalPosition(
  event: MouseEvent | React.MouseEvent, 
  canvasBounds: DOMRect, 
  zoomLevel: number
) {
  return {
    x: Math.floor((event.clientX - canvasBounds.left) / zoomLevel),
    y: Math.floor((event.clientY - canvasBounds.top) / zoomLevel)
  };
}

function weightedAverage(
  number1: number, 
  weight1: number, 
  number2: number, 
  weight2: number
) {
  return (number1 * weight1) + (number2 * weight2);
}

export function mergeImages(images: ImageData[]) {
  let newImageData: Uint8ClampedArray = new Uint8ClampedArray(images[0].data.length);
  for (let imageID = 0; imageID < images.length; imageID++) {
    const imageData = images[imageID].data;
    for (let i = 0; i < imageData.length; i += 4) {
      const color1Alpha = newImageData[i+3];
      const color2Alpha = imageData[i+3];

      const index1 = i;
      const index2 = i + 1;
      const index3 = i + 2;
      const index4 = i + 3;
    
      if (color1Alpha === 0 || color2Alpha === 255) {
        newImageData[index1] = imageData[index1];
        newImageData[index2] = imageData[index2];
        newImageData[index3] = imageData[index3];
        newImageData[index4] = imageData[index4];
      }
      else if (color2Alpha === 0) {
        newImageData[index1] = newImageData[index1];
        newImageData[index2] = newImageData[index2];
        newImageData[index3] = newImageData[index3];
        newImageData[index4] = newImageData[index4];
      }
      else {
        const color1Weight = color1Alpha / Math.min(color1Alpha + color2Alpha) || 0;
        const color2Weight = (1 - color1Weight)*255;
        
        newImageData[index1] = weightedAverage(newImageData[index1], color1Weight, imageData[index1], color2Weight);
        newImageData[index2] = weightedAverage(newImageData[index2], color1Weight, imageData[index2], color2Weight);
        newImageData[index3] = weightedAverage(newImageData[index3], color1Weight, imageData[index3], color2Weight);
        newImageData[index4] = 255; // test108 this is just wrong
      }
    }
  }
  
  return new ImageData(
    newImageData,
    images[0].width,
    images[0].height
  );
}