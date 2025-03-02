import { Plus, Clock, Send, Mic, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface InputButtonsProps {
  onNewChat?: () => void;
  onHistory?: () => void;
  onSend?: () => void;
  onMicInput?: (text: string) => void;
  onDeepThinkToggle?: () => void;
  sendDisabled?: boolean;
  placement: "left" | "right";
  isDeepThinkActive?: boolean;
}

export function InputButtons({
  onNewChat,
  onHistory,
  onSend,
  onMicInput,
  onDeepThinkToggle,
  sendDisabled,
  placement,
  isDeepThinkActive = false
}: InputButtonsProps) {
  const handleResult = useCallback((transcript: string) => {
    onMicInput?.(transcript);
  }, [onMicInput]);

  const handleEnd = useCallback(() => {
    toast({
      description: "Voice input completed",
      duration: 2000
    });
  }, []);

  const {
    isListening,
    isSupported,
    start,
    stop,
    error
  } = useSpeechRecognition({
    onResult: handleResult,
    onEnd: handleEnd
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Speech Recognition Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error]);

  const handleMicClick = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      stop();
    } else {
      try {
        await start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  return (
    <div className="flex md:h-[108px] gap-2 transition-all duration-300 ease-in-out">
      <div className="flex md:flex-col gap-1 transition-all duration-300 ease-in-out">
        {placement === "left" && (
          <>
            {onNewChat && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onNewChat}
                title="New Chat"
                className="flex-1 bg-background shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-transform duration-150"
              >
                <Plus className="h-5 w-5 text-black dark:text-white" />
              </Button>
            )}
            {onHistory && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onHistory}
                title="Chat History"
                className="flex-1 bg-background shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-transform duration-150"
              >
                <Clock className="h-5 w-5 text-black dark:text-white" />
              </Button>
            )}
          </>
        )}

        {placement === "right" && (
          <>
            {onDeepThinkToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDeepThinkToggle}
                title={isDeepThinkActive ? "Disable Deep Think" : "Deep Think"}
                className={cn(
                  "flex-1 bg-background shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-transform duration-150",
                  isDeepThinkActive && "bg-primary/20 dark:bg-primary/40"
                )}
              >
                <Brain 
                  className={cn(
                    "h-5 w-5",
                    isDeepThinkActive 
                      ? "text-primary" 
                      : "text-black dark:text-white"
                  )} 
                />
              </Button>
            )}
            {onSend && (
              <Button
                variant="ghost"
                size="icon"
                onClick={sendDisabled ? undefined : onSend}
                disabled={sendDisabled}
                title="Send"
                className={cn(
                  "flex-1 bg-background shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-transform duration-150",
                  "disabled:opacity-100"
                )}
              >
                <Send className="h-5 w-5 text-black dark:text-white" strokeWidth={2.5} />
              </Button>
            )}
            {onMicInput && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMicClick}
                title="Voice Input"
                className={cn(
                  "flex-1 bg-background shadow-sm dark:hover:bg-gray-800",
                  isListening && "animate-pulse bg-red-500/20 dark:bg-red-500/40"
                )}
              >
                <Mic className={cn(
                  "h-5 w-5 text-black dark:text-white",
                  isListening && "text-red-500 dark:text-red-400"
                )} />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}