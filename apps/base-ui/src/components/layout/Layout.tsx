import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@asafarim/sidebar';
import type { SidebarItemType } from '@asafarim/sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  brandImage?: string;
  brandImageAlt?: string;
  sidebarItems?: SidebarItemType[];
  theme?: 'light' | 'dark';
  showSidebar?: boolean;
  title?: string;
  onThemeToggle?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  brandImage,
  brandImageAlt,
  sidebarItems = [],
  theme = 'light',
  showSidebar = true,
  title = 'ASafariM',
  onThemeToggle
}) => {
  const navigate = useNavigate();
  const isMobileView = window.innerWidth <= 768;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isMobileView);
  const [position, setPosition] = useState<'left' | 'right'>('left');

  const sidebarWidth = '260px';
  const collapsedWidth = isSidebarCollapsed ? '60px' : sidebarWidth;
  const sidebarStyle = {
    marginLeft: position === 'left' ? collapsedWidth : 0,
    marginRight: position === 'right' ? collapsedWidth : 0,
    width: `calc(100% - ${collapsedWidth})`,
    transition: 'margin-left 0.3s ease, margin-right 0.3s ease, width 0.3s ease'
  };
  // Default to expanded sidebar on desktop, collapsed on mobile

  // Check if the screen is mobile-sized and set sidebar state accordingly
  useEffect(() => {
    const checkMobile = () => {      
      // On mobile, default to collapsed sidebar but don't force it if user has toggled
      if (isMobileView && !document.documentElement.hasAttribute('sidebar-toggled')) {
        setIsSidebarCollapsed(true); // Default to collapsed on mobile
      }
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // No need for overlay effect since we're using a unified approach that pushes content

  const handleSidebarToggle = (collapsed: boolean) => {
    // Mark that the sidebar has been manually toggled
    document.documentElement.setAttribute('sidebar-toggled', 'true');
    
    // Update sidebar collapsed state
    setIsSidebarCollapsed(collapsed);
  };

  const handleSidebarItemClick = (item: SidebarItemType) => {
    if (item.url) {
      navigate(item.url);
    }
    if (item.onClick) {
      item.onClick();
    }
  };

  const finalSidebarItems = sidebarItems.length > 0 ? sidebarItems : [];
  // Sidebar items are determined by props or defaults
  // sidebar footer
  const footer = <div className={styles.sidebarFooter}>
    <div className={styles.footerContent}>
      {!isSidebarCollapsed ? <p>© 2025 ASafariM</p> : null}
    </div>
    {!isMobileView ? (
      <button 
        onClick={() => setPosition(position === 'left' ? 'right' : 'left')}
        aria-label={position === 'left' ? 'Move sidebar to right' : 'Move sidebar to left'}
        type="button"
        className={styles.sidebarPositionToggle}
        title={position === 'left' ? 'Move sidebar to right' : 'Move sidebar to left'}
      >
        {position === 'left' ? '❯' : '❮'}
      </button>
    ) : null}
  </div>;

  // Logo
  const logo = <a href="/" className={styles.logoLink}>
  {brandImage && (
    <img
      src={brandImage}
      alt={brandImageAlt || "Brand Logo"}
      className={`${styles.brandImage} ${styles.logo}`}
      width={30}
    />
  )}
  <h3 className={styles.title}>{title}</h3>
</a>;

  return (
    <div className={`${styles.layout} ${styles[theme]} animate-fade-scale`} style={{ width: '100%', overflow: 'hidden', margin: 0, padding: 0 }}>
      <Header 
        theme={theme}
        onThemeToggle={onThemeToggle}
        showSearch={true}
        style={sidebarStyle}
      />
      
      <div className={styles.body}>
        {/* Single sidebar implementation for both mobile and desktop */}
        <Sidebar
          items={finalSidebarItems}
          isCollapsed={isSidebarCollapsed}
          onToggle={handleSidebarToggle}
          theme={theme}
          className={styles.sidebar}
          showToggleButton={true}
          onItemClick={handleSidebarItemClick}
          sidebarWidth={sidebarWidth}
          collapsedWidth={collapsedWidth}
          position={position}
          overlay={false}
          footer={footer}
          logo={logo}
        />
        
        <main 
          className={`${styles.main} ${!showSidebar ? styles.fullWidth : ''}`}
          style={sidebarStyle}
        >
          <div className={styles.content}>
            {children}
          </div>
        </main>
      </div>
      
      <Footer 
        theme={theme} 
        style={sidebarStyle}
      />
    </div>
  );
};
