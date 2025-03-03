import { createContext, useContext, useState, ReactNode } from 'react';

interface ChatInputContextType {
  inputValue: string;
  setInputValue: (value: string) => void;
}

const ChatInputContext = createContext<ChatInputContextType | undefined>(undefined);

export function ChatInputProvider({ children }: { children: ReactNode }) {
  const [inputValue, setInputValue] = useState('');

  return (
    <ChatInputContext.Provider value={{ inputValue, setInputValue }}>
      {children}
    </ChatInputContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatInputContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatInputProvider');
  }
  return context;
}
