import { useEffect, useRef, forwardRef, useState } from "react";
import { Message, Conversation } from "@shared/schema";
import { usePuter } from "@/contexts/puter-context";
import { ChatBubble } from "./chat-bubble";
import { ChatInput } from "./chat-input";
import { getModelById } from "@/lib/models";
import { addMessage } from "@/lib/storage";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface ChatContainerProps {
  conversation: Conversation;
  onUpdate: (conversation: Conversation) => void;
}

export const ChatContainer = forwardRef<HTMLDivElement, ChatContainerProps>(({ conversation, onUpdate }, ref) => {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const model = getModelById(conversation.model) || { name: "AI Assistant" };
  const { isInitialized: isPuterInitialized, isLoading } = usePuter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

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
    console.log('Adding user message to conversation:', content);
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
      console.log('Sending chat request to Puter AI:', {
        model: conversation.model,
        content,
        puterAvailable: !!window.puter
      });

      // Call Puter AI API - Added check for window.puter
      if (typeof window !== 'undefined' && window.puter) {
        const response = await window.puter.ai.chat(content, {
          model: conversation.model
        });
        console.log('Received AI response:', response);

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
      } else {
        console.error("Puter is not initialized.");
        toast({ 
          title: "Error",
          description: "Puter AI is not available. Please try again later.",
          variant: "destructive"
        });
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

  const handleEdit = (messageContent: string) => {
    handleSend(messageContent);
  };

  return (
    <div className="flex flex-col h-full" ref={ref}>
      <div className="flex-1 overflow-y-auto p-4 pb-24">
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
        disabled={isTyping || isLoading || !isPuterInitialized}
      />
    </div>
  );
});

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
