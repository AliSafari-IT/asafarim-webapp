/**
 * Custom content fetcher for markdown files
 * This fetcher handles loading markdown content from the server or static JSON files
 * It supports both relative and absolute paths
 * When deployed to GitHub Pages, it uses pre-generated static JSON files
 */

// Check if we're running in production/GitHub Pages environment
// Using window.location to determine if we're on GitHub Pages
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const baseUrl = isProduction ? '' : 'http://localhost:3011';
const useStaticFiles = isProduction;

// Get the base path for static files in GitHub Pages
// For GitHub Pages, this would be something like '/markdown-explorer-viewer'
const getBasePath = () => {
  if (!isProduction) return '/';
  
  // Extract the repository name from the pathname
  const pathParts = window.location.pathname.split('/');
  if (pathParts.length >= 2 && pathParts[1]) {
    return `/${pathParts[1]}/`;
  }
  return '/';
};

const basePath = getBasePath();

/**
 * Fetch markdown content from a file path
 * @param filePath Path to the markdown file
 * @returns Promise with the markdown content
 */
/**
 * Helper function to fetch content with multiple fallback URL formats
 * @param baseUrl The primary URL to try
 * @returns The markdown content
 */
async function fetchWithFallbacks(baseUrl: string, filePath: string): Promise<string> {
  console.log(`Trying URL: ${baseUrl}`);
  
  try {
    // If we're in production/GitHub Pages environment, use static files
    if (useStaticFiles) {
      // Normalize the path for static file access
      const normalizedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
      
      // Try to fetch from the static JSON files
      // Use the basePath variable defined earlier
      const staticUrl = `${basePath}md-data/content/${normalizedPath}.json`;
      console.log(`Using static file: ${staticUrl}`);
      
      try {
        const response = await fetch(staticUrl);
        if (response.ok) {
          const data = await response.json();
          return data.content || '';
        }
      } catch (staticError) {
        console.error(`Error fetching static file: ${staticError}`);
        // Fall through to try direct content
      }
      
      // Try direct content file as fallback using the basePath variable
      const directContentUrl = `${basePath}md-data/content/${normalizedPath}`;
      console.log(`Trying direct content: ${directContentUrl}`);
      try {
        const directResponse = await fetch(directContentUrl);
        if (directResponse.ok) {
          return await directResponse.text();
        }
      } catch (directError) {
        console.error(`Error fetching direct content: ${directError}`);
      }
      
      throw new Error(`Failed to fetch static content for: ${filePath}`);
    }
    
    // Development environment - use local server
    // First attempt with the provided URL
    const response = await fetch(baseUrl);
    
    if (response.ok) {
      const data = await response.json();
      return data.content || '';
    }
    
    // Extract filename for fallback attempts
    const urlParts = baseUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    // Try alternate URL format with just the filename
    const alternateUrl = `${baseUrl}/api/md-docs/${filename}`;
    console.log(`Trying alternate URL: ${alternateUrl}`);
    const alternateResponse = await fetch(alternateUrl);
    
    if (alternateResponse.ok) {
      const data = await alternateResponse.json();
      return data.content || '';
    }
    
    // Try a third format without any path prefix
    const rootUrl = `${baseUrl}/api/md-docs`;
    console.log(`Trying root URL: ${rootUrl}`);
    const rootResponse = await fetch(rootUrl);
    
    if (rootResponse.ok) {
      const data = await rootResponse.json();
      return data.content || '';
    }
    
    throw new Error(`Failed to fetch content from any URL format for: ${baseUrl}`);
  } catch (error) {
    console.error(`Error in fetchWithFallbacks for ${baseUrl}:`, error);
    throw error;
  }
}

/**
 * Fetch markdown content from a file path
 * @param filePath Path to the markdown file
 * @returns Promise with the markdown content
 */
export async function fetchMarkdownContent(filePath: string): Promise<string> {
  try {
    console.log(`Fetching markdown content for path: ${filePath}`);
    
    let normalizedPath = filePath;
    if (!normalizedPath.startsWith('/')) {
      normalizedPath = `/${normalizedPath}`;
    }
    
    // Special handling for changelog.md - try multiple formats
    if (normalizedPath === '/changelog.md' || 
        normalizedPath === 'changelog.md' || 
        normalizedPath.endsWith('/changelog.md')) {
      console.log('Special handling for changelog.md');
      const apiUrl = `${baseUrl}/api/md-docs/changelog.md`;
      console.log(`Using URL for changelog.md: ${apiUrl}`);
      return await fetchWithFallbacks(apiUrl, 'changelog.md');
    }
    
    // Special handling for README.md
    if (normalizedPath === '/README.md') {
      const apiUrl = `${baseUrl}/api/md-docs/README.md`;
      console.log(`Using URL for README.md: ${apiUrl}`);
      return await fetchWithFallbacks(apiUrl, 'README.md');
    }
    
    // Standard path handling
    const apiUrl = `${baseUrl}/api/md-docs${normalizedPath}`;
    console.log(`Using standard URL: ${apiUrl}`);
    return await fetchWithFallbacks(apiUrl, normalizedPath);
  } catch (error) {
    console.error('Error fetching markdown content:', error);
    return `# Error Loading Content\n\nFailed to load content for: ${filePath}\n\nError: ${error}`;
  }
}


