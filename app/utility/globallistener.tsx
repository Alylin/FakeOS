// not sure how to make this work with all event types without it being 'any'
export function addGlobalListener(eventName: string, onEvent: (event: any) => void, skipListener?: boolean) {
  if (skipListener) {
    return () => {
      // returns a no-op function
    };
  }
  document.addEventListener(eventName, onEvent);
  return () => {
    document.removeEventListener(eventName, onEvent);
  };
}