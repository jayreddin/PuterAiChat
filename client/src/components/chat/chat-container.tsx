import { useEffect, useRef, forwardRef, useState } from "react";
import { Message, Conversation } from "@shared/schema";
import { usePuter } from "@/contexts/puter-context";
import { ChatBubble } from "./chat-bubble";
import { ChatInput } from "./chat-input";
import { getModelById } from "@/lib/models";
import { addMessage } from "@/lib/storage";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Plus, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

const generateChatTitle = (messages: Message[]): string => {
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (!firstUserMessage) return 'New Chat';
  
  // Take first 40 characters of first message or up to the first newline
  const title = firstUserMessage.content.split('\n')[0].slice(0, 40);
  return title + (title.length >= 40 ? '...' : '');
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

  // Load chat history
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

  const handleNewChat = () => {
    if (conversation.messages.length > 0) {
      // Save current chat to history
      const newHistoryItem = {
        id: conversation.id,
        title: generateChatTitle(conversation.messages),
        timestamp: Date.now()
      };
      
      const updatedHistory = [newHistoryItem, ...chatHistory].slice(0, 20);
      localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
      setChatHistory(updatedHistory);
    }
    
    onNewChat?.();
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

  const handleSend = async (content: string) => {
    if (!isPuterInitialized) {
      toast({
        title: "Chat Not Ready",
        description: "Chat is not ready yet. Please wait a moment and try again.",
        variant: "destructive"
      });
      return;
    }

    // Add user message
    const updatedConvo = addMessage(conversation.id, {
      content,
      role: "user",
      timestamp: Date.now(),
      model: conversation.model,
    });

    if (!updatedConvo) return;
    onUpdate(updatedConvo);

    // Show typing indicator
    setIsTyping(true);

    try {
      if (typeof window !== 'undefined' && window.puter) {
        const response = await window.puter.ai.chat(content, {
          model: conversation.model
        });

        let aiResponse: string;
        if (response?.message?.content) {
          if (typeof response.message.content === 'string') {
            aiResponse = response.message.content;
          } else if (Array.isArray(response.message.content)) {
            aiResponse = response.message.content
              .filter(block => block.type === 'text')
              .map(block => block.text)
              .join('\n');
          } else {
            throw new Error("Unexpected response format from AI");
          }
        } else {
          throw new Error("Invalid response from AI");
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
        throw new Error("Puter is not initialized.");
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
              onEdit={(content) => handleSend(content)}
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

      <div className="flex items-center gap-2 mt-4 mb-8">
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

        <div className="flex-1">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            disabled={isTyping || isLoading || !isPuterInitialized}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (inputValue.trim()) {
              handleSend(inputValue.trim());
              setInputValue("");
            }
          }}
          disabled={!inputValue.trim() || isTyping || isLoading || !isPuterInitialized}
          className="bg-background/95 backdrop-blur-sm shadow-sm"
        >
          <Send className="h-5 w-5" />
        </Button>
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
                onClick={() => {
                  onLoadChat?.(chat.id);
                  setShowHistory(false);
                }}
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

declare global {
  interface Window {
    puter?: {
      init(): Promise<void>;
      ai: {
        chat(message: string, options: { model: string }): Promise<{
          index: number;
          message: {
            role: string;
            content: string | Array<{type: string, text: string}>;
          };
          finish_reason: string;
        }>;
      };
    };
  }
}
