import { languages } from './syntax-highlighter';
import { SupportedLanguage } from '../types';

export const highlightCode = (code: string, language: SupportedLanguage): string => {
  if (language === 'plaintext') {
    return escapeHtml(code);
  }

  const lang = languages[language];
  if (!lang) {
    return escapeHtml(code);
  }

  // First escape the entire code to ensure HTML tags are displayed as text
  let highlightedCode = escapeHtml(code);

  // Apply syntax highlighting rules in order
  for (const rule of lang.rules) {
    // Use a non-greedy regex replacement approach to avoid nested replacements
    // This prevents the 'class=class=' issue
    let lastHighlightedCode = '';
    while (lastHighlightedCode !== highlightedCode) {
      lastHighlightedCode = highlightedCode;
      
      // Find the next match that's not inside a span
      const regex = new RegExp(
        `(?<!<span[^>]*>)(?:${rule.pattern.source})(?![^<]*</span>)`, 
        rule.pattern.flags
      );
      
      const match = regex.exec(highlightedCode);
      if (!match) break;
      
      // Replace just this match
      const before = highlightedCode.substring(0, match.index);
      const after = highlightedCode.substring(match.index + match[0].length);
      highlightedCode = `${before}<span class="highlight-${rule.className}">${match[0]}</span>${after}`;
    }
  }

  return highlightedCode;
};



export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

export const getLanguageIcon = (language: SupportedLanguage): string => {
  const icons: Record<SupportedLanguage, string> = {
    javascript: '🟨',
    typescript: '🔷',
    jsx: '⚛️',
    tsx: '⚛️',
    html: '🌐',
    css: '🎨',
    json: '📄',
    markdown: '📝',
    bash: '💻',
    python: '🐍',
    java: '☕',
    cpp: '⚙️',
    sql: '🗃️',
    yaml: '📋',
    xml: '📊',
    plaintext: '📄'
  };
  
  return icons[language] || '📄';
};
