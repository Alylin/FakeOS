import { closeWindow, NewWindow, openWindow, WindowInstance } from "@/app/os/windows/windowmanager";
import { Position } from "@/app/utility/position";
import { Size } from "@/app/utility/size";
import { useEffect } from "react";
import { useRef, useState } from "react";
import { MdUndo } from "react-icons/md";
import Window from "../../os/windows/window";
import { createFolder, deleteFolder, getFolderDataById, getFolderDataByPath, renameFolder } from "./datalayer";
import { FolderData } from "./types";
import { RightClickMenu } from "./rightclickmenu";

function FolderEntry({
  displayName,
  id,
  date,
  size,
  isFolder,
  onOpen,
  invalidateData,
  openInNewWindow
}: {
  displayName: string,
  id: number,
  date?: string,
  size?: string,
  isFolder?: boolean,
  onOpen?: () => void,
  invalidateData: () => void,
  openInNewWindow: (id: number) => void
})  {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<Position>();
  const buttonRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const nameFieldRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(displayName);
  return (
    <>
      <tr 
        tabIndex={0}
        className="h-5 w-full border-b cursor-pointer border-neutral-300 whitespace-nowrap even:bg-neutral-50 odd:bg-white"
        ref={buttonRef}
        onDoubleClick={(event) => {
          onOpen?.();
        }}
        onClick={(event) => {
          setIsOpen(false);
        }}
        onContextMenu={(event) => {
          event.preventDefault();
          setIsOpen(true);
          setDropdownPosition({x: event.pageX, y: event.pageY})
        }}
      >
        <td className="w-5 pl-2 pr-1">
          <div 
            className={`h-4 w-4 bg-contain bg-center`} 
            style={{
              'backgroundImage': `url("/icons/${isFolder ? 'filemanager.svg' : 'notepad.svg'}")`
            }}
          />
        </td>
        <td className="pr-2 border-r border-neutral-300">
          <input 
            type="text" 
            value={name} 
            onChange={(event) => {
              setName(event.target.value);
            }}
            readOnly={!isEditing} 
            ref={nameFieldRef}
            className="outline-none w-full cursor-pointer"
            onBlur={() => {
              setIsEditing(false);
              renameFolder(id, name).then(() => {
                invalidateData();
              });
            }}
          />
        </td>
        <td className="px-2 pr-5 border-r border-neutral-300">
          {date}
        </td>
        <td className="px-2 pr-5">
          {size}
        </td>
      </tr>
      <RightClickMenu 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        buttonRef={buttonRef} 
        position={dropdownPosition}
        menuItems={[
          {
            displayName: 'Open',
            hotkey: '⌘+O',
            onClick: () => {
              onOpen?.();
            }
          },
          {
            displayName: 'Open in new window',
            hotkey: '⌘+^+O',
            onClick: () => {
              openInNewWindow(id);
            }
          },
          {
            displayName: 'Rename',
            hotkey: '⌘+R',
            onClick: () => {
              if (nameFieldRef.current) {
                nameFieldRef.current.focus();
                setIsEditing(true);
              }
            }
          },
          // {
          //   displayName: 'Copy',
          //   hotkey: '⌘+C'
          // },
          {
            displayName: 'Delete',
            hotkey: '⌘+D',
            onClick: () => {
              deleteFolder(id).then(() => {
                invalidateData();
              });
            }
          },
        ]}
      />
    </>
  );
}

function FolderItems({
  id, 
  setCurrentFolderId, 
  fileContents, 
  invalidateData,
  openInNewWindow
}: {
  id: number, 
  setCurrentFolderId: (id: number) => void, 
  fileContents: FolderData[] | null, 
  invalidateData: () => void,
  openInNewWindow: (id: number) => void
}) {
  if (fileContents === null) {
    return <>loading</>;
  }
  return (
    <>
      {
        fileContents.map((item) => {
          return (
            <FolderEntry 
              displayName={item.displayName}
              isFolder={true} 
              onOpen={() => {
                setCurrentFolderId(item.id);
              }}
              id={item.id}
              invalidateData={invalidateData}
              openInNewWindow={openInNewWindow}
            />
          );
        })
      }
    </>
  );
}

