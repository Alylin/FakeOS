import { Ref } from "react";
import { getAudioPlayerData } from "../../applications/audioplayer/audioplayer";
import { getAnimationTest } from "../../applications/games/animationtest";
import { Size } from "../../utility/size";
import { getNotepadData } from "../../applications/notepad/notepad";
import { WindowInstance, openWindow } from "../windows/windowmanager";
import ShortCut from "./shortcut";
import { getFileBrowserData } from "@/app/applications/filebrowser/ui/filebrowser";
import { getMrUglyData } from "@/app/applications/mrugly/mainpage";
import { getPiArt2DData } from "@/app/applications/piarts2d/mainpage";

export default function Desktop({ desktopArea, desktopSize, windows, setWindows }: { desktopArea: Ref<HTMLDivElement>, desktopSize: Size, windows: WindowInstance[], setWindows: (windows: WindowInstance[]) => void}) {
  return ( // background.avif
    <div ref={desktopArea} className="h-full w-full bg-cover bg-center bg-[url('/background.avif')] bg-no-repeat">
      <ShortCut 
        applicationData={getNotepadData()} // test108 shouldn't have to run this every time this rerenders. Probably a useState. 
        windows={windows}
        setWindows={setWindows}
        position={{
          x: 50,
          y: 50
        }}
      />
      <ShortCut 
        applicationData={getAudioPlayerData()} // test108 shouldn't have to run this every time this rerenders. Probably a useState. 
        windows={windows}
        setWindows={setWindows}
        position={{
          x: 150,
          y: 50
        }}
      />
      <ShortCut 
        applicationData={getAnimationTest()} // test108 shouldn't have to run this every time this rerenders. Probably a useState. 
        windows={windows}
        setWindows={setWindows}
        position={{
          x: 250,
          y: 50
        }}
      />
      <ShortCut 
        applicationData={getFileBrowserData()} // test108 shouldn't have to run this every time this rerenders. Probably a useState. 
        windows={windows}
        setWindows={setWindows}
        position={{
          x: 350,
          y: 50
        }}
      />
      <ShortCut 
        applicationData={getPiArt2DData()} // test108 shouldn't have to run this every time this rerenders. Probably a useState? idk maybe it's no issue
        windows={windows}
        setWindows={setWindows}
        position={{
          x: 450,
          y: 50
        }}
      />
      {
        [...windows].sort((window1, window2) => {
          return window1.zIndex - window2.zIndex;
        }).map((window) => {
          return window.render(desktopSize, setWindows, windows, window.windowID, window.isMinimized);
        })
      }
    </div>
  );
}