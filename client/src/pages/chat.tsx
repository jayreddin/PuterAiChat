import { useState, useEffect } from "react";
import { ModelSelect } from "@/components/chat/model-select";
import { UtilityBar } from "@/components/chat/utility-bar";
import { ChatContainer } from "@/components/chat/chat-container";
import { DEFAULT_MODEL } from "@/lib/models";
import { createNewConversation, getConversation, saveConversation } from "@/lib/storage";
import type { Conversation } from "@shared/schema";

export default function ChatPage() {
  const [currentModel, setCurrentModel] = useState(DEFAULT_MODEL);
  const [conversation, setConversation] = useState<Conversation>(() => 
    createNewConversation(currentModel)
  );

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
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4 max-w-6xl mx-auto">
          <ModelSelect
            value={currentModel}
            onChange={handleModelChange}
          />
          <UtilityBar />
        </div>
      </header>

      <main className="flex-1 relative">
        <ChatContainer
          conversation={conversation}
          onUpdate={handleConversationUpdate}
        />
      </main>
    </div>
  );
}
