import React, { useEffect, useRef, useState } from "react";
import { Size } from "../generic/size";
import Window from "../window/window";
import { closeWindow, NewWindow, WindowInstance } from "../window/windowmanager";
import { MdPause, MdPlayArrow, MdSkipNext, MdSkipPrevious } from "react-icons/md";
import parseAudioMetadata from "parse-audio-metadata";

function getTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return {
    minutes: Math.round(minutes),
    seconds: Math.round(seconds - minutes * 60)
  };
}

function getTimeFormatted(seconds: number) {
  const time = getTime(seconds);
  const secondsPadded = time.seconds > 9 ? time.seconds : `0${time.seconds}`;
  return `${time.minutes}:${secondsPadded}`
}

type metaData = {
  artist?: string,
  title?: string
}

function getSongTitle(metaData: metaData | null) {
  if (metaData === null) {
    return 'loading...'
  }
  if (metaData.artist && metaData.title) {
    return `${metaData.artist} - ${metaData.title}`
  }
  else if (metaData.artist) {
    return metaData.artist;
  }
  else if (metaData.title) {
    return metaData.title;
  }
  return 'Unknown Song';
}

export default function AudioPlayer(
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
  const [currentAudio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [metaData, setMetaData] = useState<metaData | null>(null);
  const progressBar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filename = '03ImposterSyndrome.mp3';
    const audio = new Audio(filename);

    const onLoad = () => {
      setDuration(audio.duration);
      setAudio(audio);

      fetch(audio.src)
      .then(response => response.blob())
      .then((blob) => {
        parseAudioMetadata(blob).then((newMetaData: any) => {
          setMetaData(newMetaData);
        });
      });
    };
    audio.addEventListener('loadeddata', onLoad);
  
    return () => {
      audio.removeEventListener('loadeddata', onLoad);
      audio.pause();
    }
  }, []);

  useEffect(() => {
    if (currentAudio) {
      const play = currentAudio.play();
      play.catch(() => {
          // no-op, dies silently
      });
    }
  }, [currentAudio]);

  useEffect(() => {
    const timerUpdate = () => {
      if (currentAudio) {
        setCurrentTime(currentAudio.currentTime);
      }
    }
    const intervalId = setInterval(timerUpdate, 100);
    return () => {
      clearInterval(intervalId);
    }
  }, [currentAudio]);

  const currentTimeFormatted = getTimeFormatted(currentTime);
  const durationFormatted = getTimeFormatted(duration);

  return (
    <Window
        title="Audio Player" 
        desktopSize={desktopSize} 
        onClose={() => {
            closeWindow(windows, setWindows, windowID);
        }} 
        setWindows={setWindows}
        windows={windows}
        windowID={windowID}
        icon={
          <div 
              className={`h-5 w-5 bg-contain`} 
              style={{
                  'backgroundImage': `url("/audioplayer.svg")`
              }}
          />
        }
        isCollapsed={isCollapsed}
        minWidth={400}
        minHeight={120}
    >
      <div className="p-1 px-3 h-full">
        <div className="font-bold text-ellipsis w-full h-5 text-center">
          {getSongTitle(metaData)}
        </div>
        <div className="flex w-full h-8 bg-white text-right items-center content-center">
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
                className="h-2 bg-[#546656] relative" 
                style={{
                  width: `${Math.round(currentTime/duration*1000)/10}%`
                }}
              >
                  <div className="w-2 h-0 group-hover:h-4 bg-windowPrimary absolute right-0 -top-1 rounded-full" />
              </div>
            </div>
          </div>
          <div className="w-20">
            {`${currentTimeFormatted} - ${durationFormatted}`}
          </div>
        </div>
        <div className="w-full flex justify-center align-middle">
          <button className="w-6 h-6">
            <MdSkipPrevious className="text-windowHighlight" size={25} />
          </button>
          <button 
            className="mx-1 bg-windowHighlight w-6 h-6 rounded-full flex items-center justify-center"
            onClick={() => {
              if (currentAudio) {
                if (currentAudio.paused) {
                  currentAudio.play();
                }
                else {
                  currentAudio.pause();
                }
              }
            }}
          >
            { 
              currentAudio?.paused ? 
              <MdPlayArrow color="white" size={20} /> :
              <MdPause color="white" size={20} />
            }
          </button>
          <button className="w-6 h-6">
            <MdSkipNext className="text-windowHighlight" size={25} />
          </button>
        </div>
      </div>
    </Window>
  );
}


export function getAudioPlayerData(): NewWindow {
  return {
      applicationID: 'audioplayer', 
      windowDisplayName: 'Audio Player',
      icon: '/icontest.svg',
      render: (
          currentDesktopSize: Size, 
          setWindows: (windows: WindowInstance[]) => void, 
          windows: WindowInstance[], 
          windowID: string, 
          isCollapsed: boolean
      ) => {
          return (
              <AudioPlayer 
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