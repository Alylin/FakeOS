import { useEffect, useRef, useState } from "react";
import Dropdown from "../../reusableui/dropdown";
import { moveToFront, WindowInstance } from "../windows/windowmanager";

function useTime() {
  const [dateAndTime, setDateAndTime] = useState(new Date());
  useEffect(() => {
    setTimeout(() => {
      setDateAndTime(new Date());
    }, 100);
  }, [dateAndTime]);
  const hours = dateAndTime.getHours();
  const minutes = dateAndTime.getMinutes();
  let hoursAMPM = hours % 12
  if (hoursAMPM === 0) {
    hoursAMPM = 12;
  }
  return `${hoursAMPM}:${minutes > 9 ? minutes : '0'+minutes} ${hours > 12 ? 'PM' : 'AM'}`;
}

function Clock() {
  const time = useTime();
  return (
    <div className="h-full px-5 text-white flex items-center align-middle">
      {time}
    </div>
  );
}

function groupApplications(
  windows: WindowInstance[]
) {
  const groupedWindows = new Map<string, WindowInstance[]>();
  windows.forEach((window) => {
    if (!groupedWindows.get(window.applicationID)) {
      groupedWindows.set(window.applicationID, [])
    }
    groupedWindows.get(window.applicationID)?.push(window);
  });
  return groupedWindows;
}

function SubTab({ 
  window,
  setWindows,
  windows,
  zIndex,
  onClick
}: {
  window: WindowInstance,
  setWindows: (windows: WindowInstance[]) => void, 
  windows: WindowInstance[],
  zIndex: number,
  onClick: () => void
}) {
  return (
    <button
      onClick={() => {
        moveToFront(
          windows, 
          setWindows, 
          window.windowID
        );
        onClick();
      }}
      className={`p-2 w-full pr-8 pl-4 font-mono relative flex items-center justify-center text-center text-white ${window.isFocused ? 'font-bold bg-[#546656]' : 'bg-windowPrimary'}`}
      style={{
        zIndex: zIndex
      }}
    >
      {window.windowDisplayName}
    </button>
  );
}

function ApplicationTab({ 
  windowGroup,
  setWindows,
  windows,
  zIndex
}: {
  windowGroup: WindowInstance[],
    setWindows: (windows: WindowInstance[]) => void, 
    windows: WindowInstance[],
    zIndex: number
  }
) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const primaryWindow = windowGroup.sort((window1, window2) => {
    return window2.zIndex - window1.zIndex;
  })[0];
  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => {
          if (windowGroup.length === 1) {
            moveToFront(
              windows, 
              setWindows, 
              primaryWindow.windowID
            );
          }
          else {
            setIsOpen(!isOpen);
          }
        }}
        className={`px-4 font-mono relative flex items-center justify-center text-center -ml-2 pl-5 text-white rounded-r-xl ${primaryWindow.isFocused ? 'font-bold bg-[#546656]' : 'from-windowHighlight bg-gradient-to-b to-windowPrimary to-15%'}`}
        style={{
          zIndex: zIndex
        }}
      >
        <div 
          className={`h-5 w-5 bg-contain mr-2 ${primaryWindow.icon}`} 
        />
        {primaryWindow.windowDisplayName}
      </button>

      <Dropdown 
         isOpen={isOpen}
         onClose={() => {
            setIsOpen(false);
         }} 
         targetElement={buttonRef} 
         isAbove={true}
      >
        <div className="pr-4 pl-2">
          <div className="bg-windowPrimary rounded-t-lg overflow-hidden">
            {
              [...windowGroup.values()].sort((window1, window2) => window1.instanceID - window2.instanceID).map((window) => {
                return (
                  <SubTab 
                    window={window}
                    setWindows={setWindows}
                    windows={windows}
                    zIndex={window.zIndex}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  />
                );
              })
            }
          </div>
        </div>
      </Dropdown>
    </>
  );
}

export default function TaskBar({ 
    windows, 
    setWindows
} : {
    setWindows: (windows: WindowInstance[]) => void, 
    windows: WindowInstance[],
}) {
  const groupedApplications = groupApplications(windows);
  return (
    <div className="w-full h-10 from-windowHighlight bg-gradient-to-b to-windowPrimary to-15% z-10 flex">
      <button className="font-mono z-30 text-white italic flex justify-center items-center border-x border-buttonHighlight px-5 from-buttonHighlight bg-gradient-to-b to-buttonPrimary to-15% hover:from-buttonHoverHighlight hover:to-buttonHoverPrimary">
        Lets Go!
      </button>
      {
        [...groupedApplications.values()].map((windowGroup, index) => // test108 shouldn't be using index long-term. 
          <ApplicationTab key={index} windowGroup={windowGroup} windows={windows} setWindows={setWindows} zIndex={windows.length - index} />
        )
      }
      <div className="flex-1"/>
      <Clock />
    </div>
  );
}