import { useEffect, useRef, useState } from "react";

function useCopy() {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLDivElement | null>(null);

  const handleCopyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
        })
        .catch(() => {
          setCopied(false);
        });
    } else {
      if (textareaRef.current) {
        document.execCommand("copy");
      }
      setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied]);

  return { copied, handleCopyToClipboard };
}

export default useCopy;
