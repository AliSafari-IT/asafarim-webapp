import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { MarkdownViewerProps } from '../types';
import { copyToClipboard } from '../utils';
import styles from './MarkdownViewer.module.css';
import 'highlight.js/styles/github.css';

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  content,
  theme = 'light',
  className = '',
  components,
  filePath,
  metadata
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (copiedCode) {
      const timer = setTimeout(() => setCopiedCode(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedCode]);

  const handleCopyCode = async (code: string) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopiedCode(code);
    }
  };

  const customComponents = {
    pre: ({ children, ...props }: any) => {
      const codeElement = React.Children.toArray(children)[0] as React.ReactElement;
      const code = codeElement?.props?.children || '';
      
      return (
        <div className={styles.codeBlockContainer}>
          <pre {...props} className={styles.codeBlock}>
            {children}
          </pre>
          <button
            className={`${styles.copyButton} ${copiedCode === code ? styles.copied : ''}`}
            onClick={() => handleCopyCode(code)}
            title="Copy code"
          >
            {copiedCode === code ? 'Copied!' : 'Copy'}
          </button>
        </div>
      );
    },
    code: ({ node, inline, className, children, ...props }: any) => {
      if (inline) {
        return <code className={className} {...props}>{children}</code>;
      }
      
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return (
        <code className={`${className} hljs`} data-language={language} {...props}>
          {children}
        </code>
      );
    },
    img: ({ src, alt, ...props }: any) => {
      // Handle relative image paths
      const imageSrc = src?.startsWith('./') || src?.startsWith('../') 
        ? `${filePath ? filePath.replace(/\/[^/]*$/, '') : ''}/${src}`
        : src;
        
      return <img src={imageSrc} alt={alt} {...props} loading="lazy" />;
    },
    a: ({ href, children, ...props }: any) => {
      // Open external links in new tab
      const isExternal = href?.startsWith('http://') || href?.startsWith('https://');
      
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      );
    },
    table: ({ children, ...props }: any) => (
      <div className={styles.tableWrapper}>
        <table {...props}>{children}</table>
      </div>
    ),
    ...components
  };

  const renderFrontmatterHeader = () => {
    if (!metadata || Object.keys(metadata).length === 0) {
      return null;
    }

    return (
      <div className={styles.frontmatterHeader}>
        {metadata.title && (
          <h1 className={styles.frontmatterTitle}>{metadata.title}</h1>
        )}
        
        {metadata.description && (
          <p className={styles.frontmatterDescription}>{metadata.description}</p>
        )}
        
        <div className={styles.frontmatterMeta}>
          {metadata.date && (
            <span className={styles.frontmatterDate}>
              📅 {new Date(metadata.date).toLocaleDateString()}
            </span>
          )}
          
          {metadata.tags && Array.isArray(metadata.tags) && metadata.tags.length > 0 && (
            <div className={styles.frontmatterTags}>
              {metadata.tags.map((tag: string, index: number) => (
                <span key={index} className={styles.frontmatterTag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!content || content.trim() === '') {
    return (
      <div className={`${styles.markdownViewer} ${className}`}>
        <div className={styles.emptyState}>
          <h3>No content available</h3>
          <p>This file appears to be empty or could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.markdownViewer} ${className}`}>
      {renderFrontmatterHeader()}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={customComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
