export { DisplayCode } from './components/DisplayCode';
export type { 
  DisplayCodeProps, 
  SupportedLanguage, 
  HighlightRule, 
  LanguageDefinition 
} from './types';
export { 
  highlightCode, 
  copyToClipboard, 
  getLanguageIcon, 
  escapeHtml 
} from './utils';
export { 
  languages, 
  detectLanguage 
} from './utils/syntax-highlighter';
