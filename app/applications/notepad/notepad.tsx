import { Footer } from "./footer";
import MenuBar from "./menubar";
import Window from "../window/window";
import { useEffect, useState, useRef } from 'react';
import {Editor, EditorState, ContentState, getDefaultKeyBinding} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { setSelectToEnd } from '../generic/editorutilities';
import { Size } from "../generic/size";
import { closeWindow, NewWindow, WindowInstance } from "../window/windowmanager";

export type NotepadFileDataEntry = {
    displayName: string;
    children: NotepadFileData;
    key: number;
};

export type NotepadFileData = Array<NotepadFileDataEntry>;

const getEntry = (
    notepadFileData: NotepadFileData,
    pathArray: Array<string>
) => {
    if (pathArray.length) {
        let returnValue = notepadFileData;
        pathArray.forEach((pathEntry) => {
            returnValue = returnValue[pathEntry]
        });
        return returnValue;
    }
    return notepadFileData;
};

const addSibling = (
    notepadFileData: NotepadFileData,
    setData: (data: NotepadFileData) => void,
    path: string,
    getNextKey: () => number,
    displayName = ''
) => {
    const pathArray = path.split(".");
    const index = Number.parseInt(pathArray.pop() || '');
    const parentEntry = getEntry(notepadFileData, pathArray);
    if (!parentEntry) {
        return;
    }
    parentEntry.splice(
        index + 1,
        0,
        {
            displayName: displayName,
            children: [],
            key: getNextKey()
        }
    );

    const newData = [...notepadFileData];
    setData(newData);
};

const deleteEntry = (
    notepadFileData: NotepadFileData,
    setData: (data: NotepadFileData) => void,
    path: string
) => {
    const pathArray = path.split(".");
    const index = Number.parseInt(pathArray.pop() || '');
    const parentEntry = getEntry(notepadFileData, pathArray);
    if (!parentEntry) {
        return;
    }
    parentEntry.splice(index, 1);
    const newData = [...notepadFileData];
    setData(newData);
};

const moveUp = (
    notepadFileData: NotepadFileData,
    setData: (data: NotepadFileData) => void,
    path: string
) => {
    const pathArray = path.split(".");
    const movingEntry = getEntry(notepadFileData, pathArray);
    if (!movingEntry) {
        return false;
    }
    const index = Number.parseInt(pathArray.pop() || '');
    if (!index) {
        return false;
    }
    pathArray.push(`${index - 1}`);
    pathArray.push('children');
    const siblingBefore = getEntry(notepadFileData, pathArray);
    if (siblingBefore) {
        siblingBefore.push(movingEntry);
        deleteEntry(notepadFileData, setData, path);
        const newData = [...notepadFileData];
        setData(newData);
        return true;
    }
    return false;
};

const moveDown = (
    notepadFileData: NotepadFileData,
    setData: (data: NotepadFileData) => void,
    path: string
) => {
    const pathArray = path.split(".");
    const movingEntry = getEntry(notepadFileData, pathArray);
    if (!movingEntry) {
        return false;
    }
    pathArray.pop();
    pathArray.pop();
    const indexOfParent = Number.parseInt(pathArray.pop() || '');

    if (Number.isNaN(indexOfParent)) {
        return false;
    }

    const newParent = getEntry(notepadFileData, pathArray);
    newParent.splice(indexOfParent + 1, 0, movingEntry);

    deleteEntry(notepadFileData, setData, path);
    return true;
};

function CollapsingSection(
    {
        dataInstance,
        defaultState = false,
        updateDecendent,
        path,
        addSibling,
        deleteEntry,
        moveUp,
        moveDown,
        getNextKey
    }:
        {
            dataInstance: NotepadFileDataEntry,
            defaultState?: boolean
            path: string,
            getNextKey: () => number
        }) {
    const [isCollapsed, setIsCollapsed] = useState(defaultState);
    const [alwaysVisible, setAlwaysVisible] = useState(false);

    const [editorState, setEditorState] = useState(
        EditorState.createWithContent(ContentState.createFromText(dataInstance.displayName || ''))
    );

    useEffect(() => {
        setAlwaysVisible(dataInstance.children.length < 1);
    }, [dataInstance.children.length]);

    useEffect(() => {
        const contentState = editorState.getCurrentContent();
        const newText = contentState.getPlainText();
        if (newText !== dataInstance.displayName) {
            updateDecendent(`${path}.displayName`, newText);
        }
    }, [editorState, dataInstance, updateDecendent, path]);

    useEffect(() => {
        setSelectToEnd(editorState, setEditorState);
    }, []);

    const handleKeyCommand = (command: string) => {
        if (command === 'create-sibling') {
            addSibling(path, '');
            return 'handled';
        }
        if (command === 'move-up') {
            moveUp(path);
            return 'handled';
        }
        if (command === 'move-down') {
            if (!moveDown(path)) {
                deleteEntry(path);
                // select the end of the one before, do not allow deleting the ONLY entry
            }
            return 'handled';
        }
        return 'not-handled';
    }

    const keyBindings = (e: KeyboardEvent) => {
        if (e.keyCode === 13 && !e.shiftKey) { // enter
            return 'create-sibling';
        }
        if (e.keyCode === 9 && !e.shiftKey) { // tab
            return 'move-up';
        }
        const selection = editorState.getSelection();
        if (
            (e.keyCode === 8 && (selection.getStartOffset() === 0 && selection.getEndOffset() === 0)) ||
            (e.keyCode === 9 && e.shiftKey)
        ) {
            return 'move-down';
        }
        return getDefaultKeyBinding(e);
    }

    return (
        <>
            <div className="flex">
                <div className="min-w-[2px]">
                    <Editor
                        editorState={editorState}
                        onChange={(newEditorState: EditorState) => {
                            setEditorState(newEditorState);
                        }}
                        stripPastedStyles={true}
                        handleKeyCommand={handleKeyCommand}
                        keyBindingFn={keyBindings}
                    />
                </div>
                {
                    !alwaysVisible &&
                    <button
                        className="ml-2"
                        onClick={() => {
                            setIsCollapsed(!isCollapsed);
                        }}
                    >
                        {isCollapsed ? '+' : '-'}
                    </button>
                }
                <div
                    className="flex-1 cursor-text"
                    onClick={() => {
                        setSelectToEnd(editorState, setEditorState);
                    }}
                />
            </div>
            <div className={`ml-4 overflow-hidden ${isCollapsed ? 'max-h-0' : ''}`}>
                {dataInstance.children?.map((child, index) => {
                    return <CollapsingSection
                        dataInstance={child}
                        key={child.key}
                        updateDecendent={updateDecendent}
                        path={`${path}.children.${index}`}
                        addSibling={addSibling}
                        deleteEntry={deleteEntry}
                        moveUp={moveUp}
                        moveDown={moveDown}
                        getNextKey={getNextKey}
                    />
                })}
            </div>
        </>
    );
}

