import { useRef } from "react";

export default function ProgressBar({
  currentAudio,
  currentTime,
  duration
}: {
  currentAudio: HTMLAudioElement | null,
  currentTime: number,
  duration: number
}) {
  const progressBar = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 py-2 pr-0">
      <div 
        className="h-2 bg-neutral-400 w-full group cursor-pointer"
        ref={progressBar}
        onClick={(clickEvent: React.MouseEvent) => {
          if (currentAudio && progressBar.current) { 
            const bounds = progressBar.current.getBoundingClientRect();
            const distanceAlongXAxis = clickEvent.clientX - bounds.left;
            const percentageAlongXAxis = distanceAlongXAxis / bounds.width;
            const positionInSong = duration * percentageAlongXAxis;
            currentAudio.currentTime = positionInSong;
          }
        }}
      >
        <div
          className="h-2 bg-[#546656] relative" // test108 hardcoded color??? Bad! BAD!
          style={{
            width: `${Math.round(currentTime/duration*1000)/10}%`
          }}
        >
            <div className="w-2 h-0 group-hover:h-4 bg-windowPrimary absolute right-0 -top-1 rounded-full" />
        </div>
      </div>
    </div>
  );
}