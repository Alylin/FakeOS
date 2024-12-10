import { useEffect, useState } from "react";
import { useAnimationFrames } from "./effects/effect"

function getBarSegments(percentage: number): React.JSX.Element[] {
    const barSegments = [];
    for(let i = 0; i < 60; i++) {
        barSegments.push(
            <div key={`${i}`} className={`h-4 w-0.5 flex-1 ${percentage >= (i / 60) ? 'text-white' : 'text-black'}`}>
                |
            </div>
        );
    }
    return barSegments;
}

function LoadingBar({percentage}: { percentage: number }) {
  const barSegments = getBarSegments(percentage);
  return (
    <div className="text-white text-center">
      <div className="-mb-2">
        _________________________
      </div>
      <div className="flex flex-row justify-between w-56 text-white">
        ({barSegments})
      </div>
      <div className="h-2 -mt-5">
        _________________________
      </div>
    </div>
  );
}


function playClickSound() {
  const audio = new Audio('click.wav');
  audio.volume = 1;  
  const play = audio.play();
  play.catch(() => {
      // no-op, dies silently
  })
}

const welcomeMessageTyping: { 
  duration: number, 
  text: string, 
  onStart?: () => void 
}[] = [
  {
    duration: 100,
    text: 'W',
    onStart: () => {
      playClickSound();
      const bootSong = new Audio('bootsong.wav');
      bootSong.volume = 0.3;
      const play = bootSong.play();
      play.catch(() => {
          // no-op, dies silently
      });
    }
  },
  {
    duration: 60,
    text: 'We',
    onStart: playClickSound
  },
  {
    duration: 110,
    text: 'Wel',
    onStart: playClickSound
  },
  {
    duration: 80,
    text: 'Welc',
    onStart: playClickSound
  },
  {
    duration: 80,
    text: 'Welc',
    onStart: playClickSound
  },
  {
    duration: 100,
    text: 'Welco',
    onStart: playClickSound
  },
  {
    duration: 100,
    text: 'Welcom',
    onStart: playClickSound
  },
  {
    duration: 50,
    text: 'Welcome',
    onStart: playClickSound
  },
  {
    duration: 400,
    text: 'Welcome!',
    onStart: playClickSound
  }
]


function WelcomeMessage() {
  const animationFrameID = useAnimationFrames(welcomeMessageTyping, false);
  return (
    <div className="absolute font-mono left-0 space-x-1 flex w-56 overflow-hidden items-center justify-center text-white">
      {welcomeMessageTyping[animationFrameID]?.text || 'Welcome!'}
    </div>
  );
}

const increasePercentage = (percentageLoaded: number, setPercentageLoaded: (percentage: number) => void) => {
  const timeout = percentageLoaded < 0.5 ? Math.random() * 20 + 1 : Math.random() * 100 + 10;
  if (percentageLoaded < 1) {
    setTimeout(() => {
      setPercentageLoaded(percentageLoaded+0.01);
    }, timeout); 
  }
};

export default function BootScreen({onComplete}: { onComplete: () => void }) {
    const [percentageLoaded, setPercentageLoaded] = useState(0);
    useEffect(() => {
      increasePercentage(percentageLoaded, setPercentageLoaded);
      if (percentageLoaded >= 1) {
        setTimeout(() => {
          onComplete();
        }, 3000);
      }
    }, [percentageLoaded]);
    return (
        <div className="w-screen h-screen bg-black flex justify-center items-center flex-col select-none">
            <div className="h-1/2 flex items-center flex-col">
              <div className="pt-10 h-60 text-center font-extralight leading-5 text-white whitespace-pre-wrap font-mono">
                {`
              ______ __"         
          _-" ,,--.. ""-_-"       
        /   /█▓    \\    "-_"'   
       (   |       |   _-"      
        "--_\\_____--"""          
                        
        
Watchers Browser OS
                  `}
              </div>
                {/* <div className="w-64 h-64 bg-[url('/octologo.png')] bg-contain bg-no-repeat bg-center animate-fadeIn mb-3" /> */}
                <div className="h-8 relative w-56">
                    {percentageLoaded >= 1 && <WelcomeMessage />}
                    {percentageLoaded < 1 && <LoadingBar percentage={percentageLoaded} />}
                </div>
                <div className="absolute right-0 bottom-0 p-3 text-white text-right font-mono">
                    <div>Version 0.0.52</div>
                    <div>Build 12</div>
                </div>
            </div>
        </div>
    );
}