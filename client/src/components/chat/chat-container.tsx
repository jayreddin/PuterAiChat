import { useEffect, useRef, useState } from "react";
import { Message, Conversation } from "@shared/schema";
import { ChatBubble } from "./chat-bubble";
import { ChatInput } from "./chat-input";
import { getModelById } from "@/lib/models";
import { addMessage } from "@/lib/storage";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
// Added import for DialogFooter (placeholder)
import { DialogFooter } from "./DialogFooter"; // Placeholder import


interface ChatContainerProps {
  conversation: Conversation;
  onUpdate: (conversation: Conversation) => void;
}

export function ChatContainer({ conversation, onUpdate }: ChatContainerProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [isPuterInitialized, setIsPuterInitialized] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const model = getModelById(conversation.modelId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  // Safety function to check Puter availability
  const isPuterAvailable = () => {
    return typeof window !== "undefined" &&
      typeof window.puter !== "undefined" &&
      typeof window.puter.ai !== "undefined" &&
      typeof window.puter.ai.chat === "function";
  };

  // Initialize on mount with a safety check
  useEffect(() => {
    setIsPuterInitialized(isPuterAvailable());
  }, []);

  useEffect(() => {
    const checkPuter = setInterval(() => {
      console.log('Checking Puter availability:', {
        exists: !!window.puter,
        properties: window.puter ? Object.keys(window.puter) : 'not loaded'
      });

      // Check not just if puter exists, but also if it has the ai property and chat method
      if (window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function') {
        clearInterval(checkPuter);
        setIsPuterInitialized(true);
        console.log('Puter is ready to use');
      }
    }, 500); // Check more frequently

    // If Puter hasn't initialized after 8 seconds, show a toast warning
    const timeout = setTimeout(() => {
      if (!isPuterInitialized) {
        toast({
          title: "Puter initialization delay",
          description: "The AI service is taking longer than expected to initialize. Try selecting a different model and then back to your desired model.",
          variant: "warning"
        });
      }
    }, 8000);

    return () => {
      clearInterval(checkPuter);
      clearTimeout(timeout);
    };
  }, [isPuterInitialized]);

  const handleSend = async (content: string) => {
    // Check if Puter is initialized and has the required ai.chat method
    if (!isPuterInitialized || !window.puter || !window.puter.ai || typeof window.puter.ai.chat !== 'function') {
      try {
        // Make sure Puter script is loaded before trying to use it
        if (typeof window.puter === 'undefined') {
          // Load Puter script dynamically if it's not available
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://js.puter.com/v2/';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
          // Wait a moment for initialization
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Check again after loading
        if (window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function') {
          setIsPuterInitialized(true);
        } else {
          throw new Error("Puter AI service not available");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Chat service is not available. Please refresh the page and try again.",
          variant: "destructive"
        });
        return;
      }
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
      console.log('Sending chat request:', {
        model: conversation.model,
        content
      });

      // Call Puter AI API
      const response = await window.puter.ai.chat(content, {
        model: conversation.model
      });

      console.log('Received response:', response);

      // Extract the AI's response text based on the model's response format
      let aiResponse: string;
      if (response?.message?.content) {
        // Handle simple string content
        if (typeof response.message.content === 'string') {
          aiResponse = response.message.content;
        }
        // Handle array of content blocks (Claude format)
        else if (Array.isArray(response.message.content)) {
          aiResponse = response.message.content
            .filter(block => block.type === 'text')
            .map(block => block.text)
            .join('\n');
        }
        else {
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

  const handleEdit = (messageContent: string, messageId: string) => {
    // Find the index of the message being edited
    const messageIndex = conversation.messages.findIndex(msg => msg.id === messageId);

    if (messageIndex !== -1) {
      // Create a new conversation with messages only up to the edited message
      const trimmedMessages = conversation.messages.slice(0, messageIndex + 1);
      onUpdate({
        ...conversation,
        messages: trimmedMessages
      });

      // Set the message content to be edited
      setEditingMessage(messageContent);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {conversation.messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            onEdit={message.role === "user" ? handleEdit : undefined}
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

      <ChatInput
        onSend={handleSend}
        disabled={isTyping || !isPuterInitialized}
        editingMessage={editingMessage}
        onMessageUsed={() => setEditingMessage(null)}
      />
      {/* Added placeholder for CodeAttachmentsList  */}
      <CodeAttachmentsList /> {/* Placeholder component */}
      {/* Added placeholder for DialogFooter */}
      <DialogFooter /> {/* Placeholder component */}

    </div>
  );
}

// Add TypeScript declaration for Puter
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

// Placeholder components
const CodeAttachmentsList = () => <div>CodeAttachmentsList Placeholder</div>;