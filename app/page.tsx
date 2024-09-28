'use client'

import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { WindowInstance } from './applications/window/windowmanager';
import Desktop from './desktop/desktop';
import BootScreen from './effects/bootscreen';
import LoginPage from './loginpage';
import TaskBar from './taskbar';


function LoadedView() {
  const desktopArea = useRef<HTMLDivElement>(null);
  const [desktopSize, setDesktopSize] = useState({width: 0, height: 0});

  useEffect(() => {
      const onWindowResize = () => {
          if (desktopArea.current) {
              setDesktopSize({
                  width: desktopArea.current.clientWidth,
                  height: desktopArea.current.clientHeight
              });
          }
      };
      onWindowResize();

      window.addEventListener('resize', onWindowResize);
      return () => {
          window.removeEventListener('resize', onWindowResize);
      }
  }, [desktopArea]);

  const [windows, setWindows] = useState<WindowInstance[]>([]);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="w-full flex-1">
        <Desktop desktopArea={desktopArea} desktopSize={desktopSize} windows={windows} setWindows={setWindows} />
      </div>
      <TaskBar windows={windows} setWindows={setWindows} />
    </div>
  );
}

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(false);

  // if (!user) {
  //   return (
  //     <LoginPage />
  //   );
  // }

  if (isLoading) {
    return (
      <BootScreen onComplete={() => {
        setIsLoading(false);
      }} />
    );
  }
  return (  
    <LoadedView />
  );
}

function generateFilter(amount: number) {
  return (
    `brightness(79%) url('data:image/svg+xml, <svg xmlns="http://www.w3.org/2000/svg"> <filter id="idk"> <feColorMatrix in="SourceGraphic" type="matrix" result="red" values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" ></feColorMatrix> <feColorMatrix in="SourceGraphic" type="matrix" result="blue" values="0 0 0 0 0 0 0 0 0 2 0 0 0 0 1 0 0 0 1 0" ></feColorMatrix> <feBlend mode="multiply" in="SourceGraphic" in2="red" result="shadedRed"></feBlend>  <feBlend mode="multiply" in="SourceGraphic" in2="blue" result="shadedBlue"></feBlend>  <feOffset in="shadedBlue" result="blueOffset" dx="${amount}" dy="0"></feOffset> <feOffset in="shadedRed" result="redOffset" dx="-${amount}" dy="-0"></feOffset> <feBlend mode="screen" in="SourceGraphic" in2="redOffset" result="final"></feBlend>  <feBlend mode="screen" in="final" in2="blueOffset" result="final2"></feBlend>  <feMerge> <feMergeNode in="comp"></feMergeNode> </feMerge> </filter> </svg>#idk')`
  );
}

const animationFrames: { 
  duration: number, 
  filter: string, 
  onStart?: () => void 
}[] = [
  {
    duration: -1,
    filter: ''
  },
  {
    duration: 100,
    filter: generateFilter(1),
    onStart: () => {
      const audio = new Audio('bug.wav');
      audio.volume = 0.3;
      const play = audio.play();
      play.catch(() => {
          // no-op, dies silently
      })
    }
  },
  {
    duration: 100,
    filter: generateFilter(13)
  },
  {
    duration: 500,
    filter: generateFilter(5)
  },
  {
    duration: 200,
    filter: generateFilter(7)
  },
  {
    duration: 200,
    filter: ''
  },
  {
    duration: 200,
    filter: generateFilter(7)
  }
]

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function useTime(): number {
  const [animationFrameId, setAnimationFrameId] = useState(0);
  useEffect(() => {
    const animationFrame = animationFrames[animationFrameId];
    setTimeout(() => {
      animationFrame.onStart?.();
      setAnimationFrameId((animationFrameId+1) % animationFrames.length);
    }, animationFrame.duration > 0 ? animationFrame.duration : randomIntFromInterval(10000, 19970131));
  }, [animationFrameId]);
  return animationFrameId;  
}

