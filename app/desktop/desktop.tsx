import { Ref } from "react";
import { getAudioPlayerData } from "../applications/audioplayer/audioplayer";
import { Size } from "../applications/generic/size";
import { getNotepadData } from "../applications/notepad/notepad";
import { WindowInstance, openWindow } from "../applications/window/windowmanager";

export default function Desktop({ desktopArea, desktopSize, windows, setWindows }: { desktopArea: Ref<HTMLDivElement>, desktopSize: Size, windows: WindowInstance[], setWindows: (windows: WindowInstance[]) => void}) {
    return ( // background.avif
        <div ref={desktopArea} className="h-full w-full bg-cover bg-center bg-[url('/background.avif')] bg-no-repeat">
            <button 
                className="absolute left-10 top-10 w-20 flex items-center flex-col overflow-hidden"
                onClick={() => {
                    openWindow(
                        windows,
                        setWindows,
                        getNotepadData()
                    );
                }}
            >
                <div className="bg-[url('/icontest.svg')] bg-contain bg-center bg-no-repeat h-12 w-12"/>
                <div className="text-white blackOutline">
                    Notepad
                </div>
            </button>

            <button 
                className="absolute left-40 top-10 w-20 flex items-center flex-col overflow-hidden"
                onClick={() => {
                    openWindow(
                        windows,
                        setWindows,
                        getAudioPlayerData()
                    );
                }}
            >
                <div className="bg-[url('/audioplayer.svg')] bg-contain bg-center bg-no-repeat h-12 w-12"/>
                <div className="text-white blackOutline">
                    Audio Player
                </div>
            </button>

            <button 
                className="absolute left-72 top-10 w-20 flex items-center flex-col overflow-hidden"
                onClick={() => {
                    openWindow(
                        windows,
                        setWindows,
                        getAudioPlayerData()
                    );
                }}
            >
                <div className="bg-[url('/audioplayer.svg')] bg-contain bg-center bg-no-repeat h-12 w-12"/>
                <div className="text-white blackOutline">
                    File Manager
                </div>
            </button>

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