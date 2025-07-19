// Custom type declarations for react-router-dom v6
// This resolves the mismatch between react-router-dom v6.8.0 and @types/react-router-dom v5.3.3

declare module 'react-router-dom' {
  import * as React from 'react';

  // Core components
  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string | { pathname: string; search?: string; hash?: string; state?: unknown };
    replace?: boolean;
    state?: unknown;
    reloadDocument?: boolean;
    preventScrollReset?: boolean;
    relative?: 'route' | 'path';
  }
  
  export const Link: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>;
  export const NavLink: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement> & {
    end?: boolean;
    caseSensitive?: boolean;
    className?: string | ((props: { isActive: boolean }) => string);
    style?: React.CSSProperties | ((props: { isActive: boolean }) => React.CSSProperties);
  }>;
  
  // Route components
  export interface RouteProps {
    caseSensitive?: boolean;
    children?: React.ReactNode;
    element?: React.ReactNode | null;
    index?: boolean;
    path?: string;
  }
  
  export const Route: React.FC<RouteProps>;
  export const Routes: React.FC<{ children?: React.ReactNode }>;
  
  // Hooks
  export function useLocation(): {
    pathname: string;
    search: string;
    hash: string;
    state: unknown;
    key: string;
  };
  
  export function useNavigate(): (to: string | number, options?: { replace?: boolean; state?: unknown }) => void;
  export function useParams<T extends Record<string, string | undefined>>(): T;
  export function useSearchParams(): [URLSearchParams, (searchParams: URLSearchParams) => void];
  
  // Router components
  export const BrowserRouter: React.FC<{ children?: React.ReactNode; basename?: string }>;
  export const HashRouter: React.FC<{ children?: React.ReactNode; basename?: string }>;
  export const MemoryRouter: React.FC<{ children?: React.ReactNode; initialEntries?: string[]; initialIndex?: number }>;
  
  // Other exports
  export const Navigate: React.FC<{ to: string; replace?: boolean; state?: unknown }>;
  export const Outlet: React.FC<{ context?: unknown }>;
}
