import { useRef, useEffect, useState } from 'react';
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onLanguageChange?: (language: string) => void; // Make this optional
  theme?: string;
  height?: string;
}

export function CodeEditor({
  value,
  onChange,
  language,
  onLanguageChange,
  theme = 'vs-dark',
  height = '300px',
}: CodeEditorProps) {
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

  // Handle editor value changes
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
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
      <div className="flex justify-end mb-2">
        <select
          value={language}
          onChange={(e) => onLanguageChange?.(e.target.value)}
          className="bg-muted text-foreground px-2 py-1 text-sm rounded border border-input"
        >
          <option value="typescript">TypeScript</option>
          <option value="javascript">JavaScript</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="json">JSON</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="php">PHP</option>
          <option value="ruby">Ruby</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="swift">Swift</option>
        </select>
      </div>
      <div className="p-4">
        <Editor
          height={height}
          language={language}
          value={value}
          theme={theme}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontSize: 14,
            wordWrap: 'on',
            readOnly: false,
            lineNumbers: "on",
            renderLineHighlight: "all",
            quickSuggestions: false,
            contextmenu: false,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}