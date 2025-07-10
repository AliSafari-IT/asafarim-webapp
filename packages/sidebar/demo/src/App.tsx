import React, { useEffect, useState } from 'react';
import { Sidebar } from '@asafarim/sidebar';
import './App.css';

// Mock data for sidebar items
const sidebarItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    onClick: () => console.log('Dashboard clicked')
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: '📁',
    badge: '3',
    children: [
      {
        id: 'active',
        label: 'Active Projects',
        icon: '✅',
        onClick: () => console.log('Active projects clicked')
      },
      {
        id: 'archived',
        label: 'Archived Projects',
        icon: '📦',
        onClick: () => console.log('Archived projects clicked')
      }
    ]
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: '📝',
    badge: '5',
    onClick: () => console.log('Tasks clicked')
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: '📅',
    onClick: () => console.log('Calendar clicked')
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    children: [
      {
        id: 'profile',
        label: 'Profile',
        icon: '👤',
        onClick: () => console.log('Profile clicked')
      },
      {
        id: 'preferences',
        label: 'Preferences',
        icon: '🔧',
        onClick: () => console.log('Preferences clicked')
      },
      {
        id: 'security',
        label: 'Security',
        icon: '🔒',
        onClick: () => console.log('Security clicked'),
        children: [
          {
            id: 'password',
            label: 'Password',
            icon: '🔑',
            onClick: () => console.log('Password clicked')
          },
          {
            id: '2fa',
            label: 'Two-Factor Auth',
            icon: '📱',
            onClick: () => console.log('2FA clicked')
          }
        ]
      }
    ]
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: '❓',
    onClick: () => console.log('Help clicked'),
    disabled: true
  }
];

const App: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [position, setPosition] = useState<'left' | 'right'>('left');
  const [overlay, setOverlay] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState('250px');
  const [collapsedWidth, setCollapsedWidth] = useState('55px');

  const handleToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    console.log(`Sidebar is now ${collapsed ? 'collapsed' : 'expanded'}`);
  };

  const handleItemClick = (item: any) => {
    setSelectedItem(item.label);
    console.log(`Item clicked: ${item.label}`);
  };

  const logo = <div className="logo">ASafariM</div>;
  const footer = <div className="footer-content">© 2025 ASafariM</div>;

  useEffect(() => {
    console.log(`Sidebar width: ${sidebarWidth}`);
    console.log(`Collapsed width: ${collapsedWidth}`);
    if (isCollapsed) {
      setSidebarWidth('55px');
      setCollapsedWidth('55px');
    } else {
      setSidebarWidth('250px');
      setCollapsedWidth('55px');
    }
  }, [isCollapsed]);

  const sidebarLeftStyle = {
    marginLeft: isCollapsed ? collapsedWidth : sidebarWidth,
    marginRight: 'auto'
  };

  const sidebarRightStyle = {
    marginRight: isCollapsed ? collapsedWidth : sidebarWidth,
    marginLeft: 'auto'
  };

  return (
    <div className="app-container">
      <Sidebar
        items={sidebarItems}
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
        theme={theme}
        position={position}
        overlay={overlay}
        showToggleButton={showToggleButton}
        logo={logo}
        footer={footer}
        onItemClick={handleItemClick}
        sidebarWidth={sidebarWidth}
        collapsedWidth={collapsedWidth}
        className="sidebar"
      />

      <div className="content" style={ position=='left' ? sidebarLeftStyle : sidebarRightStyle }>
        <h1>ASafariM Sidebar Demo</h1>
        
        <div className="demo-controls">
          <h2>Sidebar Controls</h2>
          
          <div className="control-group">
            <label htmlFor="collapsed">Collapsed State</label>
            <button onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            </button>
          </div>
          
          <div className="control-group">
            <label htmlFor="theme">Theme</label>
            <select 
              id="theme" 
              value={theme} 
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          
          <div className="control-group">
            <label htmlFor="position">Position</label>
            <select 
              id="position" 
              value={position} 
              onChange={(e) => setPosition(e.target.value as 'left' | 'right')}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
          
          <div className="control-group">
            <label htmlFor="overlay">Overlay Mode (for mobile)</label>
            <button onClick={() => setOverlay(!overlay)}>
              {overlay ? 'Disable Overlay' : 'Enable Overlay'}
            </button>
          </div>
          
          <div className="control-group">
            <label htmlFor="toggleButton">Toggle Button</label>
            <button onClick={() => setShowToggleButton(!showToggleButton)}>
              {showToggleButton ? 'Hide Toggle Button' : 'Show Toggle Button'}
            </button>
          </div>
        </div>

        <div className="demo-section">
          <h2>Selected Item</h2>
          <p>{selectedItem ? `You selected: ${selectedItem}` : 'No item selected'}</p>
        </div>

        <div className="demo-section">
          <h2>About This Demo</h2>
          <p>
            This demo showcases the @asafarim/sidebar component with various configuration options.
            You can experiment with different settings using the controls above.
          </p>
          <p>
            The sidebar component supports:
          </p>
          <ul>
            <li>Collapsible navigation</li>
            <li>Nested menu items</li>
            <li>Light and dark themes</li>
            <li>Left and right positioning</li>
            <li>Mobile-friendly overlay mode</li>
            <li>Custom logo and footer</li>
            <li>Badges and icons</li>
            <li>Keyboard navigation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
