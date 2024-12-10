import { AiOutlineClose, AiOutlineLine } from 'react-icons/ai';
import { ReactElement, ReactNode } from 'react';

export default function TopBar({
    title,
    topBarAddon,
    isFullScreen,
    onFullScreen,
    onClose,
    icon,
    onMinimize
}: {
    title: string,
    topBarAddon?: ReactNode,
    isFullScreen: boolean,
    onMinimize: () => void,
    onFullScreen: () => void,
    onClose: () => void,
    icon: ReactElement
}) {
    return (
        <div className="text-white from-windowHighlight bg-gradient-to-b to-windowPrimary to-15%">
            <div 
              className="h-8 flex items-center"
            >
                <div 
                  className="w-7 h-7 m-1 p-1 mr-0"
                  id="movingHandle"
                >
                    {icon}
                </div>
                <div 
                  className="p-1 select-none overflow-ellipsis text-nowrap h-full"
                  id="movingHandle"
                >
                    {title}
                </div>
                <div
                    className="flex-1 h-full"
                    id="movingHandle"
                />
                <button 
                    className="w-[51px] h-full flex items-center justify-center text-center hover:bg-[#546656] transition-colors"
                    onClick={onMinimize}
                >
                    <AiOutlineLine />
                </button>
                <button
                    className="w-[51px] h-full flex items-center justify-center text-center hover:bg-[#546656] transition-colors"
                    onClick={onFullScreen}
                >
                  {isFullScreen ? 
                    <span className="w-5 h-5 bg-[url('/icons/unfullscreen.svg')]" />
                    :
                    <span className="w-5 h-5 bg-[url('/icons/fullscreen.svg')]" />
                  }
                </button>
                <button
                    className="w-[51px] h-full flex items-center justify-center hover:text-white hover:bg-[#E81123] transition-colors"
                    onClick={() => {
                        onClose();
                    }}
                >
                    <AiOutlineClose />
                </button>
            </div>
            {topBarAddon}
        </div>
    );
}
