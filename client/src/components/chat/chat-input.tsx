import { useRef, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useChat } from "@/contexts/chat-input-context";
import { CodeAttachment } from "./code-attachment";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void; // Changed to accept string
  onSend: () => void;
  disabled?: boolean;
  isDeepThinkActive?: boolean;
  deepThinkModelName?: string;
  codeAttachment?: {
    filename: string;
    language: string;
    content: string;
  } | null;
  onRemoveCodeAttachment?: () => void;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  isDeepThinkActive = false,
  deepThinkModelName,
  codeAttachment,
  onRemoveCodeAttachment,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isMobile) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-background"
    >
      <div className="relative w-full">
        {codeAttachment && (
          <div className="absolute -top-12 sm:-top-14 left-2 sm:left-4 z-10">
            <CodeAttachment
              filename={codeAttachment.filename}
              language={codeAttachment.language}
              onRemove={onRemoveCodeAttachment || (() => {})}
            />
          </div>
        )}

        <div className={cn(
          "flex items-center transition-all duration-300 ease-in-out",
          "py-1.5 sm:py-2 md:py-0",
          codeAttachment ? "mt-10 sm:mt-12" : "mt-0",
          "md:h-[108px]"
        )}>
          <MarkdownEditor
            value={value}
            style={{
              width: '100%',
              minHeight: '48px',
              height: 'auto',
              resize: 'none',
              borderRadius: '0.75rem',
              border: '1px solid var(--border)',
            }}
            config={{
              view: {
                menu: false,
                md: true,
                html: false
              },
              canView: {
                menu: false,
                md: true,
                html: false,
                fullScreen: false,
                hideMenu: true
              },
              markdownClass: 'prose dark:prose-invert max-w-none',
              tableShape: {
                maxRow: 5,
                maxCol: 6
              }
            }}
            placeholder="Type a message or use Markdown..."
            onChange={(val) => onChange(val.text)}
            renderHTML={(text) => Promise.resolve(text)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </motion.div>
  );
}
