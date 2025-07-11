import React from 'react';
import { Link } from 'react-router-dom';

interface DocLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * DocLink component ensures all documentation links are properly prefixed with /docs
 * This helps maintain consistency between sidebar navigation and markdown explorer
 */
export const DocLink: React.FC<DocLinkProps> = ({ to, children, className, style }) => {
  // Ensure path starts with /docs
  const normalizedPath = to.startsWith('/docs') 
    ? to 
    : `/docs/${to.replace(/^\//, '')}`;
  
  return (
    <Link to={normalizedPath} className={className} style={style}>
      {children}
    </Link>
  );
};

export default DocLink;
