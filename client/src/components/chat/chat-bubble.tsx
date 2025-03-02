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
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      });
    }

    parts.push({
      type: 'code',
      language: match[1] || 'plaintext',
      content: match[2].trim()
    });

    lastIndex = match.index + match[0].length;
  }

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
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-8`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex items-center gap-2 text-sm mb-2 ${
        isUser ? 'text-primary/70' : 'text-muted-foreground'
      }`}>
        <span className="font-medium">{isUser ? 'You' : 'AI'}</span>
        <span className="opacity-60">{format(message.timestamp, 'h:mm a')}</span>
      </div>

      <div className={`
        relative max-w-[85%] rounded-xl p-4 shadow-sm
        ${isUser ? 
          'bg-blue-500 text-white dark:bg-blue-600' : 
          'bg-green-500 text-white dark:bg-green-600'
        }
        ${isUser ? 'ml-8' : 'mr-8'}
      `}>
        {parts.map((part, index) => (
          part.type === 'code' ? (
            <CodeEditor
              key={index}
              value={part.content}
              language={part.language || 'plaintext'}
              onChange={() => {}}
              readOnly={true}
              height="200px"
            />
          ) : (
            <p key={index} className="whitespace-pre-wrap leading-relaxed">
              {part.content}
            </p>
          )
        ))}

        {showActions && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute ${isUser ? 'left-0' : 'right-0'} top-0 -translate-y-full pt-2 flex gap-1`}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 bg-background/95 backdrop-blur-sm shadow-sm"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>

            {isUser && onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(message.content)}
                className="h-8 bg-background/95 backdrop-blur-sm shadow-sm"
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}