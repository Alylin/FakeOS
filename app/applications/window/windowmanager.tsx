import { ReactElement } from 'react';
import { Size } from '../generic/size';

export type WindowInstance = {
    applicationID: string,
    windowID: string,
    windowDisplayName: string,
    zIndex: number,
    isFocused: boolean,
    isMinimized: boolean,
    icon: string,
    render: (
        currentDesktopSize: Size, 
        setWindows: (windows: WindowInstance[]) => void,
        windows: WindowInstance[],
        windowID: string,
        isMinimized: boolean
    ) => ReactElement
};


const getNextIndex = (windows: WindowInstance[]) => {
    if (windows.length === 0) {
        return 0;
    }
    let highestIndex = Number.NEGATIVE_INFINITY;
    windows.forEach((window) => {
        highestIndex = Math.max(window.zIndex, highestIndex);
    });
    return highestIndex+1;
};

const getActiveInstancesOfApplication = (windows: WindowInstance[], applicationID: string) => {
    return windows.filter((window) => {
        return window.applicationID === applicationID;
    });
};

const getWindowID = (windows: WindowInstance[], applicationID: string) => {
    const applicationInstances = getActiveInstancesOfApplication(windows, applicationID);
    let proposedName = applicationID;
    let id = 0;
    let unavailableName = true;
    while (unavailableName) {
        unavailableName = !!applicationInstances.find(instance => instance.windowID === proposedName);
        if (unavailableName) {
            proposedName = `${proposedName.split('-')[0]}-${id++}`;
        }
    }
    return proposedName;
};

export type NewWindow = {
    applicationID: string, 
    windowDisplayName: string,
    icon: string,
    render: (
        currentDesktopSize: Size, 
        setWindows: (windows: WindowInstance[]) => void,
        windows: WindowInstance[],
        windowID: string,
        isCollapsed: boolean
    ) => ReactElement
}; 

export type WindowManager = {
    windows: WindowInstance[],
    closeWindow: (windowID: string) => void,
    openWindow: (newWindow: NewWindow) => WindowInstance
};

export function closeWindow(
    windows: WindowInstance[], 
    setWindows: (windows: WindowInstance[]) => void, 
    windowID: string
) {
    setWindows(windows.filter((window) => { 
        return window.windowID !== windowID;
    }));
};

export function openWindow(
    windows: WindowInstance[], 
    setWindows: (windows: WindowInstance[]) => void,
    newWindow: NewWindow
) {
    let newWindows = [...windows];
    newWindows = newWindows.map((window) => {
        window.isFocused = false;
        return window;
    });
    const windowID = getWindowID(windows, newWindow.applicationID);
    newWindows.push({
        applicationID: newWindow.applicationID,
        windowDisplayName: newWindow.windowDisplayName,
        render: newWindow.render,
        windowID: windowID,
        zIndex: getNextIndex(windows),
        isFocused: true,
        isMinimized: false,
        icon: newWindow.icon
    });
    setWindows(newWindows);
    return newWindows[newWindows.length-1];
};

export function moveToFront(
    windows: WindowInstance[], 
    setWindows: (windows: WindowInstance[]) => void, 
    windowID: string
) {
    let newWindows = [...windows];
    let foundIndex = 0;
    const movingWindow = newWindows.find((window, index) => {
        foundIndex = index
        return window.windowID === windowID;
    });

    newWindows = newWindows.map((window) => {
        window.isFocused = false;
        return window;
    });
    if (!movingWindow) {
        return;
    }
    
    movingWindow.zIndex = getNextIndex(windows);
    movingWindow.isFocused = true;
    movingWindow.isMinimized = false;
    newWindows[foundIndex] = movingWindow;
    
    setWindows(newWindows);
};

export function minimizeWindow(
    windows: WindowInstance[], 
    setWindows: (windows: WindowInstance[]) => void, 
    windowID: string
) {
    let newWindows = [...windows];
    let foundIndex = 0;
    const movingWindow = newWindows.find((window, index) => {
        foundIndex = index
        return window.windowID === windowID;
    });

    if (!movingWindow) {
        return;
    }
    
    movingWindow.isFocused = false;
    movingWindow.isMinimized = true;
    newWindows[foundIndex] = movingWindow;
    
    setWindows(newWindows);
}