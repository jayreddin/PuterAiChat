import { useEffect, useRef, forwardRef, useState } from "react";
import { Message, Conversation } from "@shared/schema";
import { usePuter } from "@/contexts/puter-context";
import { ChatBubble } from "./chat-bubble";
import { ChatInput } from "./chat-input";
import { getModelById } from "@/lib/models";
import { addMessage } from "@/lib/storage";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Plus, Clock, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { MessageBlock, ImageDescription, PuterAPI } from "@/types/puter";

interface ChatContainerProps {
  conversation: Conversation;
  onUpdate: (conversation: Conversation) => void;
  onNewChat?: () => void;
  onLoadChat?: (conversationId: string) => void;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: number;
}

interface UploadedImage {
  id: string;
  url: string;
}

const generateChatTitle = (messages: Message[]): string => {
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (!firstUserMessage) return 'New Chat';
  const title = firstUserMessage.content.split('\n')[0].slice(0, 40);
  return title + (title.length >= 40 ? '...' : '');
};

function assertIsPuterAI(obj: any): asserts obj is PuterAPI['ai'] {
  if (!obj || typeof obj !== 'object') throw new Error('Puter AI not initialized');
  if (typeof obj.chat !== 'function') throw new Error('Puter AI chat not available');
}

const getPuterAI = (): PuterAPI['ai'] | null => {
  if (!window.puter?.ai) return null;
  try {
    assertIsPuterAI(window.puter.ai);
    return window.puter.ai;
  } catch (error) {
    console.error('Puter AI validation failed:', error);
    return null;
  }
};

