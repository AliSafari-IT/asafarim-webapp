import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "@asafarim/sidebar";
import "./App.css"; 
import { PackageLinks } from "@asafarim/shared";
import { BiSolidDashboard, BiTask, BiCalendar, BiHelpCircle } from "react-icons/bi";
import { VscFolderOpened } from "react-icons/vsc";
import { RiShieldUserLine } from "react-icons/ri";
import { MdOutlinePassword } from "react-icons/md";
import { TbDeviceMobile } from "react-icons/tb";
import { FiSettings, FiMonitor, FiChevronLeft, FiChevronRight, FiSun, FiMoon } from "react-icons/fi";

const App: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [position, setPosition] = useState<"left" | "right">("left");
  const [overlay, setOverlay] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string>("dashboard");
  const [sidebarWidth, setSidebarWidth] = useState("280px");
  const [collapsedWidth, setCollapsedWidth] = useState("55px");
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setOverlay(true);
    }
  }, [isMobile]);
  
  // Mock data for sidebar items with React icons for better accessibility and visual consistency
  const sidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <BiSolidDashboard aria-hidden="true" />,
    onClick: () => setSelectedItem("dashboard"),
  },
  {
    id: "projects",
    label: "Projects",
    icon: <VscFolderOpened aria-hidden="true" />,
    badge: "3",
    children: [
      {
        id: "active",
        label: "Active Projects",
        icon: <VscFolderOpened aria-hidden="true" />,
        onClick: () => setSelectedItem("active"),
      },
      {
        id: "archived",
        label: "Archived Projects",
        icon: <VscFolderOpened aria-hidden="true" />,
        onClick: () => setSelectedItem("archived"),
      },
    ],
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: <BiTask aria-hidden="true" />,
    badge: "5",
    onClick: () => setSelectedItem("tasks"),
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: <BiCalendar aria-hidden="true" />,
    onClick: () => setSelectedItem("calendar"),
  },
  {
    id: "settings",
    label: "Settings",
    icon: <FiSettings aria-hidden="true" />,
    children: [
      {
        id: "profile",
        label: "Profile",
        icon: <RiShieldUserLine aria-hidden="true" />,
        onClick: () => setSelectedItem("profile"),
      },
      {
        id: "preferences",
        label: "Preferences",
        icon: <FiMonitor aria-hidden="true" />,
        onClick: () => setSelectedItem("preferences"),
      },
      {
        id: "security",
        label: "Security",
        icon: <RiShieldUserLine aria-hidden="true" />,
        onClick: () => setSelectedItem("security"),
        children: [
          {
            id: "password",
            label: "Password",
            icon: <MdOutlinePassword aria-hidden="true" />,
            onClick: () => setSelectedItem("password"),
          },
          {
            id: "2fa",
            label: "Two-Factor Auth",
            icon: <TbDeviceMobile aria-hidden="true" />,
            onClick: () => setSelectedItem("2fa"),
          },
        ],
      },
    ],
  },
  {
    id: "help",
    label: "Help & Support",
    icon: <BiHelpCircle aria-hidden="true" />,
    onClick: () => setSelectedItem("help"),
    disabled: true,
  },
];

  // Initialize theme from system preference or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(savedTheme as "light" | "dark");
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Update theme in DOM and localStorage when theme state changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "dark" ? "light" : "dark");
  };

  const handleToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  const handleItemClick = (item: any) => {
    setSelectedItem(item.label);
    setIsCollapsed(false);
  };

  // Update sidebar width based on collapsed state
  useEffect(() => {
    if (isCollapsed) {
      setSidebarWidth("55px");
      setCollapsedWidth("55px");
    } else {
      setSidebarWidth("250px");
      setCollapsedWidth("55px");
    }
  }, [isCollapsed]);

  // Custom logo with proper contrast for accessibility
  const logo = (
    <div className="logo" role="banner">
      <span className="logo-text">ASafariM</span>
    </div>
  );

  // Footer with proper semantic markup
  const footer = (
    <div className="footer-content" role="contentinfo">
      <span>© {new Date().getFullYear()} ASafariM</span>
    </div>
  );

  // Content margin styles based on sidebar position
  const sidebarLeftStyle = {
    marginLeft: isCollapsed ? collapsedWidth : sidebarWidth,
    marginRight: "auto",
    transition: "margin var(--transition-normal)"
  };

  const sidebarRightStyle = {
    marginRight: isCollapsed ? collapsedWidth : sidebarWidth,
    marginLeft: "auto",
    transition: "margin var(--transition-normal)"
  };

  return (
    <div className="app-container">
      {/* Sidebar component with React icon integration */}
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
        aria-label="Main navigation"
      />

      {/* Main content area with proper ARIA roles */}
      <main
        className="content"
        style={position === "left" ? sidebarLeftStyle : sidebarRightStyle}
        ref={contentRef}
      >
        <header className="demo-header">
          <h1 className="demo-title">ASafariM Sidebar Demo</h1>
          <PackageLinks
            packageName="@asafarim/sidebar"
            githubPath="packages/sidebar"
            demoPath="packages/sidebar"
          />
          {/* Theme toggle button */}
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
          </button>
        </header>

        <section className="demo-section card">
          <h2>Sidebar Controls</h2>
          <div className="controls-grid">
            <div className="control-group">
              <label htmlFor="collapsed">Collapsed State</label>
              <button 
                id="collapsed"
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-pressed={isCollapsed}
              >
                {isCollapsed ? (
                  <>
                    <FiChevronRight aria-hidden="true" /> Expand Sidebar
                  </>
                ) : (
                  <>
                    <FiChevronLeft aria-hidden="true" /> Collapse Sidebar
                  </>
                )}
              </button>
            </div>

            <div className="control-group">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value as "light" | "dark")}
                aria-label="Select theme"
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
                onChange={(e) => setPosition(e.target.value as "left" | "right")}
                aria-label="Select sidebar position"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="overlay-toggle">Overlay Mode</label>
              <button 
                id="overlay-toggle"
                onClick={() => setOverlay(!overlay)}
                aria-pressed={overlay}
                className={overlay ? "active" : ""}
              >
                {overlay ? "Disable Overlay" : "Enable Overlay"}
              </button>
              <small className="text-muted">Recommended for mobile devices</small>
            </div>

            <div className="control-group">
              <label htmlFor="toggle-button">Toggle Button</label>
              <button 
                id="toggle-button"
                onClick={() => setShowToggleButton(!showToggleButton)}
                aria-pressed={showToggleButton}
                className={showToggleButton ? "active" : ""}
              >
                {showToggleButton ? "Hide Toggle Button" : "Show Toggle Button"}
              </button>
            </div>
          </div>
        </section>

        <section className="demo-section card">
          <h2>Selected Item</h2>
          <div className="selected-item-display">
            {selectedItem ? (
              <p className="text-success">
                <strong>You selected:</strong> {selectedItem}
              </p>
            ) : (
              <p className="text-muted">No item selected. Click an item in the sidebar.</p>
            )}
          </div>
        </section>

        <section className="demo-section card">
          <h2>About This Demo</h2>
          <p>
            This demo showcases the <code>@asafarim/sidebar</code> component with various
            configuration options. You can experiment with different settings
            using the controls above.
          </p>
          
          <h3>Features</h3>
          <div className="features-grid">
            <div className="feature-item">
              <h4>Navigation</h4>
              <ul>
                <li>Collapsible sidebar</li>
                <li>Nested menu items</li>
                <li>Keyboard navigation</li>
              </ul>
            </div>
            
            <div className="feature-item">
              <h4>Appearance</h4>
              <ul>
                <li>Light and dark themes</li>
                <li>Left and right positioning</li>
                <li>Custom width configuration</li>
              </ul>
            </div>

            <div className="feature-item">
              <h4>Customization</h4>
              <ul>
                <li>Custom logo and footer</li>
                <li>Badges and icons</li>
                <li>Flexible styling options</li>
              </ul>
            </div>
            
            <div className="feature-item">
              <h4>Responsiveness</h4>
              <ul>
                <li>Mobile-friendly overlay mode</li>
                <li>Adaptive layout</li>
                <li>Touch-friendly targets</li>
              </ul>
            </div>
          </div>
        </section>
        
        <footer className="demo-footer">
          <p>Built with <span aria-hidden="true">❤️</span><span className="sr-only">love</span> by ASafariM</p>
          <p className="text-muted">Part of the ASafariM Web Application UI Component Library</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
