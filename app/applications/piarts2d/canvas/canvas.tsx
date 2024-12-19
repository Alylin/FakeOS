import { addGlobalListener } from "@/app/utility/globallistener";
import { Size } from "@/app/utility/size";
import React, { useEffect, useRef } from "react";

export default function Canvas({
  zoomLevel = 5, 
  size,
  imageData,
  onMouseDown,
  onMouseMove,
  onMouseUp
}: {
  zoomLevel?: number,
  size: Size,
  imageData: ImageData,
  onMouseDown: (event: React.MouseEvent, canvas: HTMLCanvasElement) => void,
  onMouseMove: (event: React.MouseEvent, canvas: HTMLCanvasElement) => void,
  onMouseUp: (event: React.MouseEvent, canvas: HTMLCanvasElement) => void
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvas.current) {
      const ctx = canvas.current.getContext('2d');
      if (ctx) {
        ctx.putImageData(imageData, 0, 0);
      }
    }
  }, [imageData, canvas.current]);

  useEffect(() => {
    const mouseMovedTeardown = addGlobalListener( // test108 this is a bad way of doing it, having to update every time the previous point changes. Bleh. What is the right way to do this? 
      'mousemove',
      (event: React.MouseEvent) => {
        if (canvas.current) {
          onMouseMove(event, canvas.current);
        }
      }
    );
    const mouseUpTeardown = addGlobalListener(
      'mouseup',
      (event: React.MouseEvent) => {
        if (canvas.current) {
          onMouseUp(event, canvas.current);
        }
      }
    );
    return () => {
      mouseMovedTeardown();
      mouseUpTeardown();
    };
  }, [zoomLevel, onMouseMove, onMouseUp]);

  return (
    <canvas
      className="bg-white"
      width={size.width}
      height={size.height}
      style={{
        imageRendering: '-moz-crisp-edges',
        width: `${size.width*zoomLevel}px`,
        height: `${size.height*zoomLevel}px`
      }}
      ref={canvas}
      onMouseDown={(event) => {
        if (canvas.current) {
          onMouseDown(event, canvas.current)
        }
      }}
    />
  );
}