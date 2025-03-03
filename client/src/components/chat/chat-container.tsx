import { useEffect, useRef } from "react";
import { Message } from "@shared/schema";
import { ChatBubble } from "./chat-bubble";
import { cn } from "@/lib/utils";
import { ImageUploadDialog } from "./image-upload-dialog";
import { toast } from "@/hooks/use-toast";
import { usePuter } from "../../contexts/puter-context";

interface ChatContainerProps {
  messages: Message[];
  onEdit?: (index: number, content: string) => void;
  className?: string;
  isImageUploadOpen?: boolean;
  onImageUploadClose?: () => void;
  onImageUpload?: (url: string) => void;
}

export function ChatContainer({
  messages,
  onEdit,
  className,
  isImageUploadOpen = false,
  onImageUploadClose,
  onImageUpload
}: ChatContainerProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const { isInitialized: isPuterInitialized } = usePuter();

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleImageUpload = (images: Array<{ id: string; url: string }>) => {
    if (!onImageUpload) return;

    images.forEach(({ url }) => {
      onImageUpload(`[Image Context: User uploaded image](${url})`);
    });

    if (onImageUploadClose) {
      onImageUploadClose();
    }
  };

  const handleUploadError = () => {
    toast({
      description: "Failed to upload image. Please try again.",
      variant: "destructive"
    });
  };

  return (
    <div className={cn("flex-1 overflow-y-auto p-4", className)}>
      <div className="max-w-4xl mx-auto">
        {messages.map((message, index) => (
          <ChatBubble
            key={index}
            message={message}
            onEdit={
              onEdit
                ? (content) => onEdit(index, content)
                : undefined
            }
          />
        ))}
        <div ref={endRef} />
      </div>

      {isPuterInitialized && (
        <ImageUploadDialog
          open={isImageUploadOpen}
          onClose={() => onImageUploadClose?.()}
          onUpload={handleImageUpload}
        />
      )}
    </div>
  );
}
