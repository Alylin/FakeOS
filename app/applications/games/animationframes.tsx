import { useAnimationFrames } from '@/app/effects/effect';
import { useEffect, useState } from 'react';
import randomIntFromInterval from '../../utility/random';




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
     |    ',   |   / |    |           ,  |          \  |
     |     |   ',  |_/    |              ",__       |  \ 
     |     \  ,---"' | |\ |,                 ''""--,/  |
      |      '      | ,'  '_\                     ,' /|\
       ',   ,'      "/      '                    |, "  \|                               
         \ |        '                           '       ",
`;

const closedMouthBlink1 = String.raw`                                                           
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
     |    ',   |   / |    |           ,  |          \  |
     |     |   ',  |_/    |              ",__       |  \ 
     |     \  ,---"' | |\ |,                 ''""--,/  |
      |      '      | ,'  '_\                     ,' /|\
       ',   ,'      "/      '                    |, "  \|                               
         \ |        '                           '       ",
`;
const closedMouthBlink2 = String.raw`                                                               
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
     |    ',   |   / |    |           ,  |          \  |
     |     |   ',  |_/    |              ",__       |  \ 
     |     \  ,---"' | |\ |,                 ''""--,/  |
      |      '      | ,'  '_\                     ,' /|\
       ',   ,'      "/      '                    |, "  \|                               
         \ |        '                           '       ",
`;

/////////////////////////////////////////

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
     |    ',   |   / |    |           ,  |          \  |
     |     |   ',  |_/    |              ",__       |  \ 
     |     \  ,---"' | |\ |,                 ''""--,/  |
      |      '      | ,'  '_\                     ,' /|\
       ',   ,'      "/      '                    |, "  \|                               
         \ |        '                           '       ",
`;
const openMouthBlink1 = String.raw`                                                               
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
       |   |   "_  |     \                       / |    |
       \    |    ",|     | ,                    '  |    |
      |    |        |    | |'-,_       ▒▒▒░    |   |    |
     ,'            ,\    | |    '',__         /    |   /
     |        .    ||    \ /         '--..,--'      |  |
     |    ',   |   / |    |           ,  |          \  |
     |     |   ',  |_/    |              ",__       |  \ 
     |     \  ,---"' | |\ |,                 ''""--,/  |
      |      '      | ,'  '_\                     ,' /|\
       ',   ,'      "/      '                    |, "  \|                               
         \ |        '                           '       ",
`;
const openMouthBlink2 = String.raw`                                                               
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
       |   |   "_  |     \                       / |    |
       \    |    ",|     | ,                    '  |    |
      |    |        |    | |'-,_       ▒▒▒░    |   |    |
     ,'            ,\    | |    '',__         /    |   /
     |        .    ||    \ /         '--..,--'      |  |
     |    ',   |   / |    |           ,  |          \  |
     |     |   ',  |_/    |              ",__       |  \ 
     |     \  ,---"' | |\ |,                 ''""--,/  |
      |      '      | ,'  '_\                     ,' /|\
       ',   ,'      "/      '                    |, "  \|                               
         \ |        '                           '       ",
`;

/////////////////////////////////////////

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
     |    ',   |   / |    |           ,  |          \  |
     |     |   ',  |_/    |              ",__       |  \ 
     |     \  ,---"' | |\ |,                 ''""--,/  |
      |      '      | ,'  '_\                     ,' /|\
       ',   ,'      "/      '                    |, "  \|                               
         \ |        '                           '       ",
`;
const barelyOpenMouthBlink1 = String.raw`              
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
      |    |        |    | |'-,__        ▒▒    /   |    |
     ,'            ,\    | |     '-,_        _'    |   /
     |        .    ||    \ /         ''"---'        |  |
     |    ',   |   / |    |           ,  |          \  |
     |     |   ',  |_/    |              ",__       |  \ 
     |     \  ,---"' | |\ |,                 ''""--,/  |
      |      '      | ,'  '_\                     ,' /|\
       ',   ,'      "/      '                    |, "  \|                               
         \ |        '                           '       ",
