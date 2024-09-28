import { useRef, useState } from "react";
import Dropdown from "../generic/dropdown";
import { NotepadFileDataEntry, NotepadFileData } from './notepad';

function download(filename = 'export.txt', text: string) {
   var element = document.createElement('a');
   element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
   element.setAttribute('download', filename);
 
   element.style.display = 'none';
   document.body.appendChild(element);
 
   element.click();
 
   document.body.removeChild(element);
}

const newLineChar = '\n';
const tabChar = '\t';

function printToTxt(notepadFileData: NotepadFileData) {
   let text = '';
   notepadFileData.forEach((notepadFileDataEntry) => {
      text = printToTxtChild(notepadFileDataEntry, 0, text);
   });
   return text;
}

function printToTxtChild(notepadFileDataEntry: NotepadFileDataEntry, depth: number, text: string) {
   for (let i = 0; i < depth; i++) {
      text = text + tabChar;
   }
   text = text + notepadFileDataEntry.displayName; 
   text = text + newLineChar;
   notepadFileDataEntry.children.forEach((notepadFileDataEntry: NotepadFileDataEntry) => {
      text = printToTxtChild(notepadFileDataEntry, depth+1, text);
   });
   return text;
}

const menus = [
   {
      title: 'File',
      menuItems: [
         {
            title: 'New',
            shortcut: 'Ctrl+N'
         },
         {
            title: 'Open',
            shortcut: 'Ctrl+O'
         },
         {
            title: 'Save',
            shortcut: 'Ctrl+S',
            onClick: (notepadFileData: NotepadFileData) => {
               const text = printToTxt(notepadFileData)
               download('export.txt', text); 
            }
         },
         {
            title: 'Save As',
            shortcut: 'Ctrl+Shift+S'
         }
      ]
   },
   {
      title: 'Edit',
      menuItems: [
         
      ]
   },
   {
      title: 'Format',
      menuItems: [
         
      ]
   },
   {
      title: 'View',
      menuItems: [
         
      ]
   },
   {
      title: 'Help',
      menuItems: [
         
      ]
   }
];

function MenuItem({ 
  title, 
  shortcut, 
  onClick, 
  notepadData
}: { 
  title: string, 
  shortcut: string
}) {
   return (
      <button 
         className="text-left pl-10 flex pr-6 w-full hover:bg-green-200"
         onClick={() => {
            onClick(notepadData);
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

function Menu({ text, menuItems, notepadData }: { text: string, menuItems: { title: string, shortcut: string }[] }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
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
                  notepadData={notepadData}
               />
            )}
        </div>
      </Dropdown>
    </>
  );
}

export default function MenuBar({notepadData}) {
   return (
      <div className="flex">
         {menus.map((menu) => <Menu text={menu.title} menuItems={menu.menuItems} key={menu.title} notepadData={notepadData} />)}
      </div>
   );
}