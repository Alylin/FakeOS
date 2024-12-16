import React, { useEffect, useState } from "react";
import { Size } from "../../utility/size";
import Window from "../../os/windows/window";
import { closeWindow, NewWindow, WindowInstance } from "../../os/windows/windowmanager";
import Canvas from "./canvas/canvas";
import MenuBar from "@/app/os/windows/menubar";
import roundBrush from "./tools/brushes/roundbrush";
import { Tool } from "./tools/tool";
import fill from "./tools/fill/fill";
import line from "./tools/line/line";
import drippyBrush from "./tools/brushes/drippy/drippybrush";
import fillTool from "./tools/fill/fill";

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

const tools = [
  roundBrush,
  fillTool,
  line,
  drippyBrush
]

export function ToolBar({ 
  brushRadius,
  onBrushRadiusChange,
  currentTool,
  onToolChange
}: { 
  brushRadius: number,
  onBrushRadiusChange: (radius: number) => void,
  currentTool: Tool,
  onToolChange: (tool: Tool) => void
}) {
  return (
    <div className="content-start min-w-12 min-h-full max-w-12 bg-neutral-300 border-r border-r-black border-solid">
      {
        tools.map((tool) => (
          <button 
            className={`p-1 py-0 h-5 w-full border border-black block ${currentTool.id === tool.id ? 'bg-neutral-500 text-white' : 'bg-neutral-300'}`}
            onClick={() => {
              onToolChange(tool);
            }}
            key={tool.id}
          >
            {tool.displayName}
          </button>
        ))
      }

      <div className="mt-3">
        <button 
          className="p-1 py-0 h-5 w-full border border-black block"
          onClick={() => {
            onBrushRadiusChange(1);
          }}
        >
          .
        </button>
        <button 
          className="p-1 py-0 h-5 w-full border border-black block"
          onClick={() => {
            onBrushRadiusChange(3);
          }}
        >
          *
        </button>
        <button 
          className="p-1 py-0 h-5 w-full border border-black block"
          onClick={() => {
            onBrushRadiusChange(10);
          }}
        >
          O
        </button>
      </div>
    </div>
  );
}