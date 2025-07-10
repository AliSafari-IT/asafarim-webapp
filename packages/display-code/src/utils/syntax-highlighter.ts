import { SupportedLanguage, LanguageDefinition } from '../types';

export const languages: Record<SupportedLanguage, LanguageDefinition> = {
  javascript: {
    name: 'JavaScript',
    extensions: ['.js', '.mjs'],
    keywords: ['const', 'let', 'var', 'function', 'class', 'if', 'else', 'for', 'while', 'return', 'import', 'export', 'default', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super', 'extends', 'static', 'public', 'private', 'protected'],
    rules: [
      // Comments (must come first)
      { pattern: /\/\/.*$/gm, className: 'comment' },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },
      // Keywords
      { pattern: /\b(const|let|var|function|class|if|else|for|while|return|import|export|default|async|await|try|catch|finally|throw|new|this|super|extends|static|public|private|protected)\b/g, className: 'keyword' },
      // Booleans and null
      { pattern: /\b(true|false|null|undefined)\b/g, className: 'boolean' },
      // Numbers
      { pattern: /\b\d+\.?\d*\b/g, className: 'number' },
      // Class names
      { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, className: 'class-name' },
      // Function names
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, className: 'function' },
      // Strings
      { pattern: /"(?:[^"\\]|\\.)*"/g, className: 'string' },
      { pattern: /'(?:[^'\\]|\\.)*'/g, className: 'string' },
      { pattern: /`(?:[^`\\]|\\.)*`/g, className: 'string' },
      // Operators
      { pattern: /[+\-*/%=<>!&|^~?:]+/g, className: 'operator' },
      // Punctuation
      { pattern: /[\(\)\{\}\[\];,\.]/g, className: 'punctuation' }
    ]
  },
  typescript: {
    name: 'TypeScript',
    extensions: ['.ts'],
    keywords: ['interface', 'type', 'enum', 'namespace', 'module', 'declare', 'readonly', 'keyof', 'typeof', 'const', 'let', 'var', 'function', 'class', 'if', 'else', 'for', 'while', 'return', 'import', 'export', 'default', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super', 'extends', 'static', 'public', 'private', 'protected'],
    rules: [
      // Comments (must come first)
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },
      { pattern: /\/\/.*$/gm, className: 'comment' },
      // Keywords
      { pattern: /\b(interface|type|enum|namespace|module|declare|readonly|keyof|typeof|const|let|var|function|class|if|else|for|while|return|import|export|default|async|await|try|catch|finally|throw|new|this|super|extends|static|public|private|protected)\b/g, className: 'keyword' },
      // Booleans and null
      { pattern: /\b(true|false|null|undefined)\b/g, className: 'boolean' },
      // Numbers
      { pattern: /\b\d+\.?\d*\b/g, className: 'number' },
      // Class names
      { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, className: 'class-name' },
      // Function names
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, className: 'function' },
      // Strings
      { pattern: /"(?:[^"\\]|\\.)*"/g, className: 'string' },
      { pattern: /'(?:[^'\\]|\\.)*'/g, className: 'string' },
      { pattern: /`(?:[^`\\]|\\.)*`/g, className: 'string' },
      // Operators
      { pattern: /[+\-*/%=<>!&|^~?:]+/g, className: 'operator' },
      // Punctuation
      { pattern: /[\(\)\{\}\[\];,\.]/g, className: 'punctuation' }
    ]
  },
  jsx: {
    name: 'JSX',
    extensions: ['.jsx'],
    keywords: ['const', 'let', 'var', 'function', 'class', 'if', 'else', 'for', 'while', 'return', 'import', 'export', 'default', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super', 'extends', 'static', 'public', 'private', 'protected'],
    rules: [
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },
      { pattern: /\/\/.*$/gm, className: 'comment' },
      { pattern: /<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s+[a-zA-Z][a-zA-Z0-9]*(?:=(?:"[^"]*"|'[^']*'|{[^}]*}))?)*\s*\/?>/g, className: 'tag' },
      { pattern: /"(?:[^"\\]|\\.)*"/g, className: 'string' },
      { pattern: /'(?:[^'\\]|\\.)*'/g, className: 'string' },
      { pattern: /`(?:[^`\\]|\\.)*`/g, className: 'string' },
      { pattern: /\b\d+\.?\d*\b/g, className: 'number' },
      { pattern: /\b(true|false|null|undefined)\b/g, className: 'boolean' },
      { pattern: /\b(const|let|var|function|class|if|else|for|while|return|import|export|default|async|await|try|catch|finally|throw|new|this|super|extends|static|public|private|protected)\b/g, className: 'keyword' },
      { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, className: 'class-name' },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, className: 'function' },
    ]
  },
  tsx: {
    name: 'TSX',
    extensions: ['.tsx'],
    keywords: ['interface', 'type', 'enum', 'namespace', 'module', 'declare', 'readonly', 'keyof', 'typeof', 'const', 'let', 'var', 'function', 'class', 'if', 'else', 'for', 'while', 'return', 'import', 'export', 'default', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super', 'extends', 'static', 'public', 'private', 'protected'],
    rules: [
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },
      { pattern: /\/\/.*$/gm, className: 'comment' },
      { pattern: /<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s+[a-zA-Z][a-zA-Z0-9]*(?:=(?:"[^"]*"|'[^']*'|{[^}]*}))?)*\s*\/?>/g, className: 'tag' },
      { pattern: /"(?:[^"\\]|\\.)*"/g, className: 'string' },
      { pattern: /'(?:[^'\\]|\\.)*'/g, className: 'string' },
      { pattern: /`(?:[^`\\]|\\.)*`/g, className: 'string' },
      { pattern: /\b\d+\.?\d*\b/g, className: 'number' },
      { pattern: /\b(true|false|null|undefined)\b/g, className: 'boolean' },
      { pattern: /\b(interface|type|enum|namespace|module|declare|readonly|keyof|typeof|const|let|var|function|class|if|else|for|while|return|import|export|default|async|await|try|catch|finally|throw|new|this|super|extends|static|public|private|protected)\b/g, className: 'keyword' },
      { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, className: 'class-name' },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, className: 'function' },
    ]
  },
  html: {
    name: 'HTML',
    extensions: ['.html', '.htm'],
    keywords: [],
    rules: [
      { pattern: /<!--[\s\S]*?-->/g, className: 'comment' },
      { pattern: /<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s+[a-zA-Z][a-zA-Z0-9]*(?:=(?:"[^"]*"|'[^']*'))?)*\s*\/?>/g, className: 'tag' },
      { pattern: /"[^"]*"/g, className: 'string' },
      { pattern: /'[^']*'/g, className: 'string' },
    ]
  },
  css: {
    name: 'CSS',
    extensions: ['.css'],
    keywords: [],
    rules: [
      // Comments
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },
      // Selectors
      { pattern: /([.#]?[a-zA-Z][a-zA-Z0-9_-]*)(?=\s*{)/g, className: 'selector' },
      // Properties
      { pattern: /([a-zA-Z-]+)(?=\s*:)/g, className: 'property' },
      // Colors
      { pattern: /#[a-fA-F0-9]{3,6}\b/g, className: 'color' },
      // Units
      { pattern: /\b\d+(?:px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|lh|vmin|vmax)?\b/g, className: 'number' },
      // Strings
      { pattern: /"[^"]*"/g, className: 'string' },
      { pattern: /'[^']*'/g, className: 'string' },
      // Important punctuation
      { pattern: /[{};:]/g, className: 'punctuation' }
    ]
  },
  json: {
    name: 'JSON',
    extensions: ['.json'],
    keywords: [],
    rules: [
      // Apply these rules in specific order
      { pattern: /\b(true|false|null)\b/g, className: 'boolean' },
      { pattern: /\b\d+\.?\d*\b/g, className: 'number' },
      // Match property names (must come before general strings)
      { pattern: /("[^"]*")(?=\s*:)/g, className: 'key' },
      // Match string values
      { pattern: /:\s*("[^"]*")/g, className: 'string' },
      // Match any remaining strings (for arrays, etc.)
      { pattern: /"[^"]*"/g, className: 'string' },
      // Match structural elements
      { pattern: /[\{\}\[\]]/g, className: 'punctuation' },
      { pattern: /,/g, className: 'punctuation' }
    ]
  },
  markdown: {
    name: 'Markdown',
    extensions: ['.md', '.markdown'],
    keywords: [],
    rules: [
      { pattern: /^#{1,6}\s+.*$/gm, className: 'header' },
      { pattern: /\*\*[^*]+\*\*/g, className: 'bold' },
      { pattern: /\*[^*]+\*/g, className: 'italic' },
      { pattern: /`[^`]+`/g, className: 'code' },
      { pattern: /```[\s\S]*?```/g, className: 'code-block' },
      { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, className: 'link' },
    ]
  },
  bash: {
    name: 'Bash',
    extensions: ['.sh', '.bash'],
    keywords: ['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'function', 'return', 'local', 'export', 'unset', 'readonly', 'declare'],
    rules: [
      // Comments
      { pattern: /#.*$/gm, className: 'comment' },
      // Keywords
      { pattern: /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|local|export|unset|readonly|declare)\b/g, className: 'keyword' },
      // Variables
      { pattern: /\$[a-zA-Z_][a-zA-Z0-9_]*/g, className: 'variable' },
      { pattern: /\$\{[a-zA-Z_][a-zA-Z0-9_]*\}/g, className: 'variable' },
      // Strings
      { pattern: /"(?:[^"\\]|\\.)*"/g, className: 'string' },
      { pattern: /'[^']*'/g, className: 'string' },
      // Commands
      { pattern: /^\s*([a-zA-Z0-9_\-\.]+)(?=\s|$)/gm, className: 'function' },
      // Options
      { pattern: /\s-[a-zA-Z]+\b/g, className: 'operator' },
      { pattern: /\s--[a-zA-Z][a-zA-Z0-9_-]*\b/g, className: 'operator' },
      // Punctuation
      { pattern: /[\(\)\{\}\[\];|&><]/g, className: 'punctuation' }
    ]
  },
  python: {
    name: 'Python',
    extensions: ['.py'],
    keywords: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'lambda', 'yield', 'global', 'nonlocal', 'assert', 'del', 'pass', 'break', 'continue'],
    rules: [
      { pattern: /#.*$/gm, className: 'comment' },
      { pattern: /"""[\s\S]*?"""/g, className: 'string' },
      { pattern: /'''[\s\S]*?'''/g, className: 'string' },
      { pattern: /"(?:[^"\\]|\\.)*"/g, className: 'string' },
      { pattern: /'(?:[^'\\]|\\.)*'/g, className: 'string' },
      { pattern: /\b\d+\.?\d*\b/g, className: 'number' },
      { pattern: /\b(True|False|None)\b/g, className: 'boolean' },
      { pattern: /\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|finally|raise|with|lambda|yield|global|nonlocal|assert|del|pass|break|continue)\b/g, className: 'keyword' },
      { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, className: 'class-name' },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, className: 'function' },
    ]
  },
  java: {
    name: 'Java',
    extensions: ['.java'],
    keywords: ['public', 'private', 'protected', 'static', 'final', 'abstract', 'class', 'interface', 'extends', 'implements', 'package', 'import', 'void', 'int', 'long', 'short', 'byte', 'float', 'double', 'char', 'boolean', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'throws', 'new', 'this', 'super'],
    rules: [
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },
      { pattern: /\/\/.*$/gm, className: 'comment' },
      { pattern: /"(?:[^"\\]|\\.)*"/g, className: 'string' },
      { pattern: /'(?:[^'\\]|\\.)*'/g, className: 'string' },
      { pattern: /\b\d+\.?\d*[fFdD]?\b/g, className: 'number' },
      { pattern: /\b(true|false|null)\b/g, className: 'boolean' },
      { pattern: /\b(public|private|protected|static|final|abstract|class|interface|extends|implements|package|import|void|int|long|short|byte|float|double|char|boolean|if|else|for|while|do|switch|case|default|break|continue|return|try|catch|finally|throw|throws|new|this|super)\b/g, className: 'keyword' },
      { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, className: 'class-name' },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, className: 'function' },
    ]
  },
  cpp: {
    name: 'C++',
    extensions: ['.cpp', '.cc', '.cxx', '.hpp', '.h'],
    keywords: ['int', 'float', 'double', 'char', 'bool', 'void', 'const', 'static', 'extern', 'inline', 'virtual', 'class', 'struct', 'enum', 'union', 'namespace', 'using', 'typedef', 'template', 'typename', 'public', 'private', 'protected', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return', 'try', 'catch', 'throw', 'new', 'delete', 'this'],
    rules: [
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },
      { pattern: /\/\/.*$/gm, className: 'comment' },
      { pattern: /"(?:[^"\\]|\\.)*"/g, className: 'string' },
      { pattern: /'(?:[^'\\]|\\.)*'/g, className: 'string' },
      { pattern: /\b\d+\.?\d*[fFlL]?\b/g, className: 'number' },
      { pattern: /\b(true|false|NULL|nullptr)\b/g, className: 'boolean' },
      { pattern: /\b(int|float|double|char|bool|void|const|static|extern|inline|virtual|class|struct|enum|union|namespace|using|typedef|template|typename|public|private|protected|if|else|for|while|do|switch|case|default|break|continue|return|try|catch|throw|new|delete|this)\b/g, className: 'keyword' },
      { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, className: 'class-name' },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, className: 'function' },
    ]
  },
  sql: {
    name: 'SQL',
    extensions: ['.sql'],
    keywords: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'VIEW', 'DATABASE', 'SCHEMA', 'GRANT', 'REVOKE', 'COMMIT', 'ROLLBACK', 'TRANSACTION', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'ON', 'AS', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'LIKE', 'IN', 'BETWEEN', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET'],
    rules: [
      { pattern: /--.*$/gm, className: 'comment' },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },
      { pattern: /'(?:[^'\\]|\\.)*'/g, className: 'string' },
      { pattern: /\b\d+\.?\d*\b/g, className: 'number' },
      { pattern: /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|INDEX|VIEW|DATABASE|SCHEMA|GRANT|REVOKE|COMMIT|ROLLBACK|TRANSACTION|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|ON|AS|AND|OR|NOT|NULL|IS|LIKE|IN|BETWEEN|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET)\b/gi, className: 'keyword' },
    ]
  },
  yaml: {
    name: 'YAML',
    extensions: ['.yaml', '.yml'],
    keywords: [],
    rules: [
      { pattern: /#.*$/gm, className: 'comment' },
      { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*(?=\s*:)/gm, className: 'key' },
      { pattern: /"[^"]*"/g, className: 'string' },
      { pattern: /'[^']*'/g, className: 'string' },
      { pattern: /\b\d+\.?\d*\b/g, className: 'number' },
      { pattern: /\b(true|false|null|yes|no|on|off)\b/gi, className: 'boolean' },
    ]
  },
  xml: {
    name: 'XML',
    extensions: ['.xml'],
    keywords: [],
    rules: [
      { pattern: /<!--[\s\S]*?-->/g, className: 'comment' },
      { pattern: /<\?[\s\S]*?\?>/g, className: 'processing-instruction' },
      { pattern: /<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s+[a-zA-Z][a-zA-Z0-9]*(?:=(?:"[^"]*"|'[^']*'))?)*\s*\/?>/g, className: 'tag' },
      { pattern: /"[^"]*"/g, className: 'string' },
      { pattern: /'[^']*'/g, className: 'string' },
    ]
  },
  plaintext: {
    name: 'Plain Text',
    extensions: ['.txt'],
    keywords: [],
    rules: []
  }
};

export const detectLanguage = (code: string, filename?: string): SupportedLanguage => {
  if (filename) {
    const extension = '.' + filename.split('.').pop()?.toLowerCase();
    for (const [lang, def] of Object.entries(languages)) {
      if (def.extensions.includes(extension)) {
        return lang as SupportedLanguage;
      }
    }
  }

  // Simple detection based on content
  if (code.includes('import React') || code.includes('from "react"')) {
    return code.includes('interface') || code.includes('type') ? 'tsx' : 'jsx';
  }
  if (code.includes('interface') || code.includes('type') || code.includes(': string')) {
    return 'typescript';
  }
  if (code.includes('function') || code.includes('const') || code.includes('let')) {
    return 'javascript';
  }
  if (code.includes('<!DOCTYPE') || code.includes('<html')) {
    return 'html';
  }
  if (code.includes('def ') || code.includes('import ') || code.includes('from ')) {
    return 'python';
  }
  if (code.includes('SELECT') || code.includes('FROM') || code.includes('WHERE')) {
    return 'sql';
  }
  if (code.includes('#!') || code.includes('#!/bin/bash')) {
    return 'bash';
  }
  if (code.includes('{') && code.includes('"')) {
    return 'json';
  }

  return 'plaintext';
};
