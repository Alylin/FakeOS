import React from "react";
import { Size } from "../../utility/size";
import Window from "../../os/windows/window";
import { closeWindow, NewWindow, WindowInstance } from "../../os/windows/windowmanager";

export default function MrUglyMainPage(
  { 
    desktopSize, 
    setWindows, 
    windows, 
    windowID, 
    isCollapsed
  }: { 
    desktopSize: Size, 
    setWindows: (windows: WindowInstance[]) => void, 
    windows: WindowInstance[],
    windowID: string,
    isCollapsed: boolean
}) {
  return (
    <Window
        title="Mr. Ugly" 
        desktopSize={desktopSize}
        setWindows={setWindows}
        windows={windows}
        windowID={windowID}
        icon={
          <div 
              className={`h-5 w-5 bg-contain`} 
              style={{
                  'backgroundImage': `url("/icons/uglypoorlycutout.png")`
              }}
          />
        }
        isCollapsed={isCollapsed}
        minWidth={400}
        minHeight={120}
    >
      <div className="p-1 px-3 h-full bg-white">
        test
      </div>
    </Window>
  );
}


export function getMrUglyData(): NewWindow {
  return {
      applicationID: 'mrugly', 
      windowDisplayName: 'Mr. Ugly',
      icon: "bg-[url('/icons/uglypoorlycutout.png')]",
      render: (
          currentDesktopSize: Size, 
          setWindows: (windows: WindowInstance[]) => void, 
          windows: WindowInstance[], 
          windowID: string, 
          isCollapsed: boolean
      ) => {
          return (
              <MrUglyMainPage 
                  desktopSize={currentDesktopSize}
                  setWindows={setWindows}
                  windows={windows}
                  windowID={windowID}
                  key={windowID}
                  isCollapsed={isCollapsed}
              />
          );
      }
  }
}