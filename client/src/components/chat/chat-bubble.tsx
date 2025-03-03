import { Message } from "@shared/schema";
import { cn } from "@/lib/utils";
import { memo, useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ImagePreviewModal } from "./image-preview-modal";

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
          {text.split("\n").map((line, i) => (
            <p key={i} className={cn(line.trim() === "" && "h-4")}>
              {line}
            </p>
          ))}
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