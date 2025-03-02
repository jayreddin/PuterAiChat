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
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-1.5`}
    >
      <div className={`flex items-center gap-2 text-xs mb-1 font-medium ${
        isUser ? 'text-black dark:text-white' : 'text-gray-800 dark:text-gray-200'
      }`}>
        <span>{isUser ? 'You' : 'AI'}</span>
        <span className="text-gray-600 dark:text-gray-400">{format(message.timestamp, 'h:mm a')}</span>
      </div>

      <div className={`
        max-w-[85%] rounded-xl p-2 shadow-sm border
        ${isUser ?
          'bg-blue-500 text-white dark:bg-blue-600 border-black dark:border-white' :
          'bg-green-500 text-white dark:bg-green-600 border-black dark:border-white'
        }
        ${isUser ? 'ml-6' : 'mr-6'}
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
            <p key={index} className="whitespace-pre-wrap leading-snug">
              {part.content}
            </p>
          )
        ))}
      </div>

      <div className={`flex gap-1 ${isUser ? 'mr-1' : 'ml-1'} mt-0.5`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-6 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Copy className="h-3.5 w-3.5 text-black dark:text-white" />
        </Button>

        {isUser && onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(message.content)}
            className="h-6 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Edit2 className="h-3.5 w-3.5 text-black dark:text-white" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}