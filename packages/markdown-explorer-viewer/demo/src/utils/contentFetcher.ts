/**
 * Custom content fetcher for markdown files
 * This fetcher handles loading markdown content from the server
 * It supports both relative and absolute paths
 */

/**
 * Fetch markdown content from a file path
 * @param filePath Path to the markdown file
 * @returns Promise with the markdown content
 */
export async function fetchMarkdownContent(filePath: string): Promise<string> {
  try {
    // Normalize path to ensure it has .md extension for fetching
    const fetchPath = ensureMdExtension(filePath);
    
    // Fetch the content
    const response = await fetch(fetchPath);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch markdown content: ${response.status} ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error fetching markdown content:', error);
    return `# Error Loading Content\n\nFailed to load content for: ${filePath}\n\n${error}`;
  }
}

/**
 * Ensure a path has .md extension for fetching
 * @param path Path to normalize
 * @returns Path with .md extension
 */
function ensureMdExtension(path: string): string {
  // Remove leading slash for relative paths
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Add .md extension if not present
  if (!normalizedPath.endsWith('.md')) {
    return `${normalizedPath}.md`;
  }
  
  return normalizedPath;
}
