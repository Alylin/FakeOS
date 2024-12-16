import { Position } from "@/app/utility/position";
import { Size } from "@/app/utility/size";
import { cloneImage, getPointIndex, hexToRGBA, setPixelColor } from "../../utility";
import { Tool } from "../tool";

function getPixelColor(
  image: ImageData,
  logicalPoint: Position
) {
  const pixelIndex = getPointIndex(logicalPoint, image);
  if (!pixelIndex) {
    return [];
  }
  return [
    image.data[pixelIndex],
    image.data[pixelIndex+1],
    image.data[pixelIndex+2],
    image.data[pixelIndex+3]
  ]
}

function compareRGBAs(rgba1: number[], rgba2: number[]) {
  if (rgba1.length === 0 || rgba2.length === 0) {
    // at least one isn't a valid RGBA number.
    return false;
  }
  return rgba1[0] === rgba2[0] && rgba1[1] === rgba2[1] && rgba1[2] === rgba2[2] && rgba1[3] === rgba2[3];
}

function fill(
  logicalPoint: Position,
  previousPoint: Position | null,
  hexColor: string,
  radius: number,
  onChange: (imageData: ImageData, saveToUndoStack: boolean) => void,
  workingLayer: ImageData,
  imageData: ImageData
) {
  const image = cloneImage(imageData);
  
  const color = hexToRGBA(hexColor);
  const growingPixels = [logicalPoint];

  const startingPixelColor = getPixelColor(
    image,
    logicalPoint
  );
  if (compareRGBAs(startingPixelColor, color)) {
    // We aren't doing anything if you click a pixel of the same color as your fill tool.
    return;
  }
  let i = 0;
  while (i < growingPixels.length) {
    const pixel = growingPixels[i];
    i++;
    const index = getPointIndex(pixel, image);
    if (index === null) {
      return;
    }
    setPixelColor(image, index, hexColor);
    const pixelAbove = {
      y: pixel.y - 1,
      x: pixel.x
    }
    const pixelBelow = {
      y: pixel.y + 1,
      x: pixel.x
    }
    const pixelLeft = {
      y: pixel.y,
      x: pixel.x - 1
    }
    const pixelRight = {
      y: pixel.y,
      x: pixel.x + 1
    }
    if (compareRGBAs(startingPixelColor, getPixelColor(image, pixelAbove))) {
      const pointIndex = getPointIndex(pixelAbove, image);
      if (pointIndex !== null) {
        setPixelColor(image, pointIndex, hexColor);
        growingPixels.push(pixelAbove);
      }
    }
    if (compareRGBAs(startingPixelColor, getPixelColor(image, pixelBelow))) {
      const pointIndex = getPointIndex(pixelBelow, image);
      if (pointIndex !== null) {
        setPixelColor(image, pointIndex, hexColor);
        growingPixels.push(pixelBelow);
      }
    }
    if (compareRGBAs(startingPixelColor, getPixelColor(image, pixelLeft))) {
      const pointIndex = getPointIndex(pixelLeft, image);
      if (pointIndex !== null) {
        setPixelColor(image, pointIndex, hexColor);
        growingPixels.push(pixelLeft);
      }      
    }
    if (compareRGBAs(startingPixelColor, getPixelColor(image, pixelRight))) {
      const pointIndex = getPointIndex(pixelRight, image);
      if (pointIndex !== null) {
        setPixelColor(image, pointIndex, hexColor);
        growingPixels.push(pixelRight);
      }      
    }
  }
  onChange(image, true);
}

const fillTool: Tool = {
  id: 'fill',
  displayName: 'FILL',
  onMouseMove: () => {
    // no-op
  },
  onMouseDown: fill,
  onMouseUp: () => {
    // no-op
  }
};

export default fillTool;