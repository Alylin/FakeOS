import { useEffect, useState, ReactNode } from "react";
import randomIntFromInterval from "../utility/random";

function generateFilter(amount: number) {
  return (
    `brightness(79%) url('data:image/svg+xml, <svg xmlns="http://www.w3.org/2000/svg"> <filter id="idk"> <feColorMatrix in="SourceGraphic" type="matrix" result="red" values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" ></feColorMatrix> <feColorMatrix in="SourceGraphic" type="matrix" result="blue" values="0 0 0 0 0 0 0 0 0 2 0 0 0 0 1 0 0 0 1 0" ></feColorMatrix> <feBlend mode="multiply" in="SourceGraphic" in2="red" result="shadedRed"></feBlend>  <feBlend mode="multiply" in="SourceGraphic" in2="blue" result="shadedBlue"></feBlend>  <feOffset in="shadedBlue" result="blueOffset" dx="${amount}" dy="0"></feOffset> <feOffset in="shadedRed" result="redOffset" dx="-${amount}" dy="-0"></feOffset> <feBlend mode="screen" in="SourceGraphic" in2="redOffset" result="final"></feBlend>  <feBlend mode="screen" in="final" in2="blueOffset" result="final2"></feBlend>  <feMerge> <feMergeNode in="comp"></feMergeNode> </feMerge> </filter> </svg>#idk')`
  );
}

const glitchAnimationFrames: { 
  duration: number, 
  filter: string, 
  onStart?: () => void 
}[] = [
  {
    duration: randomIntFromInterval(100000, 19970131),
    filter: ''
  },
  {
    duration: 100,
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
];

function getNextAnimationFrameId(
  animationFrames: {duration: number, onStart?: () => void}[],
  currentAnimationFrameId: number,
  isLooping: boolean
) {
  if (isLooping) {
    return (currentAnimationFrameId + 1) % animationFrames.length;
  }
  if (currentAnimationFrameId < animationFrames.length-1) {
    return currentAnimationFrameId + 1;
  }
  return -1;
}

export function useAnimationFrames(
  animationFrames: {duration: number, onStart?: () => void}[],
  isLooping: boolean
): number {
  const [animationFrameId, setAnimationFrameId] = useState(0);
  useEffect(() => {
    if (animationFrames.length === 0) {
      return;
    }
    const animationFrame = animationFrames[animationFrameId];
    if (!animationFrame) {

      return;
    }
    setTimeout(() => {
      const nextAnimationFrameId = getNextAnimationFrameId(animationFrames, animationFrameId, isLooping);
      if (nextAnimationFrameId >= 0) {
        const nextAnimationFrame = animationFrames[animationFrameId];
        nextAnimationFrame.onStart?.()
      }
      setAnimationFrameId(nextAnimationFrameId);
    }, animationFrame.duration);
  }, [animationFrameId, animationFrames]);

  useEffect(() => {
    setAnimationFrameId(0);
  }, [animationFrames])
  return animationFrameId;  
}

export default function GlitchWrapper({
  children
}: {
  children: ReactNode
}) {
  
  // filter = filter.replace(/(\r\n|\n|\r)/gm, "");


  const frameID = useAnimationFrames(glitchAnimationFrames, true);
  return (
    <div
      style={{
        filter: glitchAnimationFrames[frameID].filter
      }}
    >
      {children}
    </div>
  );
}