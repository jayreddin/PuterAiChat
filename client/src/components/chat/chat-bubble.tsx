import { Message } from "@shared/schema";
import { cn } from "@/lib/utils";
import { memo, useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ImagePreviewModal } from "./image-preview-modal";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatBubbleProps {
  message: Message;
  onEdit?: (content: string) => void;
}

const parseMessageContent = (content: string): { text: string; imageUrls: string[] } => {
  const imageUrlPattern = /\[Image Context:[^\]]*\]\s*\((https?:\/\/[^\s)]+)\)/g;
  const imageUrls: string[] = [];
  let matches;

  // Extract image URLs
  while ((matches = imageUrlPattern.exec(content)) !== null) {
    imageUrls.push(matches[1]);
  }

  // Remove image markdown from text
  const text = content.replace(/\[Image Context:[^\]]*\]\s*\([^)]+\)/g, '').trim();

  return { text, imageUrls };
};

export const ChatBubble = memo(({ message, onEdit }: ChatBubbleProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const isUser = message.role === "user";
  const { text, imageUrls } = parseMessageContent(message.content);

  return (
    <div
      className={cn(
        "group flex w-full",
        isUser ? "justify-end" : "justify-start",
        "mb-6"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative flex max-w-[85%] sm:max-w-[75%] flex-col gap-2",
          isUser ? "items-end" : "items-start"
        )}
      >
        {imageUrls.length > 0 && (
          <div className={cn(
            "grid gap-2",
            imageUrls.length > 1 ? "grid-cols-2" : "grid-cols-1",
            "w-full max-w-sm mb-2"
          )}>
            {imageUrls.map((url, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className="block w-full p-0 border-none bg-transparent cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-auto rounded-lg border-2 border-black dark:border-white"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        <div
          className={cn(
            "relative rounded-lg px-3 py-2 text-sm",
            "transition-colors duration-200",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted",
            isMobile ? "text-sm" : "text-base"
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="my-1">{children}</p>,
              h1: ({ children }) => <h1 className="text-2xl font-bold my-3">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-bold my-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-bold my-2">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc ml-4 my-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal ml-4 my-2">{children}</ol>,
              li: ({ children }) => <li className="my-1">{children}</li>,
              code: ({ node, inline, className, children, ...props }) => (
                inline ?
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props}>{children}</code> :
                <div className="my-2 rounded-lg bg-muted p-2 text-sm font-mono">
                  <code className="text-sm" {...props}>{children}</code>
                </div>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 my-2 italic">{children}</blockquote>
              ),
              a: ({ children, href }) => (
                <a href={href} target="_blank" rel="noopener noreferrer"
                   className="text-primary hover:underline">{children}</a>
              ),
              pre: ({ children }) => <pre className="overflow-auto">{children}</pre>,
              em: ({ children }) => <em className="italic">{children}</em>,
              strong: ({ children }) => <strong className="font-bold">{children}</strong>,
              hr: () => <hr className="my-4 border-muted" />,
              table: ({ children }) => (
                <div className="my-4 overflow-x-auto">
                  <table className="min-w-full border-collapse">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
              tbody: ({ children }) => <tbody>{children}</tbody>,
              tr: ({ children }) => <tr className="border-b border-muted">{children}</tr>,
              th: ({ children }) => <th className="p-2 text-left font-semibold">{children}</th>,
              td: ({ children }) => <td className="p-2">{children}</td>,
            }}
          >
            {text}
          </ReactMarkdown>
        </div>

        {onEdit && isUser && (isHovered || isMobile) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(message.content)}
            className={cn(
              "absolute -left-10 top-0",
              "opacity-0 group-hover:opacity-100",
              isMobile && "opacity-100",
              "touch-manipulation"
            )}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>

      {imageUrls.length > 0 && selectedImageIndex !== null && (
        <ImagePreviewModal
          images={imageUrls}
          initialIndex={selectedImageIndex}
          open={true}
          onClose={() => setSelectedImageIndex(null)}
        />
      )}
    </div>
  );
});

ChatBubble.displayName = "ChatBubble";