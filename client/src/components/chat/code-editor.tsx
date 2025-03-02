import { useRef, useEffect, useState, useMemo, memo } from 'react';
import Editor, { loader, EditorProps, OnMount } from "@monaco-editor/react";
import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onLanguageChange?: (language: string) => void;
  theme?: 'vs-dark' | 'vs-light';
  height?: string;
  readOnly?: boolean;
  className?: string;
}

export interface LanguageConfig {
  label: string;
  value: string;
  tabSize: number;
  formatOnPaste?: boolean;
  formatOnType?: boolean;
}

const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { label: 'TypeScript', value: 'typescript', tabSize: 2, formatOnPaste: true, formatOnType: true },
  { label: 'JavaScript', value: 'javascript', tabSize: 2, formatOnPaste: true, formatOnType: true },
  { label: 'HTML', value: 'html', tabSize: 2, formatOnPaste: true },
  { label: 'CSS', value: 'css', tabSize: 2, formatOnPaste: true },
  { label: 'JSON', value: 'json', tabSize: 2, formatOnPaste: true },
  { label: 'Python', value: 'python', tabSize: 4 },
  { label: 'Java', value: 'java', tabSize: 4 },
  { label: 'C#', value: 'csharp', tabSize: 4 },
  { label: 'PHP', value: 'php', tabSize: 4 },
  { label: 'Ruby', value: 'ruby', tabSize: 2 },
  { label: 'Go', value: 'go', tabSize: 4 },
  { label: 'Rust', value: 'rust', tabSize: 4 },
  { label: 'Swift', value: 'swift', tabSize: 4 },
];

// Configure Monaco editor
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs',
  },
});

export const CodeEditor = memo(({
  value,
  onChange,
  language,
  onLanguageChange,
  theme = 'vs-dark',
  height = '500px',
  readOnly = false,
  className
}: CodeEditorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);

  // Get language configuration
  const langConfig = useMemo(() => 
    SUPPORTED_LANGUAGES.find(lang => lang.value === language) ?? SUPPORTED_LANGUAGES[0]
  , [language]);

  // Memoize editor options
  const editorOptions = useMemo((): Monaco.editor.IStandaloneEditorConstructionOptions => ({
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    fontSize: 14,
    wordWrap: 'on',
    readOnly,
    lineNumbers: 'on' as const,
    renderLineHighlight: 'all',
    quickSuggestions: false,
    contextmenu: false,
    tabSize: langConfig.tabSize,
    formatOnPaste: langConfig.formatOnPaste,
    formatOnType: langConfig.formatOnType,
    suggestOnTriggerCharacters: !readOnly,
    acceptSuggestionOnCommitCharacter: !readOnly,
    suggestSelection: 'first',
    folding: true,
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible',
      useShadows: false,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
    },
  }), [langConfig, readOnly]);

  // Handle editor mounting
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setIsLoading(false);

    // Add keyboard shortcuts
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, 
      () => {
        // Save functionality if needed
      }
    );

    // Configure editor for specific languages
    if (language === 'typescript' || language === 'javascript') {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      });
    }
  };

  // Handle copy functionality
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      toast({
        description: "Code copied to clipboard",
        duration: 2000
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        description: "Failed to copy code",
        variant: "destructive",
        duration: 2000
      });
    }
  };

  // Handle editor value changes
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  // Format document on demand
  const formatDocument = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  // Error boundary
  if (!language || !SUPPORTED_LANGUAGES.some(lang => lang.value === language)) {
    console.error(`Unsupported language: ${language}`);
    return (
      <div className="p-4 border rounded-md bg-destructive/10 text-destructive">
        Unsupported language selected. Defaulting to TypeScript.
      </div>
    );
  }

  return (
    <div className={`relative rounded-md border bg-background shadow-sm h-full ${className}`}>
      <Editor
        height={height}
        language={language}
        value={value}
        theme={theme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        loading={<div className="animate-pulse">Loading editor...</div>}
        options={editorOptions}
      />
    </div>
  );
});

CodeEditor.displayName = "CodeEditor";