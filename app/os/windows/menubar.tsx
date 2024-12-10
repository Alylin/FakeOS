import { addGlobalListener } from "@/app/utility/globallistener";
import { useEffect, useRef, useState } from "react";
import Dropdown from "../../reusableui/dropdown";

type MenuItem = { 
  title: string, 
  shortcut: string, 
  onClick?: () => void,
  isEnabled?: () => boolean
};

type Menu = { 
  title: string, 
  menuItems: MenuItem[]
}

function MenuItem({ 
  title, 
  shortcut, 
  onClick,
  isEnabled
}: { 
  title: string, 
  shortcut: string,
  onClick?: () => void,
  isEnabled?: () => boolean
}) {
   return (
      <button 
         className="text-left pl-10 flex pr-6 w-full hover:bg-green-200"
         onClick={() => {
            onClick?.();
         }}
      >
         <div className="flex-1">
            {title}
         </div>
         <div>
            {shortcut}
         </div>
      </button> 
   );
}

function Menu({ text, menuItems }: { text: string, menuItems: MenuItem[]}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // const teardownFunctions = menuItems.map(({shortcut, onClick}) => {
    //   return addGlobalListener(
    //     'keydown',
    //     (keyEvent: KeyboardEvent) => {
    //       const hotkeyParts = shortcut.split('+');
    //       const ctrl = hotkeyParts[0] === 'Ctrl';
    //       const shift = hotkeyParts[1] === 'Shift';
    //       const letter = hotkeyParts[hotkeyParts.length-1];
    //       if (
    //         (!ctrl  || keyEvent.ctrlKey) &&
    //         (!shift || keyEvent.shiftKey) &&
    //         (!letter || keyEvent.key === letter.toLocaleLowerCase())
    //       ) {
    //         onClick?.()
    //       }
    //     }
    //   );
    // }, [menuItems]);
    // return () => {
    //   teardownFunctions.forEach((teardown) => {
    //     teardown();
    //   });
    // }
  }, []);

  return (
    <>
      <button 
         className={`px-2 ${isOpen ? 'outline-[#91c9f7] outline-1 outline bg-[#546656]' : 'hover:outline-1 hover:outline hover:outline-[#CCE8FF] hover:bg-[#546656]'}`}
         ref={buttonRef}
         onClick={() => {
            setIsOpen(!isOpen);
         }}
      >
        {text}
      </button>
      <Dropdown 
         isOpen={isOpen}
         onClose={() => {
            setIsOpen(false);
         }} 
         targetElement={buttonRef} 
      >
         <div className="bg-[#F2F2F2] text-[13px] w-60 outline outline-2 outline-[#D9D9D9] shadow-powerful p-0.5">
            {menuItems.map((menuItem) => 
               <MenuItem 
                  title={menuItem.title} 
                  shortcut={menuItem.shortcut} 
                  key={menuItem.title} 
                  onClick={menuItem.onClick} 
                  isEnabled={menuItem.isEnabled}
               />
            )}
        </div>
      </Dropdown>
    </>
  );
}

export default function MenuBar({menus}: {menus: Menu[]}) {
   return (
      <div className="flex">
         {menus.map((menu) => <Menu text={menu.title} menuItems={menu.menuItems} key={menu.title} />)}
      </div>
   );
}