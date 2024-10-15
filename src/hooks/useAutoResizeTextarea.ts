import { useEffect, RefObject } from 'react';

const useAutoResizeTextarea = (textareaRef: RefObject<HTMLTextAreaElement>, value: string) => {
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, textareaRef]);
};

export default useAutoResizeTextarea;
