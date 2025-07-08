import React from 'react';
import type { SidebarItemType } from '@asafarim/sidebar';

export interface LayoutProps {
  children: React.ReactNode;
  sidebarItems?: SidebarItemType[];
  theme?: 'light' | 'dark';
  showSidebar?: boolean;
  title?: string;
}

export interface HeaderProps {
  title: string;
  theme: 'light' | 'dark';
}

export interface FooterProps {
  theme: 'light' | 'dark';
}
