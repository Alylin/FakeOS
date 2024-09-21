import { useEffect, useState } from "react";
import { moveToFront, WindowInstance } from "./applications/window/windowmanager";

function useTime() {
    const [dateAndTime, setDateAndTime] = useState(new Date());
    useEffect(() => {
        setTimeout(() => {
            setDateAndTime(new Date());
        }, 100);
    }, [dateAndTime]);
    const hours = dateAndTime.getHours();
    const minutes = dateAndTime.getMinutes();
    return `${hours > 12 ? hours % 12 : hours}:${minutes > 9 ? minutes : '0'+minutes} ${hours > 12 ? 'PM' : 'AM'}`;
}

function Clock() {
    const time = useTime();
    return (
        <div className="h-full px-5 text-white flex items-center align-middle">
            {time}
        </div>
    );
  }
  
  function ApplicationTab({ 
    window,
    setWindows,
    windows,
    zIndex
  }: {
      window: WindowInstance,
      setWindows: (windows: WindowInstance[]) => void, 
      windows: WindowInstance[],
      zIndex: number
    }
  ) {
    return (
      <button
        onClick={() => {
            moveToFront(
                windows, 
                setWindows, 
                window.windowID
            );
        }}
        className={`px-4 font-mono relative flex items-center justify-center text-center -ml-2 pl-5 text-white rounded-r-xl ${window.isFocused ? 'font-bold bg-[#546656]' : 'from-windowHighlight bg-gradient-to-b to-windowPrimary to-15%'}`}
        style={{
            zIndex: zIndex
        }}
      >
        <div 
            className={`h-5 w-5 bg-contain mr-2`} 
            style={{
                'backgroundImage': `url("${window.icon}")`
            }}
        />
        {window.windowDisplayName}
      </button>
    );
  }

export default function TaskBar({ 
    windows, 
    setWindows
} : {
    setWindows: (windows: WindowInstance[]) => void, 
    windows: WindowInstance[],
}) {
    return (
        <div className="w-full h-10 from-windowHighlight bg-gradient-to-b to-windowPrimary to-15% z-10 flex">
            <button className="font-mono z-30 text-white italic flex justify-center items-center border-x border-buttonHighlight px-5 from-buttonHighlight bg-gradient-to-b to-buttonPrimary to-15% hover:from-buttonHoverHighlight hover:to-buttonHoverPrimary">
            Lets Go!
            </button>
            {
                windows.map((window, index) => 
                    <ApplicationTab window={window} windows={windows} setWindows={setWindows} zIndex={windows.length - index} />
                )
            }
            <div className="flex-1"/>
            <Clock />
        </div>
    );
}