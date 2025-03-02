import { useState, useEffect } from "react";
import { usePuter } from "@/contexts/puter-context";
import { ModelSelect } from "@/components/chat/model-select";
import { UtilityBar } from "@/components/chat/utility-bar";
import { ChatContainer } from "@/components/chat/chat-container";
import { getDefaultModel } from "@/lib/models";
import { createNewConversation, getConversation, saveConversation } from "@/lib/storage";
import { Loader2 } from "lucide-react";
import type { Conversation } from "@shared/schema";
import type { UploadedImage, CodeAttachment } from "@/components/chat/utility-bar";

export default function ChatPage() {
  const [currentModel, setCurrentModel] = useState("claude-3-5-sonnet");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [deepThinkModelId, setDeepThinkModelId] = useState<string | null>(null);
  const [codeAttachment, setCodeAttachment] = useState<CodeAttachment | null>(null);
  const { isInitialized, isLoading, error } = usePuter();

  useEffect(() => {
    if (!conversation) {
      console.log('Initializing conversation with model:', currentModel);
      const newConversation = createNewConversation(currentModel);
      setConversation(newConversation);
      saveConversation(newConversation);
    }
  }, [conversation]);

  useEffect(() => {
    console.log('Puter state in ChatPage:', { isInitialized, isLoading, error });
  }, [isInitialized, isLoading, error]);

  const handleModelChange = (modelId: string) => {
    setCurrentModel(modelId);
    setDeepThinkModelId(null);
    const newConversation = createNewConversation(modelId);
    setConversation(newConversation);
    saveConversation(newConversation);
  };

  const handleConversationUpdate = (updated: Conversation) => {
    setConversation(updated);
    saveConversation(updated);
  };

  const handleNewChat = () => {
    setDeepThinkModelId(null);
    setCodeAttachment(null);
    const newConversation = createNewConversation(currentModel);
    setConversation(newConversation);
    saveConversation(newConversation);
  };

  const handleImageUploaded = (images: UploadedImage[]) => {
    console.log("Images uploaded:", images);
  };

  const handleCodeAttachment = (attachment: CodeAttachment) => {
    setCodeAttachment(attachment);
  };

  if (!conversation) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="h-12 flex items-center justify-center px-4">
          <ModelSelect
            value={currentModel}
            onValueChange={handleModelChange}
            isDeepThinkActive={deepThinkModelId === currentModel}
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
        
        {!isLoading && conversation && (
          <ChatContainer
            conversation={conversation}
            onUpdate={handleConversationUpdate}
            onNewChat={handleNewChat}
            onLoadChat={id => console.log("Load chat:", id)}
            codeAttachment={codeAttachment}
            onRemoveCodeAttachment={() => setCodeAttachment(null)}
          />
        )}
      </main>

      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16 flex flex-col items-center justify-center gap-1">
        <UtilityBar 
          onImageUploaded={handleImageUploaded}
          onCodeSubmit={handleCodeAttachment}
        />
        <div className="text-sm text-muted-foreground">
          Created by <a href="https://github.io/jayreddin" className="hover:underline">Jamie Reddin</a> - 2025
        </div>
      </footer>
    </div>
  );
}
