import React, { useState, useEffect, useMemo } from 'react';
import { DisplayCodeProps, SupportedLanguage } from '../types';
import { highlightCode, copyToClipboard, getLanguageIcon } from '../utils';
import { detectLanguage } from '../utils/syntax-highlighter';
import styles from './DisplayCode.module.css';

export const DisplayCode: React.FC<DisplayCodeProps> = ({
  code,
  language,
  theme = 'light',
  showLineNumbers = false,
  showCopyButton = true,
  title,
  maxHeight = '500px',
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

  const containerClasses = [
    styles.container,
    isDark ? styles.containerDark : '',
    className
  ].filter(Boolean).join(' ');

  const headerClasses = [
    styles.header,
    isDark ? styles.headerDark : ''
  ].filter(Boolean).join(' ');

  const titleClasses = [
    styles.title,
    isDark ? styles.titleDark : ''
  ].filter(Boolean).join(' ');

  const languageLabelClasses = [
    styles.languageLabel,
    isDark ? styles.languageLabelDark : ''
  ].filter(Boolean).join(' ');

  const copyButtonClasses = [
    styles.copyButton,
    isDark ? styles.copyButtonDark : '',
    copied ? styles.copySuccess : ''
  ].filter(Boolean).join(' ');

  const codeWrapperClasses = [
    styles.codeWrapper,
    isDark ? styles.codeWrapperDark : '',
    maxHeight !== '500px' ? styles.codeWrapperCustomHeight : ''
  ].filter(Boolean).join(' ');

  const codeBlockClasses = [
    styles.codeBlock,
    isDark ? styles.codeBlockDark : '',
    styles[`codeBlock${fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}`],
    wrapLines ? styles.codeBlockWrap : '',
    showLineNumbers ? styles.lineNumbers : ''
  ].filter(Boolean).join(' ');

  const lineNumbersClasses = [
    showLineNumbers ? styles.lineNumbers : '',
    isDark ? styles.lineNumbersDark : ''
  ].filter(Boolean).join(' ');

  const getLineClasses = (isHighlighted: boolean) => [
    styles.line,
    isHighlighted ? styles.lineHighlight : '',
    isHighlighted && isDark ? styles.lineHighlightDark : ''
  ].filter(Boolean).join(' ');

  const codeWrapperStyle = maxHeight !== '500px' ? { maxHeight } : {};

  return (
    <div className={containerClasses}>
      {(title || showLanguageLabel || showCopyButton) && (
        <div className={headerClasses}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {title && (
              <h3 className={titleClasses}>
                {title}
              </h3>
            )}
            {showLanguageLabel && (
              <span className={languageLabelClasses}>
                {getLanguageIcon(detectedLanguage)} {detectedLanguage}
              </span>
            )}
          </div>
          {showCopyButton && (
            <button
              className={copyButtonClasses}
              onClick={handleCopy}
              aria-label="Copy code to clipboard"
            >
              {copied ? (
                <>
                  <span>✓</span>
                  Copied!
                </>
              ) : (
                <>
                  <span>📋</span>
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      )}
      <div className={codeWrapperClasses} style={codeWrapperStyle}>
        <pre className={codeBlockClasses}>
          <code className={lineNumbersClasses}>
            {processedCode.map((line, index) => (
              <span
                key={index}
                className={getLineClasses(line.highlighted)}
                dangerouslySetInnerHTML={{
                  __html: highlightCode(line.content, detectedLanguage)
                }}
              />
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};
