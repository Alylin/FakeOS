import type { FolderData } from './types';

/*
  Computer
    C:
      Applications
        Notepad.exe
        AudioPlayer.exe
        Photos.exe
        Theater.exe
        FileBrowser.exe
        Settings.exe
        PiArts-2D.exe
        PiArts-3D.exe
        MakotoPDFReader.exe
        Aqua - Lite.exe
      Users
        Administrator
          Desktop
            Notepad.exe     - shortcut (I hate the shortcut method, will change?)
            Settings.exe    - shortcut
            PiArts-2D.exe   - shortcut
            PiArts-3D.exe   - shortcut
            Aqua - Lite.exe - shortcut
          Documents
            TMD
            Journal
              2020
              2021
              2022
              2023
              2024
            Code
              Game
              GameAgain
              Python
            writing201
              critiques
            Legal-DONOTDELETE
              namechangeform.pdf
              lease - Copy.pdf
              ProofOfInsurance 20-03-25.pdf
            NewFolder
            Games
            Apartment
              WoodPatterns
              measurements
            modeling
              Apartment
          Downloads
          Photos
            OnePlus7T-AlyssaW
            Emoji
            Screenshots
            3DScans
            PiArts
            Cute
            documentation
            Maps
          Audio
            Music
            Audiobooks
          Video
            Movies
            Cutscenes
            ScreenRecordings
          Recently Deleted
*/

export async function getFolderDataByPath(path: string): Promise<{data: FolderData}> {
  const response = await fetch('/api/folder/path', {
    method: 'POST',
    body: JSON.stringify({
      path: path,
    })
  });
  const json = response.json();
  return json;
}

export async function getFolderDataById(id: number): Promise<{data: FolderData}> {
  const response = await fetch(`/api/folder/${id}/read`, {
    method: 'GET',
  });
  const json = response.json();
  return json;
}

// returns the folder's parent's id.
export async function deleteFolder(id: number) {
  const response = await fetch(`/api/folder/${id}/delete`, {
    method: 'POST',
  });
  // const json = response.json();
  // return json;
}

// returns the new folder's id.
export async function createFolder(parentId: number, folderName: string): Promise<{data: FolderData}> {
  const response = await fetch('/api/folder', {
    method: 'POST',
    body: JSON.stringify({
      folderName: folderName,
      parentId: parentId
    })
  });
  const json = response.json();
  return json;
}

export async function renameFolder(id: number, newName: string) {
  const response = await fetch(`/api/folder/${id}/rename`, {
    method: 'POST',
    body: JSON.stringify({
      displayName: newName
    })
  });
}
