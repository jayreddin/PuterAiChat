import { Message } from "@shared/schema";
import { motion } from "framer-motion";
import { Copy, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { CodeEditor } from "./code-editor";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
      className={cn(
        "flex flex-col mb-3 sm:mb-1.5",
        isUser ? 'items-end' : 'items-start'
      )}
    >
      <div className={cn(
        "flex items-center gap-2 text-[11px] sm:text-xs mb-1 font-medium px-1",
        isUser ? 'text-black dark:text-white' : 'text-gray-800 dark:text-gray-200'
      )}>
        <span>{isUser ? 'You' : 'AI'}</span>
        <span className="text-gray-600 dark:text-gray-400">
          {format(message.timestamp, 'h:mm a')}
        </span>
      </div>

      <div className={cn(
        "max-w-[90%] sm:max-w-[85%] rounded-xl",
        "p-2.5 sm:p-3 shadow-sm border-2",
        "text-[15px] sm:text-base leading-relaxed",
        isUser ? [
          'bg-blue-500 text-white dark:bg-blue-600',
          'border-black dark:border-white',
          'ml-4 sm:ml-6'
        ] : [
          'bg-green-500 text-white dark:bg-green-600',
          'border-black dark:border-white',
          'mr-4 sm:mr-6'
        ]
      )}>
        {parts.map((part, index) => (
          part.type === 'code' ? (
            <div key={index} className="my-2 first:mt-0 last:mb-0">
              <CodeEditor
                value={part.content}
                language={part.language || 'plaintext'}
                onChange={() => {}}
                readOnly={true}
                height="auto"
                minHeight="100px"
                maxHeight="400px"
                className="text-[13px] sm:text-sm rounded-md"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  fontSize: isMobile ? 12 : 14,
                  lineHeight: isMobile ? 1.4 : 1.5,
                  padding: { top: 8, bottom: 8 }
                }}
              />
            </div>
          ) : (
            <p key={index} className={cn(
              "whitespace-pre-wrap",
              "leading-relaxed",
              "first:mt-0 last:mb-0",
              "my-1"
            )}>
              {part.content}
            </p>
          )
        ))}
      </div>

      <div className={cn(
        "flex gap-1 mt-1",
        isUser ? 'mr-1 sm:mr-2' : 'ml-1 sm:ml-2'
      )}>
        <Button
          variant="ghost"
          size={isMobile ? "default" : "sm"}
          onClick={copyToClipboard}
          className={cn(
            "h-8 sm:h-6",
            "px-2.5 sm:px-1.5",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "touch-manipulation"
          )}
        >
          <Copy className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-black dark:text-white" />
        </Button>

        {isUser && onEdit && (
          <Button
            variant="ghost"
            size={isMobile ? "default" : "sm"}
            onClick={() => onEdit(message.content)}
            className={cn(
              "h-8 sm:h-6",
              "px-2.5 sm:px-1.5",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              "touch-manipulation"
            )}
          >
            <Edit2 className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-black dark:text-white" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}