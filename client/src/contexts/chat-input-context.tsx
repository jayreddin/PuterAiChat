import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";

interface ChatInputContextType {
  insertText: (text: string) => void;
}

const ChatInputContext = createContext<ChatInputContextType | undefined>(undefined);

export const ChatInputProvider = ({ children }: { children: ReactNode }) => {
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);

  const insertText = useCallback((text: string) => {
    if (textareaRef) {
      const start = textareaRef.selectionStart;
      const end = textareaRef.selectionEnd;
      textareaRef.value = textareaRef.value.substring(0, start) + text + textareaRef.value.substring(end);
      textareaRef.selectionStart = start + text.length;
      textareaRef.selectionEnd = start + text.length;
      textareaRef.focus();
    }
  }, [textareaRef]);


  return (
    <ChatInputContext.Provider value={{ insertText }}>
      {children}
    </ChatInputContext.Provider>
  );
};

export const useChatInputContext = () => {
  const context = useContext(ChatInputContext);
  if (!context) {
    throw new Error("useChatInputContext must be used within a ChatInputProvider");
  }
  return context;
};

export { ChatInputContext };
