import { useAnimationFrames } from "@/app/effects/effect";
import React, { useEffect, useRef, useState } from "react";
import { Size } from "../../utility/size";
import Window from "../../os/windows/window";
import { closeWindow, NewWindow, WindowInstance } from "../../os/windows/windowmanager";
import CharacterAnimator, { useCharacterAnimator } from "./animationframes";


const closedMouth = String.raw`                                                               
             _,--,___      _____---_____                            
          ,'    .,_ ,"-""'---,-__      '"--,,__            
         |       _-'             '             "'-,         
         /    \,'                      ',          \                   
         ',   /                         ,\          ',                
         / '-,                        /    ",         |              
         |  |                  _ -- '         \        \              
        |  ;             / _,'                  ',\    ',             
        |  /     ,      |/                        ||    |                   
       ,'  |     '.     | ,,--"'""'--.      ,-'""--\    ',                                    
       |,_,_____._,/    |     _,,,,__        __,,_ |     |     
       |  '--,__ .|     /   ",  ▓█   '      ' ▓█ ,/|     |      
       /    \   '||     |      "                ' ||     \
      ,'    /",  ✿|     |                 ',      ;|     |  
       |   |   "_  |     \                       | |    |
       \    |    ",|     | ,                    ;  |    |
      |    |        |    | |'-,__       ---    /   |    |
     ,'            ,\    | |     '-,__       ,'    |   /
     |        .    ||    \ /          '"---'        |  |
     |    ',   |   / |    |              |          \  |
     |     |   ',  |_/    |              ",__       |  \ 
     |     \  ,---"' | |\ |,                 ''""--,/  |
      |      '      | ,'  '_\                     ,' /|\
       ',   ,'      "/      '                    |, "  \|                               
         \ |        '                           '       ",
`;



const blink1 = String.raw`                                                               
             _,--,___      _____---_____                            
          ,'    .,_ ,"-""'---,-__      '"--,,__            
         |       _-'             '             "'-,         
         /    \,'                      ',          \                   
         ',   /                         ,\          ',                
         / '-,                        /    ",         |              
         |  |                  _ -- '         \        \              
        |  ;             / _,'                  ',\    ',             
        |  /     ,      |/                        ||    |                   
       ,'  |     '.     | ,,--"'""'--.      ,-'""--\    ',                                    
       |,_,_____._,/    |                          |     |     
       |  '--,__ .|     /   ",_.__,--'      '--__,/|     |      
       /    \   '||     |                         ||     \
      ,'    /",  ✿|     |                 ',      ;|     |  
       |   |   "_  |     \                       | |    |
       \    |    ",|     | ,                    ;  |    |
      |    |        |    | |'-,__       ---    /   |    |
     ,'            ,\    | |     '-,__       ,'    |   /
     |        .    ||    \ /          '"---'        |  |
     |    ',   |   / |    |              |          \  |
     |     |   ',  |_/    |              ",__       |  \ 
     |     \  ,---"' | |\ |,                 ''""--,/  |
      |      '      | ,'  '_\                     ,' /|\
       ',   ,'      "/      '                    |, "  \|                               
         \ |        '                           '       ",
`;


const blink2 = String.raw`                                                               
             _,--,___      _____---_____                            
          ,'    .,_ ,"-""'---,-__      '"--,,__            
         |       _-'             '             "'-,         
         /    \,'                      ',          \                   
         ',   /                         ,\          ',                
         / '-,                        /    ",         |              
         |  |                  _ -- '         \        \              
        |  ;             / _,'                  ',\    ',             
        |  /     ,      |/                        ||    |                   
       ,'  |     '.     | ,,--"'""'--.      ,-'""--\    ',                                    
       |,_,_____._,/    |     ______          ____ |     |     
       |  '--,__ .|     /   ",  ▓█  "'      '"▓█ ,/|     |      
       /    \   '||     |                         ||     \
      ,'    /",  ✿|     |                 ',      ;|     |  
       |   |   "_  |     \                       | |    |
       \    |    ",|     | ,                    ;  |    |
      |    |        |    | |'-,__       ---    /   |    |
     ,'            ,\    | |     '-,__       ,'    |   /
     |        .    ||    \ /          '"---'        |  |
     |    ',   |   / |    |              |          \  |
     |     |   ',  |_/    |              ",__       |  \ 
     |     \  ,---"' | |\ |,                 ''""--,/  |
      |      '      | ,'  '_\                     ,' /|\
       ',   ,'      "/      '                    |, "  \|                               
         \ |        '                           '       ",
`;

