
// Common patterns and keywords for various languages
const LANGUAGE_PATTERNS = {
  javascript: [
    /\bconst\b|\blet\b|\bfunction\b|\bvar\b|\brequire\b|\bimport\b|\bexport\b|\b=>\b/,
    /\.js\b/,
    /\bconsole\.log\b/,
    /document\.querySelector/
  ],
  typescript: [
    /\binterface\b|\btype\b|\bnamespace\b|\bReadonly\b/,
    /\.ts\b/,
    /\:\s*?[A-Za-z]+\<|\:\s*?[A-Za-z]+\[\]/,
    /\<[A-Za-z]+\>/
  ],
  python: [
    /\bdef\b|\bimport\b|\bfrom\b|\bclass\b|\bif\s+__name__\s*==\s*["']__main__["']/,
    /\.py\b/,
    /\bprint\s*\(/,
    /\s{4}/
  ],
  html: [
    /<html>|<body>|<div>|<span>|<a\s+href|<!DOCTYPE html>/i,
    /\.html\b/,
    /<\/\w+>/
  ],
  css: [
    /\{[\s\n]*[\w-]+\s*:\s*[^;]+;/,
    /\.css\b/,
    /^\s*\.\w+\s*\{|\#\w+\s*\{/,
    /margin|padding|color|background|font-size/
  ],
  java: [
    /\bpublic\s+class\b|\bprivate\b|\bprotected\b|\bimport\s+java\./,
    /\.java\b/,
    /System\.out\.print/
  ],
  ruby: [
    /\bdef\b|\bclass\b|\bmodule\b|\battr_accessor\b|\brequire\b|\bend\b/,
    /\.rb\b/,
    /puts/
  ],
  go: [
    /\bfunc\b|\bpackage\b|\bimport\b|\btype\b|\bstruct\b|\binterface\b/,
    /\.go\b/,
    /fmt\.Print/
  ],
  rust: [
    /\bfn\b|\blet\b|\bmut\b|\bpub\b|\bstruct\b|\benum\b|\bimpl\b|\buse\b/,
    /\.rs\b/,
    /println!\(/
  ],
  php: [
    /\<\?php|\$\w+/,
    /\.php\b/,
    /echo\s+/
  ],
  csharp: [
    /\bnamespace\b|\busing\b|\bclass\b|\bpublic\b|\bprivate\b|\bvoid\b/,
    /\.cs\b/,
    /Console\.Write/
  ],
  cpp: [
    /\#include\s*<[\w\.]+>|\bstd::/,
    /\.cpp\b/,
    /cout\s*<</
  ],
  c: [
    /\#include\s*<[\w\.]+>|\bvoid\s+main\(/,
    /\.c\b/,
    /printf\(/
  ],
  json: [
    /^\s*\{\s*"[\w]+":/,
    /\.json\b/
  ],
  yaml: [
    /^\s*[\w-]+:\s*\S+/,
    /\.ya?ml\b/
  ],
  sql: [
    /\bSELECT\b|\bFROM\b|\bWHERE\b|\bJOIN\b|\bGROUP BY\b|\bORDER BY\b/i,
    /\.sql\b/
  ],
  markdown: [
    /^\s*\#{1,6}\s+|\*\*[\w\s]+\*\*|__[\w\s]+__|```[\w\s]*$/,
    /\.md\b/
  ],
};

/**
 * Detects the programming language of a code snippet
 * @param code The code snippet to analyze
 * @returns The detected language or 'plaintext' if none detected
 */
export function detectLanguage(code: string): string {
  if (!code || code.trim().length === 0) {
    return 'plaintext';
  }
  
  // Score for each language
  const scores: Record<string, number> = {};
  
  // Initialize scores
  Object.keys(LANGUAGE_PATTERNS).forEach(lang => {
    scores[lang] = 0;
  });
  
  // Check each language pattern
  Object.entries(LANGUAGE_PATTERNS).forEach(([language, patterns]) => {
    patterns.forEach(pattern => {
      if (pattern.test(code)) {
        scores[language] += 1;
      }
    });
  });
  
  // Find language with highest score
  let maxScore = 0;
  let detectedLanguage = 'plaintext';
  
  Object.entries(scores).forEach(([language, score]) => {
    if (score > maxScore) {
      maxScore = score;
      detectedLanguage = language;
    }
  });
  
  return detectedLanguage;
}

/**
 * Format code using prettier if available
 * @param code The code to format
 * @param language The language of the code
 * @returns Formatted code or original if formatting fails
 */
export async function formatCode(code: string, language: string): Promise<string> {
  try {
    // This is just a placeholder - actual implementation would use the Prettier library
    // In a real implementation, you would dynamically import prettier and the appropriate parser
    return code;
  } catch (error) {
    console.error("Error formatting code:", error);
    return code;
  }
}
