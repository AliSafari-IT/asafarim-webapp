// Professional implementation of DisplayCode for the demo
import React, { useState, useEffect, useMemo } from 'react';

// Types
export interface DisplayCodeProps {
  code: string;
  language?: string;
  theme?: 'light' | 'dark' | 'auto';
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  title?: string;
  maxHeight?: string;
  wrapLines?: boolean;
  className?: string;
  onCopy?: (code: string) => void;
  fontSize?: 'small' | 'medium' | 'large';
  highlightLines?: number[];
  startLineNumber?: number;
  tabSize?: number;
  showLanguageLabel?: boolean;
}

export type SupportedLanguage = 
  | 'javascript'
  | 'typescript'
  | 'jsx'
  | 'tsx'
  | 'html'
  | 'css'
  | 'json'
  | 'markdown'
  | 'bash'
  | 'python'
  | 'java'
  | 'cpp'
  | 'sql'
  | 'yaml'
  | 'xml'
  | 'plaintext';

// Utility functions
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

const getLanguageIcon = (language: string): string => {
  const icons: Record<string, string> = {
    javascript: '🟨',
    typescript: '🔷',
    jsx: '⚛️',
    tsx: '⚛️',
    html: '🌐',
    css: '🎨',
    json: '📋',
    markdown: '📝',
    bash: '💻',
    python: '🐍',
    java: '☕',
    cpp: '⚙️',
    sql: '🗄️',
    yaml: '📄',
    xml: '📑',
    plaintext: '📃',
  };
  
  return icons[language.toLowerCase()] || '📄';
};

// Simple syntax highlighting
const highlightCode = (code: string, language: string): string => {
  // Define patterns for different languages
  const patterns: Record<string, Array<{ pattern: RegExp, className: string }>> = {
    javascript: [
      { pattern: /(\/\/.*|\/\*[\s\S]*?\*\/)/g, className: 'comment' },
      { pattern: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await)\b/g, className: 'keyword' },
      { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'builtin' },
      { pattern: /(".*?"|'.*?'|`[\s\S]*?`)/g, className: 'string' },
      { pattern: /\b(\d+(\.\d+)?)\b/g, className: 'number' },
    ],
    typescript: [
      { pattern: /(\/\/.*|\/\*[\s\S]*?\*\/)/g, className: 'comment' },
      { pattern: /\b(const|let|var|function|return|if|else|for|while|class|interface|type|import|export|from|async|await)\b/g, className: 'keyword' },
      { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'builtin' },
      { pattern: /(".*?"|'.*?'|`[\s\S]*?`)/g, className: 'string' },
      { pattern: /\b(\d+(\.\d+)?)\b/g, className: 'number' },
    ],
    // Add more languages as needed
  };
  
  // Default to javascript patterns if language not found
  const rules = patterns[language.toLowerCase()] || patterns.javascript;
  
  let html = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Apply highlighting
  rules.forEach(({ pattern, className }) => {
    html = html.replace(pattern, match => `<span class="${className}">${match}</span>`);
  });
  
  return html;
};

// Detect language from code
const detectLanguage = (code: string): string => {
  // Simple detection logic
  if (code.includes('import React') || code.includes('export interface') || code.includes(': string')) {
    return 'typescript';
  }
  if (code.includes('<div') || code.includes('<span') || code.includes('</')) {
    return 'html';
  }
  if (code.includes('function') || code.includes('const ') || code.includes('let ')) {
    return 'javascript';
  }
  return 'plaintext';
};

