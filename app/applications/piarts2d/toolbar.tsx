import React, { useEffect, useState } from "react";
import { Size } from "../../utility/size";
import Window from "../../os/windows/window";
import { closeWindow, NewWindow, WindowInstance } from "../../os/windows/windowmanager";
import Canvas from "./canvas/canvas";
import MenuBar from "@/app/os/windows/menubar";
import roundBrush from "./canvas/tools/brushes/roundbrush";
import { Tool } from "./canvas/tools/tool";
import fill from "./canvas/tools/fill/fill";
import line from "./canvas/tools/line/line";
import drippyBrush from "./canvas/tools/brushes/drippy/drippybrush";

function ColorSwatch({color, onColorSet}: {color: string, onColorSet: (color: string) => void}) {
  return (
    <button 
      className="p-1 py-0 h-5 w-5 border border-black block"
      onClick={() => {
        onColorSet(color);
      }}
      style={{
        backgroundColor: color
      }}
    />
  )
}

export function ColorPalette({
  color,
  onColorChanged,
  palette
}: {
  color: string,
  onColorChanged: (color: string) => void,
  palette: string[]
}) {
  return (
    <div className="border-t-black border-t">
      <div className="flex border-t h-12 w-56 flex-wrap justify-center gap-0.5 py-0.5 content-start">
        {
          palette.map((color) => {
            return <ColorSwatch color={color} onColorSet={() => {
              onColorChanged(color);
            }} />
          })
        }
      </div>
    </div>
  )
}

export function ToolBar({ 
  brushRadius,
  onBrushRadiusChange,
  tool,
  onToolChange
}: { 
  brushRadius: number,
  onBrushRadiusChange: (radius: number) => void,
  tool: Tool,
  onToolChange: (tool: Tool) => void
}) {
  return (
    <div className="content-start min-w-12 min-h-full max-w-12 bg-neutral-300 border-r border-r-black border-solid">
      <button 
        className="p-1 py-0 h-5 w-full border border-black block"
        onClick={() => {
          onToolChange(roundBrush);
          onBrushRadiusChange(1);
        }}
      >
        .
      </button>
      <button 
        className="p-1 py-0 h-5 w-full border border-black block"
        onClick={() => {
          onToolChange(roundBrush);
          onBrushRadiusChange(3);
        }}
      >
        *
      </button>
      <button 
        className="p-1 py-0 h-5 w-full border border-black block"
        onClick={() => {
          onToolChange(roundBrush);
          onBrushRadiusChange(10);
        }}
      >
        O
      </button>

      <button 
        className="p-1 py-0 h-5 w-full border border-black block"
        onClick={() => {
          onToolChange(fill);
        }}
      >
        FILL
      </button>

      <button 
        className="p-1 py-0 h-5 w-full border border-black block"
        onClick={() => {
          onToolChange(line);
        }}
      >
        LINE
      </button>

      <button 
        className="p-1 py-0 h-5 w-full border border-black block"
        onClick={() => {
          onToolChange(drippyBrush);
        }}
      >
        DRIP
      </button>
    </div>
  );
}