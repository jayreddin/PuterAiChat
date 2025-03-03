import { useEffect, useRef, forwardRef, useState, useCallback } from "react";
import { Message, Conversation } from "@shared/schema";
import { InputButtons } from "./input-buttons";
import { usePuter } from "@/contexts/puter-context";
import { ChatBubble } from "./chat-bubble";
import { ChatInput } from "./chat-input";
import { getModelById } from "@/lib/models";
import { ModelIndicator } from "./model-indicator";
import { addMessage } from "@/lib/storage";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { MessageBlock, ImageDescription, PuterAPI } from "@/types/puter";
import type { CodeAttachment } from "./utility-bar";
import { cn } from "@/lib/utils";

interface ChatContainerProps {
  conversation: Conversation;
  onUpdate: (conversation: Conversation) => void;
  onNewChat?: () => void;
  onLoadChat?: (conversationId: string) => void;
  codeAttachment?: CodeAttachment | null;
  onRemoveCodeAttachment?: () => void;
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

const extractReasoningContext = (model: string, message: string): string | null => {
  // Extract reasoning context based on model
  if (message.includes("Let me think about this step by step:") ||
      message.includes("Let me analyze this systematically:")) {
    return message;
  }
  return null;
};

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
  onLoadChat,
  codeAttachment,
  onRemoveCodeAttachment 
}, ref) => {
  const [isTyping, setIsTyping] = useState(false);
  const [reasoningContext, setReasoningContext] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [deepThinkModelId, setDeepThinkModelId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const model = getModelById(conversation.model) || { name: "AI Assistant" };
  const { isInitialized: isPuterInitialized, isLoading } = usePuter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
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
    onRemoveCodeAttachment?.();
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

  const handleDeepThinkToggle = useCallback(() => {
    setDeepThinkModelId(null);
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() && uploadedImages.length === 0 && !codeAttachment) return;
    
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

    // Add code attachment if present
    if (codeAttachment) {
      message = `[Code File: ${codeAttachment.filename}]\n\`\`\`${codeAttachment.language}\n${codeAttachment.content}\n\`\`\`\n\n${message}`;
    }
  
    // Check for deep think format and extract model
    const deepThinkMatch = message.match(/<deep-think model="([^"]+)">/);
    if (deepThinkMatch) {
      const modelId = deepThinkMatch[1];
      setDeepThinkModelId(modelId);
      console.log('Deep think model ID set:', modelId);
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
    onRemoveCodeAttachment?.(); // Clear code attachment after sending

    // Show typing indicator
    setIsTyping(true);

    try {
      let aiResponse: string = '';
      
      // Handle streaming models
      if ('isStreaming' in model && model.isStreaming) {
        const response = await puterAI.chat(message, {
          model: conversation.model,
          onProgress: (progress) => {
            if (progress) {
              aiResponse += progress;
              const reasoning = extractReasoningContext(conversation.model, aiResponse);
              if (reasoning) {
                setReasoningContext(reasoning);
              }
            }
          }
        });
        
        // Extract final response if available
        if (response?.message?.content) {
          aiResponse = typeof response.message.content === 'string'
            ? response.message.content
            : Array.isArray(response.message.content)
              ? response.message.content
                  .filter((block: MessageBlock): block is MessageBlock => block.type === 'text')
                  .map(block => block.text)
                  .join('\n')
              : aiResponse;
        }
      }
      // Handle image-capable models
      else if (uploadedImages.length > 0 && (conversation.model === 'o1-mini' || conversation.model === 'gpt-4o-mini')) {
        const messages = [
          {
            role: "user",
            content: [
              { type: "text", text: message },
              ...uploadedImages.map(img => ({
                type: "image_url",
                image_url: { url: img.url }
              }))
            ]
          }
        ];

        const response = await puterAI.chat(JSON.stringify(messages), {
          model: conversation.model
        });

        if (response?.message?.content) {
          aiResponse = typeof response.message.content === 'string'
            ? response.message.content
            : Array.isArray(response.message.content)
              ? response.message.content
                  .filter((block: MessageBlock): block is MessageBlock => block.type === 'text')
                  .map(block => block.text)
                  .join('\n')
              : '';
        }
      }
      // Handle standard models
      else {
        const response = await puterAI.chat(message, {
          model: conversation.model,
          onProgress: (progress) => {
            if (progress && typeof progress === 'string') {
              const reasoning = extractReasoningContext(conversation.model, progress);
              if (reasoning) {
                setReasoningContext(reasoning);
              }
            }
          }
        });

        if (response?.message?.content) {
          aiResponse = typeof response.message.content === 'string'
            ? response.message.content
            : Array.isArray(response.message.content)
              ? response.message.content
                  .filter((block: MessageBlock): block is MessageBlock => block.type === 'text')
                  .map(block => block.text)
                  .join('\n')
              : '';
        }
      }

      if (!aiResponse) {
        throw new Error("No response content from AI");
      }

      // Add AI response
      const finalConvo = addMessage(conversation.id, {
        content: aiResponse,
        role: "assistant",
        timestamp: Date.now(),
        model: conversation.model,
      });

      if (finalConvo) {
        setReasoningContext(null);  // Clear reasoning context before showing final response
        onUpdate(finalConvo);
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

  const isDeepThinkActive = deepThinkModelId === conversation.model;
  const deepThinkModelName = isDeepThinkActive ? (getModelById(deepThinkModelId)?.name || undefined) : undefined;

  const handleExampleSelect = useCallback((example: string) => {
    setInputValue(example);
  }, [setInputValue]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto px-4" ref={ref}>
      <div className="flex-1 relative">
        <div className="chat-messages absolute inset-0 overflow-y-auto p-6 mb-4 border-2 border-black rounded-xl [&::-webkit-scrollbar]:hidden dark:border-white">
          {!isPuterInitialized && !isLoading ? (
            <div className="p-4 mb-4 bg-yellow-100 text-yellow-800 rounded-md">
              <h3 className="font-bold">Puter AI Not Connected</h3>
              <p>
                The AI service is not properly connected. Try these steps:
                <br />- Select a different AI model from the dropdown above
                <br />- Refresh the page and try again
              </p>
            </div>
          ) : null}
          
          {conversation.messages.slice().reverse().map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              onEdit={(content) => {
                setInputValue(content);
                setUploadedImages([]);
                onRemoveCodeAttachment?.();
              }}
            />
          ))}

          <AnimatePresence>
            {isTyping && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-muted-foreground ml-4"
                >
                  {model?.name} is thinking...
                </motion.div>
                {reasoningContext && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.7, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="ml-4 mt-2 p-4 rounded-lg bg-muted/50"
                  >
                    <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                      {reasoningContext}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Moved ModelIndicator here */}
      {isDeepThinkActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full mb-2 flex justify-center"
        >
          <ModelIndicator modelId={deepThinkModelId} />
        </motion.div>
      )}

      <div className="sticky bottom-0 pt-2 pb-4 bg-background">
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

        <div className="flex flex-col md:flex-row gap-2 mb-4 transition-all duration-300 ease-in-out">
          {/* Left buttons */}
          <div>
            <InputButtons
              onNewChat={handleNewChat}
              onHistory={() => setShowHistory(true)}
              placement="left"
            />
          </div>

          {/* Main input */}
          <div className="flex-1">
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSend}
              disabled={isTyping || isLoading || !isPuterInitialized}
              isDeepThinkActive={isDeepThinkActive}
              deepThinkModelName={deepThinkModelName}
              codeAttachment={codeAttachment}
              onRemoveCodeAttachment={onRemoveCodeAttachment}
            />
          </div>

          {/* Right buttons */}
          <div>
            <InputButtons
              onSend={handleSend}
              onMicInput={(text) => setInputValue(text)}
              sendDisabled={!inputValue.trim() && uploadedImages.length === 0 && !codeAttachment || isTyping || isLoading || !isPuterInitialized}
              placement="right"
              isDeepThinkActive={isDeepThinkActive}
              onDeepThinkToggle={handleDeepThinkToggle}
            />
          </div>
        </div>
      </div>

      {/* Dialog remains the same */}
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
