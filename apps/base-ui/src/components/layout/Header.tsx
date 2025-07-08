import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Header.module.css';

interface HeaderProps {
  title: string;
  theme: 'light' | 'dark';
  onThemeToggle?: () => void;
  onMenuToggle?: () => void;
  showSearch?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  theme,
  onThemeToggle,
  onMenuToggle,
  showSearch = true
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(3);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleNotificationClick = () => {
    console.log('Notifications clicked');
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
  };

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ label: 'Home', path: '/', icon: '🏠' }];
    
    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const capitalizedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ 
        label: capitalizedSegment, 
        path: currentPath,
        icon: getIconForPath(segment)
      });
    });
    
    return breadcrumbs;
  };

  const getIconForPath = (segment: string) => {
    const iconMap: { [key: string]: string } = {
      projects: '📋',
      components: '🧩',
      about: '👤',
      contact: '📧',
      settings: '⚙️',
      portfolio: '💼',
      'web-apps': '🌐',
      'mobile-apps': '📱',
      theme: '🎨',
      preferences: '⚙️'
    };
    return iconMap[segment] || '📄';
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className={`${styles.header} ${styles[theme]} animate-fade-in`}>
      <div className={styles.headerContent}>
        <div className={styles.titleSection}>
          {onMenuToggle && (
            <button
              className={styles.navButton}
              onClick={onMenuToggle}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          )}
          <h1 className={styles.title}>{title}</h1>
          
          <nav className={styles.breadcrumb}>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && <span className={styles.breadcrumbSeparator}>›</span>}
                <div className={styles.breadcrumbItem}>
                  <span>{crumb.icon}</span>
                  <span>{crumb.label}</span>
                </div>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {showSearch && (
          <div className={styles.searchContainer}>
            <div className={styles.searchIcon}>🔍</div>
            <input
              type="text"
              placeholder="Search projects, components..."
              value={searchQuery}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>
        )}
        
        <div className={styles.headerActions}>
          <nav className={styles.navigation}>
            {onThemeToggle && (
              <button
                className={styles.navButton}
                onClick={onThemeToggle}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            )}
            
            <button
              className={styles.navButton}
              onClick={handleNotificationClick}
              aria-label="Notifications"
              title="Notifications"
            >
              🔔
              {notificationCount > 0 && (
                <span className={styles.badge}>{notificationCount}</span>
              )}
            </button>
            
            <button
              className={styles.navButton}
              onClick={handleProfileClick}
              aria-label="User profile"
              title="User profile"
            >
              👤
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
