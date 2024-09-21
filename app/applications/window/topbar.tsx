import { AiOutlineClose, AiOutlineLine } from 'react-icons/ai';
import { LiaSquare } from 'react-icons/lia';
import { Size } from '../generic/size';
import { Position } from '../generic/position';
import { ReactElement, ReactNode } from 'react';

export default function TopBar({
    title,
    setSize,
    setPosition,
    topBarAddon,
    desktopSize,
    onClose,
    icon,
    onMinimize
}: {
    title: string,
    setSize: (size: Size) => void,
    setPosition: (position: Position) => void,
    topBarAddon?: ReactNode,
    desktopSize: Size,
    onMinimize: () => void,
    onClose: () => void,
    icon: ReactElement
}) {
    return (
        <div className="text-white from-windowHighlight bg-gradient-to-b to-windowPrimary to-15%">
            <div className="h-8 flex">
                <div className="w-6 h-8 m-1 p-1">
                    {icon}
                </div>
                <div className="p-1 py-2">
                    {title}
                </div>
                <div
                    className="flex-1"
                    id="movingHandle"
                />
                <button 
                    className="w-[51px] flex items-center justify-center text-center hover:bg-[#546656] transition-colors"
                    onClick={onMinimize}
                >
                    <AiOutlineLine />
                </button>
                <button
                    className="w-[51px] flex items-center justify-center text-center hover:bg-[#546656] transition-colors"
                    onClick={(() => {
                        setSize({
                            width: desktopSize.width,
                            height: desktopSize.height
                        });
                        setPosition({
                            x: 0,
                            y: 0
                        });
                    })}
                >
                    <LiaSquare className="w-5 h-5" />
                </button>
                <button 
                    className="w-[51px] flex items-center justify-center hover:text-white hover:bg-[#E81123] transition-colors"
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
