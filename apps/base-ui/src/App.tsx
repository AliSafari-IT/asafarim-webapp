import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "./components/layout";
import { AppRouter } from "./router/AppRouter";
import { useTheme } from "./context";
import type { SidebarItemType } from "@asafarim/sidebar";
import "./App.css";

const App: React.FC = () => {
  const { effectiveTheme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  // Check if we're in documentation explorer mode
  const isDocumentationExplorer =
    location.pathname.startsWith("/docs/") || location.pathname === "/docs";

  // Detect mobile view to always show sidebar in mobile mode
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sidebarItems: SidebarItemType[] = [
    {
      id: "home",
      label: "Home",
      icon: "🏠",
      url: "/",
    },
    {
      id: "documentation",
      label: "Documentation",
      icon: "📚",
      url: "/md-docs",
    },
    {
      id: "projects",
      label: "Projects",
      icon: "📋",
      url: "/projects",
      children: [
        {
          id: "portfolio",
          label: "Portfolio",
          url: "/projects/portfolio",
        },
        {
          id: "web-apps",
          label: "Web Apps",
          url: "/projects/web-apps",
        },
        {
          id: "mobile-apps",
          label: "Mobile Apps",
          url: "/projects/mobile-apps",
        },
      ],
    },
    {
      id: "components",
      label: "UI Components",
      icon: "🧩",
      url: "/components",
      children: [
        {
          id: "project-cards",
          label: "Project Cards",
          url: "/components/project-cards",
        },
        {
          id: "paginated-grid",
          label: "Paginated Grid",
          url: "/components/paginated-grid",
        },
        {
          id: "sidebar",
          label: "Sidebar",
          url: "/components/sidebar",
        },
      ],
    },

    {
      id: "about",
      label: "About",
      icon: "👤",
      url: "/about",
    },
    {
      id: "contact",
      label: "Contact",
      icon: "📧",
      url: "/contact",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
      url: "/settings",
      children: [
        {
          id: "theme",
          label: "Theme Settings",
          url: "/settings/theme",
        },
        {
          id: "preferences",
          label: "Preferences",
          url: "/settings/preferences",
        },
      ],
    },
  ];

  // Theme toggle is handled by the context's toggleTheme

  return (
    <Layout
      brandImage="/logoT.svg"
      brandImageAlt="ASafariM Logo"
      title="ASafariM"
      theme={effectiveTheme}
      sidebarItems={sidebarItems}
      showSidebar={isMobile || isDocumentationExplorer}
      onThemeToggle={toggleTheme}
    >
      <AppRouter />
    </Layout>
  );
};

export default App;
