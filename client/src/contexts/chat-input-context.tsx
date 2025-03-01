import React, { createContext, useContext, useState } from "react";
import { CodeAttachment } from "@/components/chat/code-input-dialog";

interface ChatInputContextType {
  codeAttachments: CodeAttachment[];
  addCodeAttachment: (attachment: CodeAttachment) => void;
  removeCodeAttachment: (index: number) => void;
  editCodeAttachment: (index: number) => void;
  clearCodeAttachments: () => void;
  openCodeEditor: (attachment: CodeAttachment, index: number) => void;
}

export const ChatInputContext = createContext<ChatInputContextType | undefined>(undefined);

export const ChatInputProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [codeAttachments, setCodeAttachments] = useState<CodeAttachment[]>([]);

  const addCodeAttachment = (attachment: CodeAttachment) => {
    setCodeAttachments((prev) => [...prev, attachment]);
  };

  const removeCodeAttachment = (index: number) => {
    setCodeAttachments((prev) => prev.filter((_, i) => i !== index));
  };
  
  const editCodeAttachment = (index: number) => {
    console.log("Editing code attachment at index", index);
    // Will be implemented to edit an existing attachment
  };
  
  const clearCodeAttachments = () => {
    setCodeAttachments([]);
  };

  const openCodeEditor = (attachment: CodeAttachment, index: number) => {
    // This will be implemented to open the code editor with the selected attachment
    console.log("Opening code editor for attachment at index", index);
    // Will connect to the code input dialog later
  };

  return (
    <ChatInputContext.Provider value={{ 
      codeAttachments, 
      addCodeAttachment, 
      removeCodeAttachment,
      editCodeAttachment,
      clearCodeAttachments,
      openCodeEditor
    }}>
      {children}
    </ChatInputContext.Provider>
  );
};

export const useChatInput = () => {
  const context = useContext(ChatInputContext);
  if (context === undefined) {
    throw new Error("useChatInput must be used within a ChatInputProvider");
  }
  return context;
};