import React from 'react';
import { BreadcrumbsProps } from '../types';
import { generateBreadcrumbs } from '../utils';
import styles from './Breadcrumbs.module.css';

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  path,
  rootPath = '/',
  theme = 'light',
  onPathClick,
  className = ''
}) => {
  const breadcrumbs = generateBreadcrumbs(path, rootPath);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`${styles.breadcrumbs} ${className}`} aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className={styles.breadcrumbItem}>
          {index === 0 && (
            <span className={styles.homeIcon} aria-hidden="true">
              🏠
            </span>
          )}
          
          {index < breadcrumbs.length - 1 ? (
            <>
              <button
                className={styles.breadcrumbLink}
                onClick={() => onPathClick(crumb.path)}
                type="button"
              >
                {crumb.name}
              </button>
              <span className={styles.breadcrumbSeparator} aria-hidden="true">
                /
              </span>
            </>
          ) : (
            <span className={styles.breadcrumbCurrent} aria-current="page">
              {crumb.name}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};
