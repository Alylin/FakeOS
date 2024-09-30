import { Position } from "../utility/position";
import { NewWindow, openWindow, WindowInstance } from "../applications/window/windowmanager";

export default function ShortCut({
  applicationData,
  windows,
  setWindows,
  position
}: {
  applicationData: NewWindow,
  windows: WindowInstance[], 
  setWindows: (windows: WindowInstance[]) => void,
  position: Position
}) {
  return (
    <button
      style={{
        left: `${position.x}px`, 
        top: `${position.y}px`
      }}
      className="absolute w-20 flex items-center flex-col overflow-hidden"
      onClick={() => {
          openWindow(
              windows,
              setWindows,
              applicationData
          );
      }}
    >
        <div className={`${applicationData.icon} bg-contain bg-center bg-no-repeat h-12 w-12`} />
        <div className="text-white blackOutline leading-5">
            {applicationData.windowDisplayName}
        </div>
    </button>
  );
}