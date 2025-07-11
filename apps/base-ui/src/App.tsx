import './App.css';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from './components/layout';
import { AppRouter } from './router/AppRouter';
import { useTheme } from './context';
import { createDocumentationSidebarItems } from './utils/apiMdDocsUtils';
import type { SidebarItemType } from '@asafarim/sidebar';
import sidebarItems from '@/data/sidebarItems';
import { updateDocumentationPaths } from './utils/docNavigationUtils';

const App: React.FC = () => {
  const { effectiveTheme, toggleTheme } = useTheme();
  const location = useLocation();
  const [documentationItems, setDocumentationItems] = useState<SidebarItemType[]>([]);

  // Check if we're in documentation explorer mode
  const isDocumentationExplorer = location.pathname.startsWith('/docs/') && location.pathname !== '/docs';
  
  // Detect mobile view to always show sidebar in mobile mode
  const [isMobileView, setIsMobileView] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load documentation items asynchronously
  useEffect(() => {
    const loadDocumentationItems = async () => {
      try {
        const items = await createDocumentationSidebarItems();
        setDocumentationItems(items);
      } catch (error) {
        console.error('Failed to load documentation items:', error);
        setDocumentationItems([]);
      }
    };

    loadDocumentationItems();
  }, []);

  // Update the documentation children
const docItem = sidebarItems.find((item: { id: string; }) => item.id === 'documentation');
if (docItem && docItem.children) {
  docItem.children = documentationItems;
}

// Ensure all documentation paths are properly prefixed with /docs
const normalizedSidebarItems = updateDocumentationPaths([...sidebarItems]);

  // Theme toggle is handled by the context's toggleTheme

  return (
    <Layout
      brandImage="/logoT.svg"
      brandImageAlt="ASafariM Logo"
      title="ASafariM"
      theme={effectiveTheme}
      sidebarItems={normalizedSidebarItems}
      showSidebar={isMobileView || !isDocumentationExplorer}
      onThemeToggle={toggleTheme}
    >
      <AppRouter />
    </Layout>
  );
};

export default App;