function setDescendantsValue(object: NotepadFileData, path: string, newValue: string | NotepadFileData) {
    if (path === '' && typeof newValue !== 'string') {
        return newValue;
    }
    const pathArray = path.split(".");
    const newObject = [...object];
    let decendant = newObject;
    pathArray.forEach((pathStep: string, index: number) => {
        if (index !== pathArray.length - 1) {
            decendant = decendant[pathStep];
        }
    });
    decendant[pathArray[pathArray.length - 1]] = newValue;
    return [...newObject];;
}

const updateDecendent = (
    pathToDecendent: string,
    newValue: string | NotepadFileData,
    setData: (data: NotepadFileData) => void,
    data: NotepadFileData
) => {
    const newData = setDescendantsValue(data, pathToDecendent, newValue)
    setData(newData);
};

export default function Notepad({ desktopSize, setWindows, windows, windowID, isCollapsed, icon }: { 
    desktopSize: Size, 
    setWindows: (windows: WindowInstance[]) => void, 
    windows: WindowInstance[],
    windowID: string,
    isCollapsed: boolean,
    icon: string
}) {
    let key = useRef(1);
    const getNextKey = () => {
        return key.current++;
    };
    const [data, setData] = useState<NotepadFileData>([]);
    useEffect(() => {
        if (data.length) {
            localStorage.setItem('notepad.currentData', JSON.stringify(data));
        }
    }, [data]);
    useEffect(() => {
        const loadedData = JSON.parse(localStorage.getItem('notepad.currentData'));
        setData(
            loadedData?.length ? loadedData :
                [
                    {
                        displayName: '',
                        children: [],
                        key: 1
                    }
                ]
        );
    }, []);

    return (
        <Window
            title={`${'test'}.dnd - Notepad`} 
            desktopSize={desktopSize} 
            onClose={() => {
                closeWindow(windows, setWindows, windowID);
            }} 
            topBarAddon={<MenuBar notepadData={data} />}
            setWindows={setWindows}
            windows={windows}
            windowID={windowID}
            icon={
                <div 
                    className={`h-5 w-5 bg-contain`} 
                    style={{
                        'backgroundImage': `url("${icon}")`
                    }}
                />
            }
            isCollapsed={isCollapsed}
        >
            <div className="px-1.5 flex overflow-y-scroll flex-1 font-mono text-base bg-neutral-300">
                <div className="w-full">
                    {
                        data.map((dataInstance, index) => {
                            return (
                                <CollapsingSection
                                    dataInstance={dataInstance}
                                    updateDecendent={(pathToDecendent: string, newValue: string) => {
                                        updateDecendent(
                                            pathToDecendent,
                                            newValue,
                                            setData,
                                            data
                                        );
                                    }}
                                    addSibling={(targetPath: string, displayName: string) => {
                                        addSibling(
                                            data,
                                            setData,
                                            targetPath,
                                            getNextKey,
                                            displayName
                                        );
                                    }}
                                    moveUp={(path: string) => {
                                        moveUp(
                                            data,
                                            setData,
                                            path
                                        );
                                    }}
                                    moveDown={(path: string) => {
                                        return moveDown(
                                            data,
                                            setData,
                                            path
                                        );
                                    }}
                                    deleteEntry={(path: string) => {
                                        deleteEntry(data, setData, path);
                                    }}
                                    getNextKey={getNextKey}
                                    path={`${index}`}
                                    key={dataInstance.key}
                                />
                            );
                        })
                    }
                </div>
            </div>
            <Footer />
        </Window>
    );
}

export function getNotepadData(): NewWindow {
    return {
        applicationID: 'notepad', 
        windowDisplayName: 'Notepad',
        icon: '/icontest.svg',
        render: (
            currentDesktopSize: Size, 
            setWindows: (windows: WindowInstance[]) => void, 
            windows: WindowInstance[], 
            windowID: string, 
            isCollapsed: boolean
        ) => {
            return (
                <Notepad 
                    desktopSize={currentDesktopSize}
                    setWindows={setWindows}
                    windows={windows}
                    windowID={windowID}
                    key={windowID}
                    isCollapsed={isCollapsed}
                    icon="/icontest.svg"
                />
            );
        }
    }
}