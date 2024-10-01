'use client'

import { useState, useEffect, useRef } from 'react';
import { WindowInstance } from './applications/window/windowmanager';
import Desktop from './desktop/desktop';
import BootScreen from './bootscreen';
import TaskBar from './desktop/taskbar';
import EffectWrapper from './effects/effect';

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

export default function Page() {
  return (
    <EffectWrapper>
      <Home />
    </EffectWrapper>
  );
}