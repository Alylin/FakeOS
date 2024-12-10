import ReactDOM from 'react-dom';
import { useEffect, useRef, ReactNode, RefObject } from 'react';
import { Position } from '../utility/position';

export default function Dropdown({ 
   isOpen,
   onClose,
   targetElement,
   children,
   isAbove,
   position
}: { 
   isOpen: boolean, 
   onClose: () => void, 
   targetElement: RefObject<Element>, 
   children: ReactNode,
   isAbove?: boolean,
   position?: Position | undefined
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = function(event: MouseEvent) {
      if (!isOpen) {
        return;
      }
      const target = event.target;
      if (target instanceof Element && !dropdownRef.current?.contains(target) && !targetElement.current?.contains(target) ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
   }, [isOpen, onClose, targetElement]);

   if (!isOpen) {
      return null;
   }

  const buttonRect = targetElement.current?.getBoundingClientRect();

  const styles: {
    position: 'absolute', 
    left: number | 'auto', 
    top?: number | 'auto',
    bottom?: number | 'auto'
  } = {
    position: 'absolute',
    left: buttonRect?.left || 'auto',
  };


  if (position) {
    styles.left = position.x
    styles.top = position.y
  }
  else {
    if (isAbove) {
      styles.bottom = buttonRect?.height || 'auto';
    }
    else {
      styles.top = buttonRect?.bottom || 'auto';
    }
  }

  return ReactDOM.createPortal(
      <div
         className="dropdown z-10"
         ref={dropdownRef}
         style={styles}
      >
         {children}
      </div>,
      document.body
  );
};