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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(false);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     return await fetch("/api/test", {
  //       method: "GET"
  //     });
  //   };
  //   fetchData();
  // }, [])
  
  var stupid
  if (!user) {
    return (
      <LoginPage />
    );
  }

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