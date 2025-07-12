import React from 'react';
import { MarkdownExplorer } from '../../src';
import { FileNode } from '../../src/types';
import './scrollable-explorer.css';

interface ScrollableMarkdownExplorerProps {
  fileTree: FileNode;
  theme: 'light' | 'dark';
  enableSearch?: boolean;
  showBreadcrumbs?: boolean;
  className?: string;
}

const ScrollableMarkdownExplorer: React.FC<ScrollableMarkdownExplorerProps> = ({
  fileTree,
  theme,
  enableSearch = true,
  showBreadcrumbs = true,
  className = ''
}) => {
  return (
    <div className={`scrollable-explorer-wrapper ${className}`}>
      <MarkdownExplorer
        fileTree={fileTree}
        theme={theme}
        enableSearch={enableSearch}
        showBreadcrumbs={showBreadcrumbs}
        className="scrollable-explorer"
      />
    </div>
  );
};

export default ScrollableMarkdownExplorer;
