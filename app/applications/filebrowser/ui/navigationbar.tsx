import { useEffect, useState } from "react";
import { MdUndo } from "react-icons/md";
import { getFolderDataByPath } from "../datalayer";
import { FolderData } from "../types";

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
            setFolderData(response.data);
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

export default function TopBar({
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
          path={'Paths are not yet supported'} 
          setFolderData={setFolderData} 
        />
      </div>
    </div>
  );
}
