import type { SidebarItemType } from "@asafarim/sidebar";

/**
 * Ensures all documentation paths are properly prefixed with /docs
 * @param path The path to normalize
 * @returns Normalized path with /docs prefix
 */
export const normalizeDocPath = (path: string): string => {
  if (!path) return '/docs';
  return path.startsWith('/docs') ? path : `/docs/${path.replace(/^\//, '')}`;
};

/**
 * Creates a documentation sidebar item with proper path handling
 * @param id Unique identifier for the item
 * @param label Display label for the item
 * @param path Path to the documentation resource
 * @param icon Optional icon for the item
 * @param children Optional child items
 * @returns A properly configured sidebar item
 */
export const createDocItem = (
  id: string,
  label: string,
  path: string,
  icon?: React.ReactNode,
  children?: SidebarItemType[]
): SidebarItemType => {
  return {
    id,
    label,
    icon,
    url: normalizeDocPath(path),
    children
  };
};

/**
 * Updates existing sidebar items to ensure all documentation paths are properly prefixed
 * @param items Array of sidebar items to update
 * @returns Updated sidebar items with normalized paths
 */
export const updateDocumentationPaths = (items: SidebarItemType[]): SidebarItemType[] => {
  return items.map(item => {
    return {
      ...item,
      url: normalizeDocPath(item.url || ''),
      children: item.children ? updateDocumentationPaths(item.children) : undefined
    };   
  });
};
