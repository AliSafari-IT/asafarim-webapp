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
  const sidebarWidth = '260px';
  const collapsedWidth = isSidebarCollapsed ? '60px' : sidebarWidth;
  const sidebarStyle = {
    marginLeft: collapsedWidth,
    width: `calc(100% - ${collapsedWidth})`,
    transition: 'margin-left 0.3s ease, width 0.3s ease'
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

  return (
    <div className={`${styles.layout} ${styles[theme]} animate-fade-scale`} style={{ width: '100%', overflow: 'hidden', margin: 0, padding: 0 }}>
      <Header 
        title={title}
        theme={theme}
        brandImage={brandImage}
        brandImageAlt={brandImageAlt}
        onThemeToggle={onThemeToggle}
        showSearch={true}
        style={sidebarStyle}
        onFilesSidebarToggle={() => handleSidebarToggle(!isSidebarCollapsed)}
        isFilesSidebarVisible={!isSidebarCollapsed}
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
          position="left"
          overlay={false}
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
