import { useRef, useEffect, useState, useMemo, memo, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy load Monaco editor
const Editor = lazy(() => import("@monaco-editor/react").then(mod => ({ default: mod.default })));
const { loader } = await import("@monaco-editor/react");
import type { OnMount, EditorProps } from "@monaco-editor/react";
import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onLanguageChange?: (language: string) => void;
  theme?: 'vs-dark' | 'vs-light';
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  readOnly?: boolean;
  className?: string;
  options?: Monaco.editor.IStandaloneEditorConstructionOptions;
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

// Configure Monaco editor with performance optimizations
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs',
  },
  'vs/nls': {
    availableLanguages: {
      '*': ''
    }
  },
  'vs/editor/editor.main': {
    'vs/base/browser/ui/actionbar/actionbar': false,
    'vs/base/browser/ui/tree/treeDefaults': false,
    'vs/editor/contrib/anchorSelect/browser/anchorSelect': false,
    'vs/editor/contrib/bracketMatching/browser/bracketMatching': false,
    'vs/editor/contrib/caretOperations/browser/caretOperations': false,
    'vs/editor/contrib/clipboard/browser/clipboard': false,
    'vs/editor/contrib/codeAction/browser/codeActionContributions': false,
    'vs/editor/contrib/codelens/browser/codelensController': false,
    'vs/editor/contrib/colorPicker/browser/colorContributions': false,
    'vs/editor/contrib/contextmenu/browser/contextmenu': false,
    'vs/editor/contrib/cursorUndo/browser/cursorUndo': false,
    'vs/editor/contrib/dnd/browser/dnd': false,
    'vs/editor/contrib/find/browser/findController': false,
    'vs/editor/contrib/folding/browser/folding': false,
    'vs/editor/contrib/fontZoom/browser/fontZoom': false,
    'vs/editor/contrib/format/browser/formatActions': false,
    'vs/editor/contrib/gotoError/browser/gotoError': false,
    'vs/editor/contrib/gotoSymbol/browser/link/goToDefinitionAtPosition': false,
    'vs/editor/contrib/hover/browser/hover': false,
    'vs/editor/contrib/indentation/browser/indentation': false,
    'vs/editor/contrib/inlineHints/browser/inlineHints': false,
    'vs/editor/contrib/inPlaceReplace/browser/inPlaceReplace': false,
    'vs/editor/contrib/linesOperations/browser/linesOperations': false,
    'vs/editor/contrib/linkedEditing/browser/linkedEditing': false,
    'vs/editor/contrib/multicursor/browser/multicursor': false,
    'vs/editor/contrib/parameterHints/browser/parameterHints': false,
    'vs/editor/contrib/rename/browser/rename': false,
    'vs/editor/contrib/smartSelect/browser/smartSelect': false,
    'vs/editor/contrib/snippet/browser/snippetController2': false,
    'vs/editor/contrib/suggest/browser/suggestController': false,
    'vs/editor/contrib/tokenization/browser/tokenization': false,
    'vs/editor/contrib/toggleTabFocusMode/browser/toggleTabFocusMode': false,
    'vs/editor/contrib/unusualLineTerminators/browser/unusualLineTerminators': false,
    'vs/editor/contrib/wordHighlighter/browser/wordHighlighter': false,
    'vs/editor/contrib/wordOperations/browser/wordOperations': false,
    'vs/editor/contrib/wordPartOperations/browser/wordPartOperations': false
  }
});

// Add disposal effect
useEffect(() => {
  return () => {
    // Cleanup Monaco editor instance on unmount
    if (editorRef.current) {
      editorRef.current.dispose();
    }
    // Clear Monaco models from memory
    if (monacoRef.current) {
      monacoRef.current.editor.getModels().forEach(model => model.dispose());
    }
  };
}, []);

export const CodeEditor = memo(({
  value,
  onChange,
  language,
  onLanguageChange,
  theme = 'vs-dark',
  height = '100%',
  minHeight = '100%',
  maxHeight,
  readOnly = false,
  className,
  options: customOptions
}: CodeEditorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const isMobile = useIsMobile();

  // Get language configuration
  const langConfig = useMemo(() => 
    SUPPORTED_LANGUAGES.find(lang => lang.value === language) ?? SUPPORTED_LANGUAGES[0]
  , [language]);

  // Memoize editor options with performance optimizations
  const editorOptions = useMemo((): Monaco.editor.IStandaloneEditorConstructionOptions => ({
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    fontSize: isMobile ? 12 : 14,
    lineHeight: isMobile ? 1.4 : 1.5,
    wordWrap: 'on',
    readOnly,
    lineNumbers: isMobile ? 'off' : 'on',
    renderLineHighlight: 'line',
    quickSuggestions: false,
    contextmenu: !isMobile,
    tabSize: langConfig.tabSize,
    formatOnPaste: false,
    formatOnType: false,
    suggestOnTriggerCharacters: false,
    acceptSuggestionOnCommitCharacter: false,
    hover: { enabled: false },
    folding: false,
    glyphMargin: false,
    rulers: [],
    overviewRulerLanes: 0,
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible',
      useShadows: false,
      verticalScrollbarSize: isMobile ? 4 : 8,
      horizontalScrollbarSize: isMobile ? 4 : 8,
      alwaysConsumeMouseWheel: false
    },
    padding: {
      top: isMobile ? 8 : 12,
      bottom: isMobile ? 8 : 12,
    },
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    renderFinalNewline: 'off',
    occurrencesHighlight: false,
    selectionHighlight: false,
    roundedSelection: true,
    links: false,
    colorDecorators: false,
    renderWhitespace: 'none',
    renderControlCharacters: false,
    renderIndentGuides: false,
    ...customOptions,
  }), [langConfig, readOnly, isMobile, customOptions]);

  // Handle editor mounting
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setIsLoading(false);

    // Configure touch handling for mobile
    if (isMobile) {
      editor.updateOptions({
        mouseWheelZoom: false,
        renderWhitespace: 'none',
        lineDecorationsWidth: 0,
      });
    }

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

  // Error boundary
  if (!language || !SUPPORTED_LANGUAGES.some(lang => lang.value === language)) {
    console.error(`Unsupported language: ${language}`);
    return (
      <div className="p-3 sm:p-4 border rounded-md bg-destructive/10 text-destructive text-sm">
        Unsupported language selected. Defaulting to TypeScript.
      </div>
    );
  }

  return (
    <div style={{
      minHeight: minHeight,
      maxHeight: maxHeight,
    }} className={cn(
      "relative rounded-md border bg-background shadow-sm",
      "overflow-hidden",
      className
    )}>
      {/* Copy Button */}
      <Button
        variant="ghost"
        size={isMobile ? "default" : "sm"}
        onClick={handleCopy}
        className={cn(
          "absolute top-2 right-2 z-10",
          "bg-background/80 backdrop-blur-sm",
          "hover:bg-accent",
          "touch-manipulation"
        )}
      >
        {isCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>

      {/* Editor */}
      <Suspense fallback={
        <div className={cn(
          "flex items-center justify-center",
          "h-full min-h-[100px]",
          "text-sm text-muted-foreground",
          "animate-pulse"
        )}>
          Loading editor...
        </div>
      }>
        <Editor
          height={height}
          language={language}
          value={value}
          theme={theme}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={editorOptions}
        />
      </Suspense>
    </div>
  );
});

CodeEditor.displayName = "CodeEditor";