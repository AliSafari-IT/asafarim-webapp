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

  let highlightedCode = escapeHtml(code);

  // Apply syntax highlighting rules
  for (const rule of lang.rules) {
    highlightedCode = highlightedCode.replace(rule.pattern, (match) => {
      return `<span class="highlight-${rule.className}">${match}</span>`;
    });
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
