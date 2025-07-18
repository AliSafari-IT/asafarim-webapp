import React, { useEffect, useState } from "react";
import { Sidebar } from "@asafarim/sidebar";
import type { SidebarItemType } from "@asafarim/sidebar";
import "./SidebarComponent.css";
import { useNavigate } from "react-router-dom";
export function SidebarComponent({
  items,
  logo,
  footer,
  theme,
  position,
  isCollapsed,
  showToggleButton,
  sidebarWidth,
  collapsedWidth,
  onToggle,
}: {
  items: SidebarItemType[];
  logo: React.ReactNode;
  footer: React.ReactNode;
  theme: "light" | "dark";
  position: "left" | "right";
  isCollapsed: boolean;
  showToggleButton: boolean;
  sidebarWidth: string;
  collapsedWidth: string;
  onToggle: (collapsed: boolean) => void;
}) {
    const [isMobile, setIsMobile] = useState(false);
    const [overlay, setOverlay] = useState(false);
    const navigate = useNavigate();
    
    // Detect mobile view to always show sidebar in mobile mode
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

  // Handle item click to expand sidebar when clicking on items with children
  const handleItemClick = (item: SidebarItemType) => {
    // If sidebar is collapsed and the clicked item has children, expand the sidebar
    if (isCollapsed && item.children && item.children.length > 0) {
      onToggle(false);
    }
    if (item.url) {
      navigate(item.url);
    }
    // If the item has an onClick handler, call it
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <Sidebar
    items={items}
    isCollapsed={isCollapsed}
    onToggle={onToggle}
    theme={theme}
    position={position}
    overlay={overlay}
    showToggleButton={showToggleButton}
    logo={logo}
    footer={footer}
    onItemClick={handleItemClick}
    sidebarWidth={sidebarWidth}
    collapsedWidth={collapsedWidth}
    aria-label="Sidebar Main navigation"
    className="sidebar"
  />
  );
}