const openMouth = String.raw`                                                               
             _,--,___      _____---_____                            
          ,'    .,_ ,"-""'---,-__      '"--,,__            
         |       _-'             '             "'-,         
         /    \,'                      ',          \                 
         ',   /                         ,\          ',                                                                                                                                                                                        
         / '-,                        /    ",         |                                                                                                                                                                                           
         |  |                  _ -- '         \        \                                                                                                                                                                                    
        |  ;             / _,'                  ',\    ',                                                                        
        |  /     ,      |/                        ||    |                             
       ,'  |     '.     | ,,--"'""'--.      ,-'""--\    ',                                                                                
       |,_,_____._,/    |     _,,,,__        __,,_ |     |     
       |  '--,__ .|     /   ",  ▓█   '      ' ▓█ ,/|     |      
       /    \   '||     |      "                ' ||     \
      ,'    /",  ✿|     |                 ',      ;|     |  
       |   |   "_  |     \                       / |    |
       \    |    ",|     | ,                    '  |    |
      |    |        |    | |'-,_       ▒▒▒░    |   |    |
     ,'            ,\    | |    '',__         /    |   /
     |        .    ||    \ /         '--..,--'      |  |
     |    ',   |   / |    |              |          \  |
     |     |   ',  |_/    |              ",__       |  \ 
     |     \  ,---"' | |\ |,                 ''""--,/  |
      |      '      | ,'  '_\                     ,' /|\
       ',   ,'      "/      '                    |, "  \|                               
         \ |        '                           '       ",
`;

const barelyOpenMouth = String.raw`              
             _,--,___      _____---_____                            
          ,'    .,_ ,"-""'---,-__      '"--,,__            
         |       _-'             '             "'-,         
         /    \,'                      ',          \                                                                                                                                                                                                                                                              
         ',   /                         ,\          ',                                                                                                                                                                                        
         / '-,                        /    ",         |                                                                                                                                                                                           
         |  |                  _ -- '         \        \                                                                                                                                                                                    
        |  ;             / _,'                  ',\    ',                                                                        
        |  /     ,      |/                        ||    |                             
       ,'  |     '.     | ,,--"'""'--.      ,-'""--\    ',                                                                                
       |,_,_____._,/    |     _,,,,__        __,,_ |     |     
       |  '--,__ .|     /   ",  ▓█   '      ' ▓█ ,/|     |      
       /    \   '||     |      "                ' ||     \
      ,'    /",  ✿|     |                 ',      ;|     |  
       |   |   "_  |     \                       | |    |
       \    |    ",|     | ,                    ;  |    |
      |    |        |    | |'-,__        ▒▒    /   |    |
     ,'            ,\    | |     '-,_        _'    |   /
     |        .    ||    \ /         ''"---'        |  |
     |    ',   |   / |    |              |          \  |
     |     |   ',  |_/    |              ",__       |  \ 
     |     \  ,---"' | |\ |,                 ''""--,/  |
      |      '      | ,'  '_\                     ,' /|\
       ',   ,'      "/      '                    |, "  \|                               
         \ |        '                           '       ",
`;

export default function AnimationTest(
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
  const [spokenText, setSpokenText] = useState('');
  const [frameId, currentFrame] = useCharacterAnimator();
  useEffect(() => {
    const whatever = new CharacterAnimator(
      new AudioContext({
          latencyHint: "interactive"
      })
    );
  }, []);


  useEffect(() => {
    const text = currentFrame.text;
    if (frameId === 0) {
      setSpokenText(text || '');
    }
    else if (text) {
      setSpokenText(spokenText+' '+text);
    }
  }, [frameId])

  return (
    <Window
        title="Animation Test" 
        desktopSize={desktopSize}
        setWindows={setWindows}
        windows={windows}
        windowID={windowID}
        icon={
          <div 
              className={`h-5 w-5 bg-contain`} 
              style={{
                  'backgroundImage': `url("/icons/audioplayer.svg")`
              }}
          />
        }
        isCollapsed={isCollapsed}
        minWidth={800}
        minHeight={800}
    >
      <div className="p-1 px-3 h-full bg-black overflow-hidden font-extralight leading-5 text-nowrap text-white whitespace-pre-wrap font-mono">
        {
          currentFrame.asciiArt
        }
        {
          spokenText
        }
      </div>
    </Window>
  );
}


export function getAnimationTest(): NewWindow {
  return {
    applicationID: 'animatonTest', 
    windowDisplayName: 'Animation Test',
    icon: "bg-[url('/icons/audioplayer.svg')]",
    render: (
      currentDesktopSize: Size, 
      setWindows: (windows: WindowInstance[]) => void, 
      windows: WindowInstance[], 
      windowID: string, 
      isCollapsed: boolean
    ) => {
      return (
        <AnimationTest
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