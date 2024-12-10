export type FolderData = {
  id:          number,
  displayName: string,
  children:    FolderData[],
  parentId:    number,
  path:        string
};
