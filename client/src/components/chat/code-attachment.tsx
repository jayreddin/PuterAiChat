import { memo } from "react";
import { X, File } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeAttachmentProps {
  filename: string;
  language: string;
  onRemove: () => void;
}

export const CodeAttachment = memo(({
  filename,
  language,
  onRemove,
}: CodeAttachmentProps) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg border">
      <File className="h-4 w-4 text-muted-foreground" />
      <div className="flex flex-col">
        <span className="text-sm font-medium truncate max-w-[150px]">
          {filename}
        </span>
        <span className="text-xs text-muted-foreground">
          {language}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 rounded-full ml-1 hover:bg-destructive hover:text-destructive-foreground"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
});

CodeAttachment.displayName = "CodeAttachment";