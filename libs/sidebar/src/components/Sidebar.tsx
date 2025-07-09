import React, { useState, useEffect } from 'react';
import { SidebarProps } from '../types';
import { SidebarItem } from './SidebarItem';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  isCollapsed,
  onToggle,
  sidebarWidth = '280px',
  collapsedWidth = '60px',
  className = '',
  theme = 'light',
  position = 'left',
  overlay = false,
  showToggleButton = true,
  logo,
  footer,
  onItemClick
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    
    if (onToggle) {
      onToggle(newCollapsed);
    }
  };

  const handleOverlayClick = () => {
    if (isMobile && overlay) {
      handleToggle();
    }
  };

  const sidebarClasses = [
    styles.sidebar,
    styles[position],
    styles[theme],
    isCollapsed ? styles.collapsed : styles.expanded,
    className
  ].filter(Boolean).join(' ');

  const overlayClasses = [
    styles.overlay,
    overlay && !isCollapsed ? styles.visible : ''
  ].filter(Boolean).join(' ');

  const sidebarStyle = {
    width: isCollapsed ? collapsedWidth : sidebarWidth,
    ...(position === 'right' && { right: 0 })
  };

  return (
    <>
      {overlay && <div className={overlayClasses} onClick={handleOverlayClick} />}
      
      <aside className={sidebarClasses} style={sidebarStyle}>
        {(logo || showToggleButton) && (
          <div className={styles.header}>
            {logo && (
              <div className={styles.logo}>
                {logo}
              </div>
            )}
            
            {showToggleButton && (
              <button
                className={styles.toggleButton}
                onClick={handleToggle}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                type="button"
              >
                <span aria-hidden="true">
                  {isCollapsed ? '☰' : '✕'}
                </span>
              </button>
            )}
          </div>
        )}

        <nav className={styles.nav} role="navigation" aria-label="Main navigation">
          {items.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed || false}
              theme={theme}
              onItemClick={onItemClick}
            />
          ))}
        </nav>

        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </aside>
    </>
  );
};