// Main component
export const DisplayCode: React.FC<DisplayCodeProps> = ({
  code,
  language,
  theme = 'light',
  showLineNumbers = false,
  showCopyButton = true,
  title,
  maxHeight = '600px',
  wrapLines = false,
  className = '',
  onCopy,
  fontSize = 'medium',
  highlightLines = [],
  startLineNumber = 1,
  tabSize = 2,
  showLanguageLabel = true
}) => {
  const [copied, setCopied] = useState(false);
  const [actualTheme, setActualTheme] = useState(theme);

  // Handle auto theme detection
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setActualTheme(mediaQuery.matches ? 'dark' : 'light');
      
      const handleChange = (e: MediaQueryListEvent) => {
        setActualTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setActualTheme(theme);
    }
  }, [theme]);

  const detectedLanguage = useMemo(() => {
    return (language || detectLanguage(code)) as SupportedLanguage;
  }, [code, language]);

  const processedCode = useMemo(() => {
    const normalizedCode = code.replace(/\t/g, ' '.repeat(tabSize));
    const lines = normalizedCode.split('\n');
    
    return lines.map((line: string, index: number) => {
      const lineNumber = index + startLineNumber;
      const isHighlighted = highlightLines.includes(lineNumber);
      
      return {
        content: line,
        highlighted: isHighlighted,
        lineNumber
      };
    });
  }, [code, tabSize, startLineNumber, highlightLines]);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.(code);
    }
  };

  const isDark = actualTheme === 'dark';
  
  // Inline styles for the component
  const styles = {
    container: {
      position: 'relative' as const,
      borderRadius: '8px',
      overflow: 'hidden',
      margin: '1rem 0',
      boxShadow: isDark 
        ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
        : '0 2px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: isDark ? '#1a202c' : '#ffffff',
      color: isDark ? '#e2e8f0' : '#1a202c',
      border: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`
    },
    header: {
      display: 'flex' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      padding: '0.75rem 1rem',
      backgroundColor: isDark ? '#2d3748' : '#f8f9fa',
      borderBottom: `1px solid ${isDark ? '#4a5568' : '#e9ecef'}`
    },
    title: {
      margin: 0,
      fontSize: '0.9rem',
      fontWeight: 600,
      color: isDark ? '#e2e8f0' : '#1a202c'
    },
    languageLabel: {
      display: 'inline-flex' as const,
      alignItems: 'center' as const,
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 500,
      backgroundColor: isDark ? '#4a5568' : '#e9ecef',
      color: isDark ? '#e2e8f0' : '#1a202c'
    },
    copyButton: {
      display: 'inline-flex' as const,
      alignItems: 'center' as const,
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      border: 'none',
      fontSize: '0.75rem',
      fontWeight: 500,
      backgroundColor: copied 
        ? (isDark ? '#276749' : '#c6f6d5') 
        : (isDark ? '#4a5568' : '#e9ecef'),
      color: copied 
        ? (isDark ? '#c6f6d5' : '#276749') 
        : (isDark ? '#e2e8f0' : '#1a202c'),
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    codeWrapper: {
      position: 'relative' as const,
      overflow: 'auto',
      maxHeight: maxHeight,
      backgroundColor: isDark ? '#1a202c' : '#ffffff'
    },
    pre: {
      margin: 0,
      padding: showLineNumbers ? '1rem 0 1rem 3rem' : '1rem',
      overflow: 'visible',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: fontSize === 'small' ? '0.75rem' : fontSize === 'large' ? '1rem' : '0.875rem',
      lineHeight: 1.5,
      tabSize: tabSize,
      whiteSpace: wrapLines ? 'pre-wrap' : 'pre',
      position: 'relative' as const
    },
    lineNumbers: {
      position: 'absolute' as const,
      left: 0,
      top: 0,
      bottom: 0,
      width: '2.5rem',
      textAlign: 'right' as const,
      padding: '1rem 0.5rem',
      backgroundColor: isDark ? '#2d3748' : '#f8f9fa',
      color: isDark ? '#718096' : '#a0aec0',
      userSelect: 'none' as const,
      borderRight: `1px solid ${isDark ? '#4a5568' : '#e9ecef'}`
    },
    line: {
      display: 'block',
      position: 'relative' as const,
      padding: '0 0.5rem'
    },
    lineHighlight: {
      backgroundColor: isDark ? 'rgba(66, 153, 225, 0.1)' : 'rgba(66, 153, 225, 0.05)',
      width: '100%',
      display: 'inline-block',
      borderLeft: `2px solid ${isDark ? '#4299e1' : '#63b3ed'}`
    },
    lineNumber: {
      display: 'block',
      textAlign: 'right' as const,
      paddingRight: '0.5rem',
      color: isDark ? '#718096' : '#a0aec0',
      userSelect: 'none' as const
    }
  };

  // CSS for syntax highlighting
  const syntaxStyles = `
    .comment { color: ${isDark ? '#718096' : '#718096'}; font-style: italic; }
    .keyword { color: ${isDark ? '#63b3ed' : '#3182ce'}; font-weight: bold; }
    .builtin { color: ${isDark ? '#f6ad55' : '#dd6b20'}; }
    .string { color: ${isDark ? '#68d391' : '#38a169'}; }
    .number { color: ${isDark ? '#f6ad55' : '#dd6b20'}; }
  `;

  return (
    <div style={{...styles.container, ...(className ? { className } : {})}}>
      <style>{syntaxStyles}</style>
      {(title || showLanguageLabel || showCopyButton) && (
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {title && (
              <h3 style={styles.title}>
                {title}
              </h3>
            )}
            {showLanguageLabel && (
              <span style={styles.languageLabel}>
                {getLanguageIcon(detectedLanguage)} {detectedLanguage}
              </span>
            )}
          </div>
          {showCopyButton && (
            <button
              style={styles.copyButton}
              onClick={handleCopy}
              aria-label="Copy code to clipboard"
            >
              {copied ? (
                <>
                  <span style={{ marginRight: '0.25rem' }}>✓</span>
                  Copied!
                </>
              ) : (
                <>
                  <span style={{ marginRight: '0.25rem' }}>📋</span>
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      )}
      <div style={styles.codeWrapper}>
        {showLineNumbers && (
          <div style={styles.lineNumbers}>
            {processedCode.map((line, index) => (
              <span key={`ln-${index}`} style={styles.lineNumber}>
                {line.lineNumber}
              </span>
            ))}
          </div>
        )}
        <pre style={styles.pre}>
          <code>
            {processedCode.map((line, index) => (
              <div
                key={index}
                style={{
                  ...styles.line,
                  ...(line.highlighted ? styles.lineHighlight : {})
                }}
                dangerouslySetInnerHTML={{
                  __html: highlightCode(line.content || ' ', detectedLanguage)
                }}
              />
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};