export const ChatContainer = forwardRef<HTMLDivElement, ChatContainerProps>(({ 
  conversation, 
  onUpdate, 
  onNewChat, 
  onLoadChat 
}, ref) => {
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const model = getModelById(conversation.model) || { name: "AI Assistant" };
  const { isInitialized: isPuterInitialized, isLoading } = usePuter();

  const scrollToTop = () => {
    const container = document.querySelector('.chat-messages');
    if (container) {
      container.scrollTop = 0;
    }
  };

  useEffect(() => {
    scrollToTop();
  }, [conversation.messages]);

  useEffect(() => {
    const loadHistory = () => {
      try {
        const historyStr = localStorage.getItem('chatHistory');
        if (historyStr) {
          setChatHistory(JSON.parse(historyStr));
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };
    
    loadHistory();
    window.addEventListener('storage', loadHistory);
    return () => window.removeEventListener('storage', loadHistory);
  }, []);

  const clearChat = () => {
    setInputValue("");
    setUploadedImages([]);
    setIsTyping(false);
    scrollToTop();
  };

  const handleNewChat = () => {
    if (conversation.messages.length > 0) {
      const newHistoryItem = {
        id: conversation.id,
        title: generateChatTitle(conversation.messages),
        timestamp: Date.now()
      };
      
      const updatedHistory = [newHistoryItem, ...chatHistory].slice(0, 20);
      localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
      setChatHistory(updatedHistory);
    }
    
    clearChat();
    onNewChat?.();
  };

  const handleImageUpload = (images: UploadedImage[]) => {
    setUploadedImages(prev => [...prev, ...images]);
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString([], { month: 'long', day: 'numeric' });
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() && uploadedImages.length === 0) return;
    
    const puterAI = getPuterAI();
    if (!isPuterInitialized || !puterAI) {
      toast({
        title: "Chat Not Ready",
        description: "Chat is not ready yet. Please wait a moment and try again.",
        variant: "destructive"
      });
      return;
    }

    let message = inputValue.trim();
    setInputValue("");

    // Process images if any
    if (uploadedImages.length > 0 && typeof puterAI.describeImage === 'function') {
      try {
        const imageDescriptions = await Promise.all(
          uploadedImages.map(async (img) => {
            try {
              return await puterAI.describeImage(img.url);
            } catch (error) {
              console.error(`Failed to describe image ${img.id}:`, error);
              return null;
            }
          })
        );
        
        const descriptions = imageDescriptions
          .filter((desc): desc is ImageDescription => desc !== null)
          .map(desc => desc.description);

        if (descriptions.length > 0) {
          message = `[Image Context: ${descriptions.join(' | ')}]\n\n${message}`;
        }
      } catch (error) {
        console.error('Failed to process images:', error);
      }
    }

    // Add user message
    const updatedConvo = addMessage(conversation.id, {
      content: message,
      role: "user",
      timestamp: Date.now(),
      model: conversation.model,
    });

    if (!updatedConvo) return;
    onUpdate(updatedConvo);
    setUploadedImages([]); // Clear images after sending

    // Show typing indicator
    setIsTyping(true);

    try {
      const response = await puterAI.chat(message, {
        model: conversation.model
      });

      let aiResponse: string;
      if (response?.message?.content) {
        if (typeof response.message.content === 'string') {
          aiResponse = response.message.content;
        } else if (Array.isArray(response.message.content)) {
          aiResponse = response.message.content
            .filter((block: MessageBlock): block is MessageBlock => block.type === 'text')
            .map(block => block.text)
            .join('\n');
        } else {
          throw new Error("Unexpected response format from AI");
        }

        // Add AI response
        const finalConvo = addMessage(conversation.id, {
          content: aiResponse,
          role: "assistant",
          timestamp: Date.now(),
          model: conversation.model,
        });

        if (finalConvo) {
          onUpdate(finalConvo);
        }
      } else {
        throw new Error("Invalid response from AI");
      }
    } catch (error) {
      console.error("AI chat error:", error);
      toast({ 
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleLoadChat = (chatId: string) => {
    clearChat();
    onLoadChat?.(chatId);
    setShowHistory(false);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto px-4" ref={ref}>
      <div className="flex-1 relative">
        <div className="chat-messages absolute inset-0 overflow-y-auto p-6 mb-4 border-2 border-black rounded-xl [&::-webkit-scrollbar]:hidden dark:border-white">
          {!isPuterInitialized && !isLoading && (
            <div className="p-4 mb-4 bg-yellow-100 text-yellow-800 rounded-md">
              <h3 className="font-bold">Puter AI Not Connected</h3>
              <p>
                The AI service is not properly connected. Try these steps:
                <br />- Select a different AI model from the dropdown above
                <br />- Refresh the page and try again
              </p>
            </div>
          )}
          
          {[...conversation.messages].reverse().map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              onEdit={(content) => {
                setInputValue(content);
                setUploadedImages([]);
              }}
            />
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground ml-4"
            >
              {model?.name} is typing...
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 pt-4 pb-8 bg-background">
        {uploadedImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt="Uploaded"
                  className="w-16 h-16 object-cover rounded-lg border-2 border-black dark:border-white"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewChat}
            title="New Chat"
            className="bg-background/95 backdrop-blur-sm shadow-sm"
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHistory(true)}
            title="Chat History"
            className="bg-background/95 backdrop-blur-sm shadow-sm"
          >
            <Clock className="h-5 w-5" />
          </Button>

          <div className="flex-1 relative">
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSend}
              disabled={isTyping || isLoading || !isPuterInitialized}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSend}
              disabled={!inputValue.trim() && uploadedImages.length === 0 || isTyping || isLoading || !isPuterInitialized}
              className="absolute right-2 top-1/2 -translate-y-1/2"
              title="Send"
            >
              <Send className="h-5 w-5 text-black dark:text-white" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat History</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                className="w-full p-4 text-left hover:bg-accent rounded-lg mb-2 transition-colors"
                onClick={() => handleLoadChat(chat.id)}
              >
                <div className="font-medium">{chat.title}</div>
                <div className="text-sm text-muted-foreground">
                  {formatTimestamp(chat.timestamp)}
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

ChatContainer.displayName = "ChatContainer";
