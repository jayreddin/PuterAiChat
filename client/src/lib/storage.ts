import { Message, Conversation } from "@shared/schema";
import { nanoid } from "nanoid";

const STORAGE_KEY = "puter-chat-history";
const MAX_CONVERSATIONS = 10;

export function saveConversation(conversation: Conversation) {
  const conversations = getConversations();
  const existingIndex = conversations.findIndex(c => c.id === conversation.id);
  
  if (existingIndex !== -1) {
    conversations[existingIndex] = conversation;
  } else {
    conversations.unshift(conversation);
    if (conversations.length > MAX_CONVERSATIONS) {
      conversations.pop();
    }
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function getConversations(): Conversation[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getConversation(id: string): Conversation | undefined {
  return getConversations().find(c => c.id === id);
}

export function createNewConversation(model: string): Conversation {
  return {
    id: nanoid(),
    messages: [],
    model,
    createdAt: Date.now()
  };
}

export function addMessage(conversationId: string, message: Omit<Message, "id">) {
  const conversations = getConversations();
  const conversation = conversations.find(c => c.id === conversationId);
  
  if (!conversation) return;
  
  conversation.messages.push({
    ...message,
    id: nanoid()
  });
  
  saveConversation(conversation);
  return conversation;
}
