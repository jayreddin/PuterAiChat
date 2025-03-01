import React, { useRef, useEffect, useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { UtilityBar } from "./utility-bar";
import { useChatInput } from "@/contexts/chat-input-context";
import { CodeAttachmentsList } from "./code-attachment";

interface ChatInputProps {
  onSend: (message: string) => void;
  isThinking?: boolean;
}

export function ChatInput({ onSend, isThinking = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { codeAttachments, clearCodeAttachments } = useChatInput();

  useEffect(() => {
    // Focus the textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSend = () => {
    if ((message.trim() || codeAttachments.length > 0) && !isThinking) {
      // Format code blocks to include in the message
      let finalMessage = message;

      // Append code blocks to the message
      if (codeAttachments.length > 0) {
        codeAttachments.forEach(attachment => {
          finalMessage += `\n\n\`\`\`${attachment.language}\n${attachment.code}\n\`\`\``;
        });
      }

      onSend(finalMessage);
      setMessage("");
      clearCodeAttachments();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
      <div className="flex items-end gap-2">
        <div className="flex-grow border border-input bg-background hover:border-zinc-400 dark:hover:border-zinc-600 transition rounded-md">
          <UtilityBar />
          <div className="px-3 pt-2">
            <CodeAttachmentList />
          </div>
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-10 resize-none border-0 bg-transparent p-3 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button
          size="icon"
          onClick={handleSend}
          disabled={(message.trim() === "" && (codeAttachments?.length === 0 || !codeAttachments)) || isThinking}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}