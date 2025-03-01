import { useRef, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CodeEditorProps {
  value: string;
  language?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({ value, language = "typescript", onChange, readOnly = false }: CodeEditorProps) {
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);

    if (copyButtonRef.current) {
      copyButtonRef.current.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      setTimeout(() => {
        if (copyButtonRef.current) {
          copyButtonRef.current.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        }
      }, 2000);
    }

    toast({
      description: "Code copied to clipboard",
      duration: 2000
    });
  };

  return (
    <div className="relative rounded-md border my-4 bg-background shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="text-sm text-muted-foreground capitalize">{language}</div>
        <Button
          ref={copyButtonRef}
          variant="ghost"
          size="icon"
          onClick={handleCopy}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        <Editor
          height="200px"
          defaultLanguage={language}
          defaultValue={value}
          value={value}
          onChange={value => onChange?.(value || '')}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            readOnly,
            lineNumbers: "on",
            renderLineHighlight: "all",
            quickSuggestions: false,
            contextmenu: false,
            tabSize: 2,
            theme: "vs-dark"
          }}
        />
      </div>
    </div>
  );
}