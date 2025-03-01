import { createContext, useContext } from 'react';

interface ChatInputContextType {
  insertText?: (text: string) => void;
}

export const ChatInputContext = createContext<ChatInputContextType>({});

export const useChatInput = () => useContext(ChatInputContext);
