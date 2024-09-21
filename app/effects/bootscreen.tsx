import { useEffect, useState } from "react";

function getBarSegments(percentage: number): React.JSX.Element[] {
    const barSegments = [];
    for(let i = 0; i < 60; i++) {
        barSegments.push(
            <div className={`h-4 w-0.5 flex-1 ${percentage >= (i / 60) ? 'text-white' : 'text-black'}`}>
                |
            </div>
        );
    }
    return barSegments;
}

function LoadingBar({percentage}: { percentage: number }) {
    const barSegments = getBarSegments(percentage);
    return (
        <div className={`absolute flex left-0 flex-row overflow border-solid justify-between w-56 text-white ${percentage >= 1 && 'opacity-0 transition-opacity'}`}>
            {barSegments}
        </div>
    );
}

function WelcomeMessage() {
    return (
        <div className="absolute font-mono uppercase left-0 space-x-1 flex w-56 overflow-hidden items-center justify-center text-white text-xl animate-fadeIn transition-transform">
            Welcome!
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
            const audio = new Audio('bootsong.wav');
            audio.volume = 0.3;
            const play = audio.play();
            play.catch(() => {
                // no-op, dies silently
            })
            setTimeout(() => {
                onComplete();
            }, 3000); 
        }
    }, [percentageLoaded]);
    return (
        <div className="w-screen h-screen bg-black flex justify-center items-center flex-col select-none">
            <div className="h-1/2 flex items-center flex-col">
                <div className="w-64 h-64 bg-[url('/octologo.png')] bg-contain bg-no-repeat bg-center animate-fadeIn mb-3" />
                <div className="h-8 relative w-56">
                    {percentageLoaded >= 1 && <WelcomeMessage />}
                    <LoadingBar percentage={percentageLoaded} />
                </div>
                <div className="absolute right-0 bottom-0 p-3 text-white text-right font-mono">
                    <div>CephlieCo Browser OS</div>
                    <div>Version 25.343.43</div>
                    <div>Build 12</div>
                </div>
            </div>
        </div>
    );
}