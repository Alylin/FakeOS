import { useEffect, useRef } from "react";

export default function EditableText({
  value,
  isEditing,
  onValueChanged,
  onCommitChanges
}: {
  value: string,
  isEditing: boolean,
  onValueChanged: (newValue: string) => void,
  onCommitChanges: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.select();
    }
  }, [isEditing]);

  return (
    <input
      type="text" 
      value={value} 
      onChange={(event) => {
        onValueChanged(event.target.value);
      }}
      onKeyDown={(event) => {
        if (event.code === 'Enter') {
          onCommitChanges();
        }
      }}
      readOnly={!isEditing} 
      ref={inputRef}
      className={`outline-none w-full cursor-pointer ${!isEditing && 'selection:bg-none selection:text-inherit'}`}
      onBlur={() => {
        onCommitChanges();
      }}
    />
  );
}