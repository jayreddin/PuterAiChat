import React, { useState } from "react";
import { CodeAttachment } from "./code-input-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useChatInput } from "@/contexts/chat-input-context";
import { cn } from "@/lib/utils";

// Renamed to avoid potential conflicts
export const CodeAttachmentsList = () => {
  const { codeAttachments, removeCodeAttachment, openCodeEditor } = useChatInput();

  if (!codeAttachments || codeAttachments.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 pb-2">
      {codeAttachments.map((attachment, index) => (
        <div 
          key={index}
          className="flex items-center gap-1 bg-secondary p-1 rounded cursor-pointer"
          onClick={() => openCodeEditor(attachment, index)}
        >
          <div className="text-xs font-mono truncate max-w-[150px]">
            {attachment.language}: {attachment.code.substring(0, 20)}...
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 w-5 p-0"
            onClick={(e) => {
              e.stopPropagation();
              removeCodeAttachment(index);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};

interface CodeAttachmentProps {
  attachment: CodeAttachment;
  index: number;
}

export function CodeAttachmentItem({ attachment, index }: CodeAttachmentProps) {
  const { removeCodeAttachment, editCodeAttachment } = useChatInput();
  const [isExpanded, setIsExpanded] = useState(false);

  // Get a preview of the code (first 2 lines)
  const getPreview = () => {
    const lines = attachment.code.split('\n');
    if (lines.length <= 2) return attachment.code;
    return lines.slice(0, 2).join('\n') + (lines.length > 2 ? '...' : '');
  };

  return (
    <div className="relative group rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2 mb-2">
      <div 
        className="flex items-center cursor-pointer" 
        onClick={() => {
          if (!isExpanded) {
            editCodeAttachment(index);
          } else {
            setIsExpanded(false);
          }
        }}
      >
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded">
              {attachment.language}
            </span>
            <span className="text-xs text-zinc-500">
              Click to {isExpanded ? 'collapse' : 'edit'}
            </span>
          </div>

          <pre 
            className={cn(
              "font-mono text-sm mt-1 overflow-x-auto",
              isExpanded ? "max-h-32" : "max-h-10"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <code>{isExpanded ? attachment.code : getPreview()}</code>
          </pre>
        </div>
      </div>

      <Button
        variant="ghost" 
        size="icon" 
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          removeCodeAttachment(index);
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}