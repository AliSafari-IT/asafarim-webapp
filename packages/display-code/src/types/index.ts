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

export interface HighlightRule {
  pattern: RegExp;
  className: string;
}

export interface LanguageDefinition {
  name: string;
  extensions: string[];
  keywords: string[];
  rules: HighlightRule[];
}
