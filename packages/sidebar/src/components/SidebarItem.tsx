import React, { useState } from 'react';
import { SidebarItemProps } from '../types';
import styles from './Sidebar.module.css';

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isCollapsed,
  level = 0,
  theme,
  onItemClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (item.disabled) return;

    if (hasChildren && !isCollapsed) {
      setIsExpanded(!isExpanded);
    }

    if (item.onClick) {
      item.onClick();
    }

    if (onItemClick) {
      onItemClick(item);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <>
      <div className={styles.navItem} style={{ marginLeft: `${level * 0.5}rem` }}>
        <div
          className={`${styles.navLink} ${item.disabled ? styles.disabled : ''}`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={item.disabled ? -1 : 0}
          role="button"
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-disabled={item.disabled}
        >
          {item.icon && (
            <span className={styles.icon} aria-hidden="true">
              {item.icon}
            </span>
          )}
          
          <span className={styles.label}>
            {item.label}
          </span>

          {item.badge && (
            <span className={styles.badge} aria-label={`${item.badge} notifications`}>
              {item.badge}
            </span>
          )}

          {hasChildren && !isCollapsed && (
            <span
              className={`${styles.arrow} ${isExpanded ? styles.expanded : ''}`}
              aria-hidden="true"
            >
              ▶
            </span>
          )}

          {isCollapsed && (
            <div className={styles.tooltip}>
              {item.label}
              {item.badge && ` (${item.badge})`}
            </div>
          )}
        </div>
      </div>

      {hasChildren && !isCollapsed && (
        <div className={`${styles.submenu} ${isExpanded ? styles.expanded : ''}`}>
          {item.children?.map((child) => (
            <SidebarItem
              key={child.id}
              item={child}
              isCollapsed={isCollapsed}
              level={level + 1}
              theme={theme}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </>
  );
};
