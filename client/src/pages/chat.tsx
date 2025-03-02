import { useState, useEffect } from "react";
import { usePuter } from "@/contexts/puter-context";
import { ModelSelect } from "@/components/chat/model-select";
import { UtilityBar } from "@/components/chat/utility-bar";
import { ChatContainer } from "@/components/chat/chat-container";
import { getDefaultModel } from "@/lib/models";
import { createNewConversation, getConversation, saveConversation } from "@/lib/storage";
import { Loader2 } from "lucide-react";
import type { Conversation } from "@shared/schema";
import type { UploadedImage } from "@/components/chat/utility-bar"; // Import UploadedImage interface

export default function ChatPage() {
  // Start with a different model than the default to avoid the initial issue
  const [currentModel, setCurrentModel] = useState("claude-3-5-sonnet");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const { isInitialized, isLoading, error } = usePuter();

  // Initialize conversation after Puter is loaded or after a timeout
  useEffect(() => {
    // Create conversation once when component mounts or when Puter initializes
    if (!conversation) {
      console.log('Initializing conversation with model:', currentModel);
      const newConversation = createNewConversation(currentModel);
      setConversation(newConversation);
      saveConversation(newConversation);
    }
  }, [conversation]);

  // Log Puter state changes for debugging
  useEffect(() => {
    console.log('Puter state in ChatPage:', { isInitialized, isLoading, error });
  }, [isInitialized, isLoading, error]);

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

  const handleNewChat = () => {
    const newConversation = createNewConversation(currentModel);
    setConversation(newConversation);
    saveConversation(newConversation);
  };

  // Dummy handleImageUpload function
  const handleImageUploaded = (images: UploadedImage[]) => {
    console.log("Images uploaded:", images);
    // Implement actual image handling logic here later
  };


  // If conversation is null, show loading state
  if (!conversation) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="h-12 flex items-center justify-center px-4">
          <ModelSelect
            value={currentModel}
            onValueChange={handleModelChange}
          />
        </div>
      </header>

      <main className="flex-1 relative mt-12">
        {isLoading && (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Initializing AI...</p>
            </div>
          </div>
        )}
        
        {!isLoading && (
          <ChatContainer
            conversation={conversation}
            onUpdate={handleConversationUpdate}
            onNewChat={handleNewChat} // Pass handleNewChat to ChatContainer
          />
        )}
      </main>

      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16 flex flex-col items-center justify-center gap-1">
        <UtilityBar onImageUploaded={handleImageUploaded} /> {/* Pass handleImageUploaded to UtilityBar */}
        <div className="text-sm text-muted-foreground">
          Created by <a href="https://github.io/jayreddin" className="hover:underline">Jamie Reddin</a> - 2025
        </div>
      </footer>
    </div>
  );
}
