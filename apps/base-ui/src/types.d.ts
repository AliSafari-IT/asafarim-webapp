declare module '@asafarim/simple-md-viewer' {
  import { ReactNode, FC } from 'react';

  interface ThemeProviderProps {
    theme: string;
    toggleTheme: () => void;
    children: ReactNode;
  }

  interface MarkdownContentProps {
    apiBaseUrl: string;
    showHomePage?: boolean;
    hideFileTree?: boolean;
    hideHeader?: boolean;
    hideFooter?: boolean;
    basePath?: string;
  }

  export interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'folder';
    children?: FileNode[];
  }

  export const ThemeProvider: FC<ThemeProviderProps>;
  export const MarkdownContent: FC<MarkdownContentProps>;
}

declare module 'react-router-dom' {
  import * as React from 'react';
  import { Location } from 'history';

  export interface RouteObject {
    caseSensitive?: boolean;
    children?: RouteObject[];
    element?: React.ReactNode;
    index?: boolean;
    path?: string;
  }

  export interface RouteProps {
    caseSensitive?: boolean;
    children?: React.ReactNode;
    element?: React.ReactNode;
    index?: boolean;
    path?: string;
  }

  export class Route extends React.Component<RouteProps> { }

  export interface RoutesProps {
    children?: React.ReactNode;
    location?: Location;
  }

  export class Routes extends React.Component<RoutesProps> { }

  export interface BrowserRouterProps {
    basename?: string;
    children?: React.ReactNode;
    window?: Window;
  }

  export class BrowserRouter extends React.Component<BrowserRouterProps> { }

  export interface HashRouterProps {
    basename?: string;
    children?: React.ReactNode;
    window?: Window;
  }

  export class HashRouter extends React.Component<HashRouterProps> { }

  export function useNavigate(): (to: string, options?: { replace?: boolean; state?: unknown }) => void;
  export function useParams<T extends Record<string, string | undefined>>(): T;
  export function useLocation(): Location;
}