function FileList({
  currentFolderId,
  setCurrentFolderId,
  fileContents,
  invalidateData,
  openInNewWindow
}: {
  currentFolderId: number,
  setCurrentFolderId: (id: number) => void,
  fileContents: FolderData[] | null,
  invalidateData: () => void,
  openInNewWindow: (id: number) => void
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<Position>();
  const buttonRef = useRef(null);

  return (
    <div 
      className="bg-white w-full flex-1 min-h-0 flex-col overflow-y-auto overscroll-none border border-neutral-800"
      ref={buttonRef}
      onContextMenu={(event) => {
        if (event.target === buttonRef.current) {
          event.preventDefault();
          setIsOpen(true);
          setDropdownPosition({x: event.pageX, y: event.pageY})
        }
      }}
      onClick={() => {
        setIsOpen(false);
      }}
    >
      <table className="border-separate border-spacing-0 text-left w-full">
        <tr className="z-10 h-5">
          <th className="min-w-6 border-b border-neutral-500 bg-neutral-200 pr-1 sticky top-0" />
          <th className="sticky border-b top-0 bg-neutral-200 whitespace-nowrap w-full px-2 border-r border-neutral-500">
            Name
          </th>
          <th className="sticky border-b top-0 bg-neutral-200 whitespace-nowrap px-2 pr-5 border-r border-neutral-500">
            Last Modified
          </th>
          <th className="sticky border-b top-0 bg-neutral-200 whitespace-nowrap px-2 pr-5 border-neutral-500">
            File Size
          </th>
        </tr>
        <FolderItems
          id={currentFolderId} 
          setCurrentFolderId={setCurrentFolderId} 
          fileContents={fileContents} 
          invalidateData={invalidateData} 
          openInNewWindow={openInNewWindow}
        />
      </table>
      <RightClickMenu 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        buttonRef={buttonRef} 
        position={dropdownPosition}
        menuItems={[
          {
            displayName: 'New Folder',
            hotkey: '⌘+O',
            onClick: () => {
              createFolder(currentFolderId, 'New Folder').then(() => {
                invalidateData();
              });
            }
          }
        ]}
      />
    </div>
  );
}

function PathField({path, setFolderData}: {path: string, setFolderData: (data: FolderData) => void}) {
  const [tempPath, setPath] = useState('');
  useEffect(() => {
    setPath(path);
  }, [path]);

  return (
    <input 
      className="bg-white text-black w-full px-2 outline-neutral-700 outline-1 outline" 
      type="text"
      onChange={(event) => {
        setPath(event.target.value);
      }}
      onKeyUp={(event) => {
        if (event.code === 'Enter') {
          getFolderDataByPath(tempPath).then((response) => {
            if (response.data) {
              setFolderData(response.data);
            }
          });
        }
      }}
      onBlur={() => {
        setPath(path);
      }}
      value={tempPath}
    />
  );
}

function BackButton({
  parentId,
  onSetFolderId
}: {
  parentId: number | undefined,
  onSetFolderId: (id: number) => void
}) {
  const isDisabled = !parentId;
  return (
    <button 
      className="w-6 h-6 text-black flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isDisabled}
      onClick={() => {
        if (parentId) {
          onSetFolderId(parentId);
        }
      }}
    >
      <MdUndo size={16} />
    </button>
  )
}

function TopBar({
  folderData, 
  setFolderData,
  onSetFolderId
}: {
  folderData: FolderData | null, 
  setFolderData: (data: FolderData) => void,
  onSetFolderId: (id: number) => void
}) {
  return (
    <div className="w-full h-8 bg-neutral-200 flex items-center px-2">
      <BackButton parentId={folderData?.parentId} onSetFolderId={onSetFolderId} />
      <div className="flex-1 flex items-center justify-center ml-2">
        <PathField 
          path={folderData?.path || 'Loading or error I guess?'} 
          setFolderData={setFolderData} 
        />
      </div>
    </div>
  );
}

function FileBrowser(
  { 
    desktopSize, 
    setWindows, 
    windows, 
    windowID, 
    isCollapsed,
    startingFolderId = 1
  }: { 
    desktopSize: Size, 
    setWindows: (windows: WindowInstance[]) => void, 
    windows: WindowInstance[],
    windowID: string,
    isCollapsed: boolean,
    startingFolderId?: number
}) {
  // currentFolderId may be incorrect at times for now. This isn't important but will be fixed to reduce confusion.
  const [currentFolderId, setCurrentFolderId] = useState(startingFolderId);
  const [folderData, setFolderData] = useState<FolderData | null>(null);
  const [dataIsValid, setDataIsValid] = useState(false);

  useEffect(() => { // test108 we need a way to tell this that the data is invalid. 
    if (currentFolderId === folderData?.id && dataIsValid) {
      return;
    }
    const dataPromise = getFolderDataById(currentFolderId);
    dataPromise.then((response) => {
      setFolderData(response.data);
      setDataIsValid(true);
    });
  }, [currentFolderId, dataIsValid]);

  // useEffect(() => {
  //   if (folderData) {
  //     setCurrentFolderId(folderData.id)
  //   }
  // }, [folderData]);

  return (
    <Window
      title="File Browser" 
      desktopSize={desktopSize}
      setWindows={setWindows}
      windows={windows}
      windowID={windowID}
      icon={
        <div 
          className="h-5 w-5 bg-contain"
          style={{
            backgroundImage: `url("/icons/filemanager.svg")`
          }}
        />
      }
      isCollapsed={isCollapsed}
      minWidth={400}
      minHeight={400}
    >
      <div className="w-full h-full flex flex-col">
        <TopBar folderData={folderData} setFolderData={setFolderData} onSetFolderId={setCurrentFolderId} />
        <FileList 
          currentFolderId={currentFolderId} 
          setCurrentFolderId={setCurrentFolderId} 
          fileContents={folderData?.children || []}
          invalidateData={() => {
            setDataIsValid(false);
          }}
          openInNewWindow={(id: number) => {
            openWindow(
              windows,
              setWindows,
              getFileBrowserData(id)
            );
          }}
        />
      </div>
    </Window>
  );
}


export function getFileBrowserData(startingFolderId: number = 1): NewWindow {
  return {
    applicationID: 'filebrowser', 
    windowDisplayName: 'File Browser',
    icon: "bg-[url('/icons/filemanager.svg')]",
    render: (
      currentDesktopSize: Size, 
      setWindows: (windows: WindowInstance[]) => void, 
      windows: WindowInstance[], 
      windowID: string, 
      isCollapsed: boolean
    ) => {
      return (
        <FileBrowser 
          desktopSize={currentDesktopSize}
          setWindows={setWindows}
          windows={windows}
          windowID={windowID}
          key={windowID}
          isCollapsed={isCollapsed}
          startingFolderId={startingFolderId}
        />
      );
    }
  }
}