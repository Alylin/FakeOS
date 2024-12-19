import { Size } from "@/app/utility/size";
import { useEffect, useState } from "react";
import Canvas from "./canvas";
import { mergeImages } from '../utility';

export default function LayeredCanvas({
  zoomLevel = 5, 
  size,
  layers,
  onMouseDown,
  onMouseMove,
  onMouseUp
}: {
  zoomLevel?: number,
  size: Size,
  layers: ImageData[],
  onMouseDown: (event: React.MouseEvent, canvas: HTMLCanvasElement) => void,
  onMouseMove: (event: React.MouseEvent, canvas: HTMLCanvasElement) => void,
  onMouseUp: (event: React.MouseEvent, canvas: HTMLCanvasElement) => void
}) {
  const [finalImageData, setFinalImageData] = useState(() => mergeImages(layers));

  useEffect(() => {
    setFinalImageData(mergeImages(layers));
  }, [layers]);

  return (
    <Canvas
      size={size}
      zoomLevel={zoomLevel}
      imageData={finalImageData}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    />
  );
}