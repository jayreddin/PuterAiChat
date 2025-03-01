import { useState, useEffect } from "react";
import { ModelSelect } from "@/components/chat/model-select";
import { UtilityBar } from "@/components/chat/utility-bar";
import { ChatContainer } from "@/components/chat/chat-container";
import { DEFAULT_MODEL } from "@/lib/models";
import { createNewConversation, getConversation, saveConversation } from "@/lib/storage";
import type { Conversation } from "@shared/schema";

export default function ChatPage() {
  const [currentModel, setCurrentModel] = useState(DEFAULT_MODEL);
  const [conversation, setConversation] = useState<Conversation>(() => {
    // Ensure we create a new conversation with the default model
    const newConversation = createNewConversation(currentModel);
    
    // Immediately save this conversation to storage
    saveConversation(newConversation);
    
    return newConversation;
  });

  const handleModelChange = (modelId: string) => {
    setCurrentModel(modelId);
    const newConversation = createNewConversation(modelId);
    setConversation(newConversation);
    saveConversation(newConversation);
  };

  const handleConversationUpdate = (updated: Conversation) => {
    setConversation(updated);
    saveConversation(updated);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="h-12 flex items-center justify-center px-4">
          <ModelSelect
            value={currentModel}
            onChange={handleModelChange}
          />
        </div>
      </header>

      <main className="flex-1 relative mt-12">
        <ChatContainer
          conversation={conversation}
          onUpdate={handleConversationUpdate}
        />
      </main>

      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16 flex flex-col items-center justify-center gap-1">
        <UtilityBar />
        <div className="text-sm text-muted-foreground">
          Created by <a href="https://github.io/jayreddin" className="hover:underline">Jamie Reddin</a> - 2025
        </div>
      </footer>
    </div>
  );
}