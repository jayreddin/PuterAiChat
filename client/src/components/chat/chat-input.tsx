import { useState, useRef, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { CodeInputDialog } from "./code-input-dialog";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCodeInsert = (code: string) => {
    setMessage(prev => {
      const position = textareaRef.current?.selectionStart || prev.length;
      return prev.slice(0, position) + code + prev.slice(position);
    });
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-16 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4 z-10"
    >
      <div className="max-w-3xl mx-auto flex gap-2">
        <CodeInputDialog onInsert={handleCodeInsert} />
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Shift + Enter for new line)"
          className="resize-none min-h-[50px] max-h-[200px]"
          disabled={disabled}
        />
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || disabled}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}