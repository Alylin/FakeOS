import { useEffect, useState, ReactNode } from "react";

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

function useAnimationFrames(): number {
  const [animationFrameId, setAnimationFrameId] = useState(0);
  useEffect(() => {
    const animationFrame = animationFrames[animationFrameId];
    setTimeout(() => {
      animationFrame.onStart?.();
      setAnimationFrameId((animationFrameId + 1) % animationFrames.length);
    }, animationFrame.duration > 0 ? animationFrame.duration : randomIntFromInterval(100000, 19970131));
  }, [animationFrameId]);
  return animationFrameId;  
}

export default function EffectWrapper({
  children
}: {
  children: ReactNode
}) {
  const frameID = useAnimationFrames();
  return (
    <div
      style={{
        filter: animationFrames[frameID].filter
      }}
    >
      {children}
    </div>
  );
}