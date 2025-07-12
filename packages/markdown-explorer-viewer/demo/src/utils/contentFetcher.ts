/**
 * Custom content fetcher for markdown files
 * This fetcher handles loading markdown content from the server
 * It fetches content using the server's API endpoints
 */

/**
 * Fetch markdown content from a file path
 * @param filePath Path to the markdown file
 * @returns Promise with the markdown content
 */
export async function fetchMarkdownContent(filePath: string): Promise<string> {
  try {
    // Remove leading slash for API endpoint
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    
    // Use the server's API endpoint to fetch content
    const apiUrl = `http://localhost:3011/api/md-content/${cleanPath}`;
    console.log(`🔍 Fetching markdown content from: ${apiUrl}`);
    console.log(`📄 Original filePath: ${filePath}, cleanPath: ${cleanPath}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch markdown content: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Content fetched successfully:`, { 
      length: data.content?.length, 
      firstChars: data.content?.substring(0, 100) + '...' 
    });
    
    return data.content;
  } catch (error) {
    console.error('❌ Error fetching markdown content:', error);
    return `# Error Loading Content\n\nFailed to load content for: ${filePath}\n\n${error}`;
  }
}
