import React, { createContext, useContext, useState, useRef } from "react";
import { CodeAttachment } from "@/components/chat/code-input-dialog";
// Import DialogFooter from the proper UI components location
import { DialogFooter } from "@/components/ui/dialog";


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
    // Implementation for editing would go here
  };

  const clearCodeAttachments = () => {
    setCodeAttachments([]);
  };

  const openCodeEditor = (attachment: CodeAttachment, index: number) => {
    console.log("Opening code editor for attachment at index", index);
    // Implementation to open code editor would go here
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

// Added CodeAttachmentsList component
export const CodeAttachmentsList = () => {
  const { codeAttachments, removeCodeAttachment } = useChatInput();
  return (
    <ul>
      {codeAttachments.map((attachment, index) => (
        <li key={index}>
          {attachment.name}
          <button onClick={() => removeCodeAttachment(index)}>Remove</button>
        </li>
      ))}
    </ul>
  );
};


// Example of how CodeAttachmentsList and DialogFooter might be used in another component (Illustrative)
//  This is not part of the original code, but added to demonstrate usage.
const CodeInputButton = () => {
  const codeInputRef = useRef<HTMLInputElement>(null);

  const handleAddAttachment = () => {
    // ... (Add attachment logic) ...
  };

  return (
    <div>
      <input type="file" ref={codeInputRef} />
      <button onClick={handleAddAttachment}>Add Code</button>
      <CodeAttachmentsList />
      <DialogFooter /> {/* Now DialogFooter should be defined */}
    </div>
  );
};