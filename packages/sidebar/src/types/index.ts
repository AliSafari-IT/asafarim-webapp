import { ReactNode } from 'react';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: string | ReactNode;
  url?: string;
  onClick?: () => void;
  children?: SidebarItem[];
  badge?: string | number;
  disabled?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  isCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  sidebarWidth?: string;
  collapsedWidth?: string;
  className?: string;
  theme?: 'light' | 'dark';
  position?: 'left' | 'right';
  overlay?: boolean;
  showToggleButton?: boolean;
  logo?: ReactNode;
  footer?: ReactNode;
  onItemClick?: (item: SidebarItem) => void;
}

export interface SidebarItemProps {
  item: SidebarItem;
  isCollapsed: boolean;
  level?: number;
  theme: 'light' | 'dark';
  onItemClick?: (item: SidebarItem) => void;
}
