import React, { createContext, useContext, useState } from "react";

interface CodeAttachment {
  code: string;
  language?: string;
  // Add other properties as needed (e.g., preview, comments)
}

interface ChatInputContextType {
  insertText: (text: string) => void;
  setInputRef: (ref: HTMLTextAreaElement | null) => void;
  codeAttachments: CodeAttachment[];
  addCodeAttachment: (attachment: CodeAttachment) => void;
  removeCodeAttachment: (index: number) => void;
  editCodeAttachment: (index: number) => void;
  clearCodeAttachments: () => void;
}

export const ChatInputContext = createContext<ChatInputContextType>({
  insertText: () => {},
  setInputRef: () => {},
  codeAttachments: [],
  addCodeAttachment: () => {},
  removeCodeAttachment: () => {},
  editCodeAttachment: () => {},
  clearCodeAttachments: () => {},
});

export const useChatInput = () => useContext(ChatInputContext);

export const ChatInputProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [inputRef, setInputRef] = useState<HTMLTextAreaElement | null>(null);
  const [codeAttachments, setCodeAttachments] = useState<CodeAttachment[]>([]);
  const [editingAttachmentIndex, setEditingAttachmentIndex] = useState<number | null>(null);

  const insertText = (text: string) => {
    if (!inputRef) return;

    const start = inputRef.selectionStart;
    const end = inputRef.selectionEnd;
    const value = inputRef.value;
    const newValue = value.substring(0, start) + text + value.substring(end);

    inputRef.value = newValue;
    inputRef.focus();
    inputRef.selectionStart = inputRef.selectionEnd = start + text.length;

    // Trigger input event to update state
    const event = new Event('input', { bubbles: true });
    inputRef.dispatchEvent(event);
  };

  const addCodeAttachment = (attachment: CodeAttachment) => {
    if (editingAttachmentIndex !== null) {
      // Replace existing attachment if editing
      const newAttachments = [...codeAttachments];
      newAttachments[editingAttachmentIndex] = attachment;
      setCodeAttachments(newAttachments);
      setEditingAttachmentIndex(null);
    } else {
      // Add new attachment
      setCodeAttachments([...codeAttachments, attachment]);
    }
  };

  const removeCodeAttachment = (index: number) => {
    setCodeAttachments(codeAttachments.filter((_, i) => i !== index));
  };

  const editCodeAttachment = (index: number) => {
    setEditingAttachmentIndex(index);
  };

  const clearCodeAttachments = () => {
    setCodeAttachments([]);
  };

  const contextValue = {
    insertText,
    setInputRef,
    codeAttachments,
    addCodeAttachment,
    removeCodeAttachment,
    editCodeAttachment,
    clearCodeAttachments,
  };

  return (
    <ChatInputContext.Provider value={contextValue}>
      {children}
    </ChatInputContext.Provider>
  );
};