export default function EffectWrapper() {
  const frameID = useTime();
  return (
    <div
     style={{
       //filter: `url('data:image/svg+xml, <svg xmlns="http://www.w3.org/2000/svg"> <filter id="idk"> <feColorMatrix in="SourceGraphic" type="matrix" result="red" values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" ></feColorMatrix> <feColorMatrix in="SourceGraphic" type="matrix" result="blue" values="0 0 0 0 0 0 0 0 0 2 0 0 0 0 1 0 0 0 1 0" ></feColorMatrix> <feBlend mode="multiply" in="SourceGraphic" in2="red" result="shadedRed"></feBlend>  <feBlend mode="multiply" in="SourceGraphic" in2="blue" result="shadedBlue"></feBlend>  <feOffset in="shadedBlue" result="blueOffset" dx="6" dy="0"></feOffset> <feOffset in="shadedRed" result="redOffset" dx="-6" dy="-0"></feOffset> <feBlend mode="screen" in="SourceGraphic" in2="redOffset" result="final"></feBlend>  <feBlend mode="screen" in="final" in2="blueOffset" result="final2"></feBlend>  <feMerge> <feMergeNode in="comp"></feMergeNode> </feMerge> </filter> </svg>#idk')`}
        filter: animationFrames[frameID].filter
        // url('data:image/svg+xml, <svg xmlns="http://www.w3.org/2000/svg"> <filter id="idk"> <feOffset in="SourceGraphic" result="yellow" dx="-8" dy="-0"></feOffset> <feOffset in="SourceGraphic" result="pre-blue" dx="-10" dy="0"></feOffset> <feColorMatrix in="SourceGraphic" type="matrix" result="red" values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" ></feColorMatrix> <feColorMatrix in="pre-blue" type="matrix" result="blue" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0" ></feColorMatrix> <feBlend mode="multiply" in="SourceGraphic" in2="red" result="main1"></feBlend> <feOffset in="main1" result="redOffset" dx="-6" dy="-0"></feOffset> <feBlend mode="color-dodge" in="SourceGraphic" in2="redOffset" result="final"></feBlend> <feMerge> <feMergeNode in="comp"></feMergeNode> </feMerge> </filter> </svg>#idk')
        // url('data:image/svg+xml, <svg xmlns="http://www.w3.org/2000/svg"> <filter id="idk"> <feOffset in="SourceGraphic" result="yellow" dx="-8" dy="-0"></feOffset> <feColorMatrix in="SourceGraphic" type="matrix" result="red" values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" ></feColorMatrix> <feColorMatrix in="SourceGraphic" type="matrix" result="blue" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0" ></feColorMatrix> <feBlend mode="multiply" in="SourceGraphic" in2="red" result="shadedRed"></feBlend>  <feBlend mode="multiply" in="SourceGraphic" in2="blue" result="shadedBlue"></feBlend>  <feOffset in="shadedBlue" result="blueOffset" dx="20" dy="-0"></feOffset> <feOffset in="shadedRed" result="redOffset" dx="-6" dy="-0"></feOffset> <feBlend mode="color-dodge" in="SourceGraphic" in2="redOffset" result="final"></feBlend> <feBlend mode="" in="final" in2="blueOffset" result="final2"></feBlend> <feMerge> <feMergeNode in="comp"></feMergeNode> </feMerge> </filter> </svg>#idk')
      }}
    >
      <Home />
    </div>
  );
}
/*
Stage Left
╔══════════════════════════════╦═══════════════════════════════════════════════════════════════════════════╗
║     ___   _,----˾___         ║                                                                           ║
║    /   ˉ˞ˉ          ""=_     ║     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do       ║
║    \ /       _˾˾---˾_   \    ║   eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim a   ║
║    |   |  |/         \   |   ║  minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip  ║
║ ___┴__|  |' ____  ____|  |   ║     ex ea commodo consequat. Duis aute irure dolor in reprehenderit...    ║
║  '--˾__|  | ( █     █)|  |   ║                                                                           ║
║   |   ✿ | |       '  ,|  |   ║     In voluptate velit esse cillum dolore eu fugiat nulla pariatur.       ║
║   |     | |\_    -  / | |    ║                                                                           ║
║  |   |  | \ |ˉˉ'--'ˉ  | |    ║    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui      ║
║  |   |   \ ||    |    | |    ║                officia deserunt mollit anim id est laborum.               ║
║  \  |   / \\      ˭'--//     ║                                                                           ║
║   ',_ /                 \    ║                                                                           ║
╠═════╧════════════════════╧═══╣                                                                           ║
║        TimidestVampire       ║                                                                           ║
╚══════════════════════════════╩═══════════════════════════════════════════════════════════════════════════╝

forward
╔══════════════════════════════╦═══════════════════════════════════════════════════════════════════════════╗
║     ___   _,----˾___         ║                                                                           ║
║    /   ˉ˞ˉ          ""=_     ║     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do       ║
║    \ /       _˾˾---˾_   \    ║   eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim a   ║
║    |   |  |/         \   |   ║  minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip  ║
║ ___┴__|  |' ____  ____|  |   ║     ex ea commodo consequat. Duis aute irure dolor in reprehenderit...    ║
║  '--˾__|  | (█     █ )|  |   ║                                                                           ║
║   |   ✿ | |       '  ,|  |   ║     In voluptate velit esse cillum dolore eu fugiat nulla pariatur.       ║
║   |     | |\_    -  / | |    ║                                                                           ║
║  |   |  | \ |ˉˉ'--'ˉ  | |    ║    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui      ║
║  |   |   \ ||    |    | |    ║                officia deserunt mollit anim id est laborum.               ║
║  \  |   / \\      ˭'--//     ║                                                                           ║
║   ',_ /                 \    ║                                                                           ║
╠═════╧════════════════════╧═══╣                                                                           ║
║        TimidestVampire       ║                                                                           ║
╚══════════════════════════════╩═══════════════════════════════════════════════════════════════════════════╝

Seriously?
╔══════════════════════════════╦═══════════════════════════════════════════════════════════════════════════╗
║     ___   _,----˾___         ║                                                                           ║
║    /   ˉ˞ˉ          ""=_     ║     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do       ║
║    \ /       _˾˾---˾_   \    ║   eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim a   ║
║    |   |  |/         \   |   ║  minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip  ║
║ ___┴__|  |' ____  ؄|  |   ║     ex ea commodo consequat. Duis aute irure dolor in reprehenderit...    ║
║  '--˾__|  | (█     █ )|  |   ║                                                                           ║
║   |   ✿ | |       '  ,|  |   ║     In voluptate velit esse cillum dolore eu fugiat nulla pariatur.       ║
║   |     | |\_    -  / | |    ║                                                                           ║
║  |   |  | \ |ˉˉ'--'ˉ  | |    ║    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui      ║
║  |   |   \ ||    |    | |    ║                officia deserunt mollit anim id est laborum.               ║
║  \  |   / \\      ˭'--//     ║                                                                           ║
║   ',_ /                 \    ║                                                                           ║
╠═════╧════════════════════╧═══╣                                                                           ║
║        TimidestVampire       ║                                                                           ║
╚══════════════════════════════╩═══════════════════════════════════════════════════════════════════════════╝

Baby sized
╔═════════════════════╦═══════════════════════════════════════════════════════╗     
║     ,--_,------.    ║                                                       ║
║    ,'   _,----. \   ║                                                       ║
║ ___|_ |/ __  __| |  ║                                                       ║
║  '---||  (█   █| |  ║                                                       ║
║   |  ||\    _' | |  ║                                                       ║
║   | /|||,' -┰' ||   ║                                                       ║
║   \/ \|      ''|/   ║                                                       ║
╠════╧════════════╧═══╣                                                       ║
║   TimidestVampire   ║                                                       ║
╚═════════════════════╩═══════════════════════════════════════════════════════╝
*/