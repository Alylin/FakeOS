import Dropdown from "@/app/reusableui/dropdown";
import { Position } from "@/app/utility/position";
import { RefObject, useEffect, useRef, useState } from "react";

function MenuItem({
  displayName,
  hotkey,
  isSelected,
  select,
  onClick
}: {
  displayName: string,
  hotkey: string,
  isSelected: boolean,
  select: () => void,
  onClick: () => void
}) {
  const menuItem = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (isSelected && menuItem.current) {
      menuItem.current.focus();
    }
  }, [isSelected]);

  return (
    <button 
      onMouseEnter={() => {
        select();
      }}
      ref={menuItem}
      onClick={onClick}
      className={`border-b border-black border-dotted max-w-full px-1 text-left flex ${isSelected && 'bg-emerald-50'} last:border-b-0`}
    >
      <span className="flex-1 mr-16">
        {displayName}
      </span>
      <span className="text-neutral-400 font-mono">
        {hotkey}
      </span>
    </button>
  );
}

export function RightClickMenu(
  {
    isOpen,
    setIsOpen,
    buttonRef,
    position,
    menuItems
  }:
  {
    isOpen: boolean, 
    setIsOpen: (isOpen: boolean) => void, 
    buttonRef: RefObject<Element>,
    position: Position | undefined,
    menuItems: {
      displayName: string,
      hotkey: string,
      onClick: () => void
    }[]
  }
)
{
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
          if (selectedEntry === null || selectedEntry === 0) {
            setSelectedEntry(menuItems.length-1);
          }
          else {
            setSelectedEntry(selectedEntry-1);
          }
          event.preventDefault();
          break;
        case 'ArrowDown':
          if (selectedEntry === null) {
            setSelectedEntry(0);
          }
          else {
            setSelectedEntry((selectedEntry+1) % menuItems.length);
          }
          event.preventDefault();
          break;
        default:
          // Nothing happens
          break;
      }
    };
    document.body.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.removeEventListener('keydown', onKeyDown);
    }
  }, [selectedEntry]);

  return (
    <Dropdown
     isOpen={isOpen}
     onClose={() => {
      setIsOpen(false);
     }} 
     targetElement={buttonRef} 
     position={position}
    >
      <div className="bg-white shadow-powerful outline outline-1 text-sm outline-black min-w-20 flex flex-col">
        {
          menuItems.map((menuItem, index) => { 
            return (
              <MenuItem 
                key={menuItem.displayName}
                displayName={menuItem.displayName} 
                hotkey={menuItem.hotkey}
                isSelected={index === selectedEntry}
                onClick={() => {
                  menuItem.onClick();
                  setIsOpen(false);
                }}
                select={() => {
                  setSelectedEntry(index);
                }}
              />
            );
          })
        }
      </div>
    </Dropdown>
  );
}
