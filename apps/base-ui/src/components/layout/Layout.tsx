import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@asafarim/sidebar';
import type { SidebarItemType } from '@asafarim/sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  sidebarItems?: SidebarItemType[];
  theme?: 'light' | 'dark';
  showSidebar?: boolean;
  title?: string;
  onThemeToggle?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  sidebarItems = [],
  theme = 'light',
  showSidebar = true,
  title = 'Base UI App',
  onThemeToggle
}) => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const defaultSidebarItems: SidebarItemType[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      url: '/',
    },
    {
      id: 'projects',
      label: 'Projects', 
      icon: '📋',
      url: '/projects',
      children: [
        {
          id: 'all-projects',
          label: 'All Projects',
          url: '/projects/all',
        },
        {
          id: 'my-projects',
          label: 'My Projects',
          url: '/projects/my',
        },
        {
          id: 'archived',
          label: 'Archived',
          url: '/projects/archived',
        }
      ]
    },
    {
      id: 'components',
      label: 'Components',
      icon: '🧩',
      url: '/components',
      children: [
        {
          id: 'ui-components',
          label: 'UI Components',
          url: '/components/ui',
        },
        {
          id: 'layout-components',
          label: 'Layout',
          url: '/components/layout',
        }
      ]
    },
    {
      id: 'documentation',
      label: 'Documentation',
      icon: '📚',
      url: '/docs',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      url: '/settings',
      children: [
        {
          id: 'profile',
          label: 'Profile',
          url: '/settings/profile',
        },
        {
          id: 'preferences',
          label: 'Preferences',
          url: '/settings/preferences',
        }
      ]
    }
  ];

  const handleSidebarToggle = (collapsed: boolean) => {
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

  const handleMenuToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const finalSidebarItems = sidebarItems.length > 0 ? sidebarItems : defaultSidebarItems;

  return (
    <div className={`${styles.layout} ${styles[theme]} animate-fade-scale`}>
      <Header 
        title={title}
        theme={theme}
        onThemeToggle={onThemeToggle}
        onMenuToggle={handleMenuToggle}
        showSearch={true}
      />
      
      <div className={styles.body}>
        {showSidebar && (
          <Sidebar
            items={finalSidebarItems}
            isCollapsed={isSidebarCollapsed}
            onToggle={handleSidebarToggle}
            theme={theme}
            className={styles.sidebar}
            showToggleButton={true}
            onItemClick={handleSidebarItemClick}
            width="260px"
            collapsedWidth="60px"
          />
        )}
        
        <main className={`${styles.main} ${!showSidebar ? styles.fullWidth : ''}`}>
          <div className={styles.content}>
            {children}
          </div>
        </main>
      </div>
      
      <Footer theme={theme} />
    </div>
  );
};
