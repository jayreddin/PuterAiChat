import { Mic, Send, Square, Plus, History, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import type { ButtonProps } from "@/components/ui/button";

export interface InputButtonsProps {
  onSend?: () => void;
  onMicInput?: (text: string) => void;
  onNewChat?: () => void;
  onHistory?: () => void;
  onImageUpload?: () => void;
  sendDisabled?: boolean;
  placement?: "left" | "right";
  isDeepThinkActive?: boolean;
  onDeepThinkToggle?: () => void;
}

export function InputButtons({
  onSend,
  onMicInput,
  onNewChat,
  onHistory,
  onImageUpload,
  sendDisabled,
  placement = "right",
  isDeepThinkActive,
  onDeepThinkToggle
}: InputButtonsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const {
    startRecording,
    stopRecording,
    isSupported: isSpeechSupported
  } = useSpeechRecognition({
    onResult: (text) => {
      setIsRecording(false);
      onMicInput?.(text);
    },
    onError: (error) => {
      console.error('Speech recognition error:', error);
      setIsRecording(false);
    }
  });

  const handleMicClick = useCallback(() => {
    if (isRecording) {
      stopRecording();
      setIsRecording(false);
    } else {
      startRecording();
      setIsRecording(true);
    }
  }, [isRecording, startRecording, stopRecording]);

  const baseButtonProps: ButtonProps = {
    size: "icon",
    variant: "ghost",
    className: "touch-manipulation"
  };

  const renderLeftButtons = () => (
    <>
      <Button
        {...baseButtonProps}
        onClick={onNewChat}
        className={cn(baseButtonProps.className, "hover:bg-accent")}
      >
        <Plus className="h-5 w-5" />
      </Button>
      <Button
        {...baseButtonProps}
        onClick={onHistory}
        className={cn(baseButtonProps.className, "hover:bg-accent")}
      >
        <History className="h-5 w-5" />
      </Button>
      <Button
        {...baseButtonProps}
        onClick={onImageUpload}
        className={cn(baseButtonProps.className, "hover:bg-accent")}
      >
        <Image className="h-5 w-5" />
      </Button>
    </>
  );

  const renderRightButtons = () => (
    <>
      {isSpeechSupported && (
        <Button
          {...baseButtonProps}
          onClick={handleMicClick}
          className={cn(
            baseButtonProps.className,
            "hover:bg-accent",
            isRecording && "bg-red-500 hover:bg-red-600 text-white"
          )}
        >
          {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
      )}
      <Button
        {...baseButtonProps}
        onClick={onSend}
        disabled={sendDisabled}
        className={cn(
          baseButtonProps.className,
          "hover:bg-accent",
          isDeepThinkActive && "bg-yellow-500/10 hover:bg-yellow-500/20"
        )}
      >
        <Send className="h-5 w-5" />
      </Button>
    </>
  );

  return (
    <div className={cn(
      "flex items-center gap-1",
      placement === "right" ? "justify-end" : "justify-start"
    )}>
      {placement === "left" ? renderLeftButtons() : renderRightButtons()}
    </div>
  );
}