`;
const barelyOpenMouthBlink2 = String.raw`              
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
      |    |        |    | |'-,__        ▒▒    /   |    |
     ,'            ,\    | |     '-,_        _'    |   /
     |        .    ||    \ /         ''"---'        |  |
     |    ',   |   / |    |           ,  |          \  |
     |     |   ',  |_/    |              ",__       |  \ 
     |     \  ,---"' | |\ |,                 ''""--,/  |
      |      '      | ,'  '_\                     ,' /|\
       ',   ,'      "/      '                    |, "  \|                               
         \ |        '                           '       ",
`;

// duration is in milliseconds
async function generateTone(context: AudioContext, duration: number, pitch: number, volume: number, isIncreasing = true) {
  const durationInSeconds = duration / 1000;
  var oscillatorNode = new OscillatorNode(context, {
    type: 'sine'
  });

  const amp = new GainNode(context, {
    gain: volume
  });

  await context.resume();
  const delayVolume = new GainNode(context, {
    gain: 0.05
  });
  const delayAmount = new DelayNode(context, {
    delayTime: 0.2
  });

  oscillatorNode.frequency.cancelScheduledValues(context.currentTime);
  oscillatorNode.frequency.setValueAtTime(pitch, context.currentTime);
  oscillatorNode.frequency.linearRampToValueAtTime(pitch + (isIncreasing ? 100 : -100), context.currentTime + durationInSeconds);

  amp.gain.setValueAtTime(volume, context.currentTime + durationInSeconds - 0.05);
  amp.gain.exponentialRampToValueAtTime(0.01, context.currentTime + durationInSeconds);

  oscillatorNode.connect(amp).connect(context.destination);
  amp.connect(delayAmount).connect(delayVolume).connect(amp);
  oscillatorNode.start(context.currentTime);
  oscillatorNode.stop(context.currentTime + durationInSeconds);
}

type animationFrame = { 
  duration: number, 
  asciiArt: string,
  text?: string, 
  onStart?: () => void
};

type wordOptions = {
  isUpTone?: boolean
  exclamation?: boolean
}

function generateSyllableFrames(
  audioContext: AudioContext, 
  word: string, 
  blink: boolean, 
  options: wordOptions
) {
  const length = randomIntFromInterval(90, 140, word);
  const playTone = () => {
    generateTone(
      audioContext, 
      length, 
      options.exclamation ? randomIntFromInterval(700, 820, word) : randomIntFromInterval(400, 620, word), 
      options.exclamation ? 0.4 : 0.2, 
      options.isUpTone
    );
  };
  if (blink) {
    return [
      {
        duration: length/2,
        asciiArt: options.isUpTone ? openMouthBlink1 : barelyOpenMouthBlink1,
        onStart: () => {
          playTone();
        }
      },
      {
        duration: length/2,
        asciiArt: options.isUpTone ? openMouthBlink2 : barelyOpenMouthBlink2,
      }
    ];
  }
  return [{
    duration: length,
    asciiArt: options.isUpTone ? openMouth : barelyOpenMouth,
    onStart: () => {
      playTone();
    }
  }];
}

const wordFrameSequence = [
  (audioContext: AudioContext, word: string, blink: boolean, options?: wordOptions) => {
    return generateSyllableFrames(audioContext, word, blink, {
      isUpTone: true,
      ...options
    })
  },
  (audioContext: AudioContext, word: string, blink: boolean, options?: wordOptions) => {
    return generateSyllableFrames(audioContext, word, blink, {
      isUpTone: false,
      ...options
    })
  }
];

function getSyllableCount(word: String) {
  if (word.length <= 4) {
    return 1;
  }
  else if (word.length <= 8) {
    return 2;
  }
  else {
    return 3;
  }
}

export default class CharacterAnimator {
  timeSinceLastBlink: number;
  audioContext: AudioContext;
  
  constructor(audioContext: AudioContext) {
    this.timeSinceLastBlink = 0;
    this.audioContext = audioContext;
  }

  getWordAnimation(
    syllableCount: number,
    word: string,
    unprocessedWord: string,
    options?: wordOptions
  ) {
    if (syllableCount < 1) {
      throw new Error('syllable count must be at least 1');
    }
    const firstFrameId = randomIntFromInterval(0, 1, word)
    console.log(firstFrameId);
    let frames: animationFrame[] = [];
    for (let i = 0; i < syllableCount; i++) {
      const frameId = (i + firstFrameId) % wordFrameSequence.length;
      let blink = false;
      if (this.timeSinceLastBlink > 1000) {
        blink = true;
        this.timeSinceLastBlink = 0;
      }
      const syllableFrames = wordFrameSequence[frameId](this.audioContext, word, blink, options);
      this.timeSinceLastBlink += syllableFrames[0].duration;
      frames = frames.concat(syllableFrames);
    }
    frames[0].text = unprocessedWord;

    return frames
  }

  textToAnimation(dialogueText: string) {
    const parsedWords = dialogueText.split(' ');
    let frames: animationFrame[] = [];
    if (!parsedWords.length) {
      return [];
    }
  
    frames.push({
      duration: randomIntFromInterval(70, 100),
      asciiArt: closedMouth
    });
    parsedWords.forEach((unprocessedWord) => {
      const word = unprocessedWord?.replaceAll(/[^a-zA-Z]/g, '').toLowerCase();
      const syllableCount = getSyllableCount(word);
      const options: wordOptions = {

      }
      
      if (unprocessedWord.endsWith('!')) {
        options.exclamation = true;
      }
      frames = frames.concat(this.getWordAnimation(
        syllableCount,
        word,
        unprocessedWord,
        options
      ));
      frames.push({
        duration: randomIntFromInterval(70, 100),
        asciiArt: closedMouth
      });
    });

    frames.push({
      duration: 2500,
      asciiArt: closedMouth
    });
    return frames;
  }
}

function useIdk(): [(text: string) => void, () => void, number, animationFrame, CharacterAnimator | undefined] {
  const [characterAnimator, setCharacterAnimator] = useState<CharacterAnimator>();
  const [currentAnimation, setCurrentAnimation] = useState<animationFrame[]>([]);

  const animationFrameId = useAnimationFrames(currentAnimation, false);
  useEffect(() => {
    setCharacterAnimator(new CharacterAnimator(new AudioContext({
      latencyHint: 'interactive'
    })));
  }, []);

  useEffect(() => {
    if (animationFrameId < 0) {
      setCurrentAnimation([{
        duration: 10, 
        asciiArt: closedMouth
      }]);
    }
  }, [animationFrameId]);

  return [
    (text: string) => {
      if (!characterAnimator) {
        throw new Error('Called animation before setup completed.');
      }
      setCurrentAnimation(characterAnimator.textToAnimation(text))
    },
    () => {
      setCurrentAnimation([
        {
          duration: 50,
          asciiArt: closedMouthBlink1
        },
        {
          duration: 50,
          asciiArt: closedMouthBlink2
        }
      ]);
    },
    animationFrameId,
    currentAnimation[animationFrameId] || {
      duration: 100,
      asciiArt: closedMouth
    },
    characterAnimator
  ];
}

export function useCharacterAnimator(): [number, animationFrame] {
  const [textAnimation, blinkAnimation, animationFrameId, currentFrame, characterAnimator] = useIdk();
  const [blink, setBlinkCount] = useState(0);

  useEffect(() => {
    if (characterAnimator) {
      textAnimation("Hello! This is a test of what I can say and how it looks and sounds.");
      // setTimeout(() => {
      //   blinkAnimation();
      //   setBlinkCount(blink+1);
      // }, randomIntFromInterval(6000, 9000)); 
    }
  }, [blink, characterAnimator]);

  return [
    animationFrameId,
    currentFrame
  ]
}