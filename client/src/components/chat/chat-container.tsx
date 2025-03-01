import { useEffect, useRef, useState } from "react";
import { Message, Conversation } from "@shared/schema";
import { ChatBubble } from "./chat-bubble";
import { ChatInput } from "./chat-input";
import { getModelById } from "@/lib/models";
import { addMessage } from "@/lib/storage";
import { motion } from "framer-motion";

interface ChatContainerProps {
  conversation: Conversation;
  onUpdate: (conversation: Conversation) => void;
}

export function ChatContainer({ conversation, onUpdate }: ChatContainerProps) {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const model = getModelById(conversation.model);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSend = async (content: string) => {
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
      // Call Puter AI API
      const response = await puter.ai.chat(content, {
        model: conversation.model
      });
      
      // Add AI response
      const finalConvo = addMessage(conversation.id, {
        content: response.text,
        role: "assistant",
        timestamp: Date.now(),
        model: conversation.model,
      });
      
      if (finalConvo) {
        onUpdate(finalConvo);
      }
    } catch (error) {
      console.error("AI chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEdit = (messageContent: string) => {
    handleSend(messageContent);
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
        disabled={isTyping}
      />
    </div>
  );
}
