import { Message } from "@shared/schema";
import { motion } from "framer-motion";
import { Copy, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { CodeEditor } from "./code-editor";

interface ChatBubbleProps {
  message: Message;
  onEdit?: (content: string) => void;
}

function detectCodeBlocks(content: string) {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts: Array<{ type: 'text' | 'code', content: string, language?: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block if any
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      });
    }

    // Add code block
    parts.push({
      type: 'code',
      language: match[1] || 'plaintext',
      content: match[2].trim()
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text if any
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex)
    });
  }

  return parts;
}

export function ChatBubble({ message, onEdit }: ChatBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const isUser = message.role === "user";
  const parts = detectCodeBlocks(message.content);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content);
    toast({
      description: "Message copied to clipboard",
      duration: 2000
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        <span>{format(message.timestamp, 'h:mm a')}</span>
        <span>{isUser ? 'You' : 'AI'}</span>
      </div>

      <div className={`
        max-w-[80%] rounded-lg p-4
        ${isUser ? 
          'bg-primary text-primary-foreground ml-8' : 
          'bg-muted text-muted-foreground mr-8'
        }
      `}>
        {parts.map((part, index) => (
          part.type === 'code' ? (
            <CodeEditor
              key={index}
              value={part.content}
              language={part.language}
              readOnly={true}
            />
          ) : (
            <p key={index} className="whitespace-pre-wrap">{part.content}</p>
          )
        ))}
      </div>

      {showActions && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 mt-2"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>

          {isUser && onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(message.content)}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}