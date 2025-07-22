import React, { useState, useEffect } from "react";
import { MarkdownContent, ThemeProvider } from "@asafarim/simple-md-viewer";
import "@asafarim/simple-md-viewer/dist/style.css";
import "../styles/documentation.css"; // Import our custom CSS to hide the file tree
import { useNavigate, useLocation, Navigate } from "react-router-dom";

const DocumentationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [theme, setTheme] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem("smv-theme");
    return savedTheme || "light";
  });
  
  // Apply theme to document root for global styling
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  
  // Check if the URL is missing the /docs prefix
  // Only redirect specific documentation paths that should be under /docs
  const docFolders = ['LegalDocs', 'CurrentProjects', 'GettingStarted', 'API', 'Tutorials'];
  
  // Check if the current path starts with any of the doc folders but is missing the /docs prefix
  const shouldRedirect = docFolders.some(folder => 
    location.pathname.startsWith(`/${folder}`) && !location.pathname.startsWith('/docs')
  );
  
  if (shouldRedirect) {
    // Extract the path without any leading slash
    let pathWithoutSlash = location.pathname;
    if (pathWithoutSlash.startsWith('/')) {
      pathWithoutSlash = pathWithoutSlash.substring(1);
    }
    
    const redirectPath = `/docs/${pathWithoutSlash}`;
    console.log(`Redirecting from ${location.pathname} to ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }
  
  // Custom navigation handler to ensure proper URL routing
  const handleNavigation = (path: string) => {
    console.log("Navigation handler received path:", path);
    
    // Intercept all navigation events and ensure they have the /docs/ prefix
    let targetUrl = path;
    
    // Handle absolute URLs (starting with http:// or https://)
    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
      // For external links, allow default navigation
      console.log(`External URL detected: ${targetUrl}, allowing default navigation`);
      return true;
    }
    
    // Handle relative paths from the component
    if (!targetUrl.startsWith('/')) {
      targetUrl = `/${targetUrl}`;
    }
    
    // Special handling for paths that start with specific doc folders
    // This fixes paths like /CurrentProjects/packages/asafarim
    const docFolders = ['LegalDocs', 'CurrentProjects', 'GettingStarted', 'API', 'Tutorials'];
    
    // First check for exact doc folder paths
    for (const folder of docFolders) {
      // Check for paths that include the folder name anywhere in the path
      if (targetUrl.includes(`/${folder}/`) || targetUrl.endsWith(`/${folder}`)) {
        // Extract the path starting from the folder name
        const folderIndex = targetUrl.indexOf(`/${folder}`);
        const pathFromFolder = targetUrl.substring(folderIndex);
        targetUrl = `/docs${pathFromFolder}`;
        console.log(`Fixed doc folder path to: ${targetUrl}`);
        navigate(targetUrl, { replace: true });
        return false;
      }
    }
    
    // Additional check for folder paths that might be subdirectories of doc folders
    // For example: /CurrentProjects/packages or /API/v1
    for (const folder of docFolders) {
      const folderPattern = new RegExp(`^/${folder}/.*$`);
      if (folderPattern.test(targetUrl)) {
        targetUrl = `/docs${targetUrl}`;
        console.log(`Fixed subfolder path to: ${targetUrl}`);
        navigate(targetUrl, { replace: true });
        return false;
      }
    }
    
    // Check if path is already properly prefixed with /docs
    if (!targetUrl.startsWith('/docs/') && !targetUrl.startsWith('/docs')) {
      // Extract the path without any potential /docs prefix to avoid duplication
      let pathWithoutPrefix = targetUrl;
      if (pathWithoutPrefix.startsWith('/')) {
        pathWithoutPrefix = pathWithoutPrefix.substring(1);
      }
      if (pathWithoutPrefix.startsWith('docs/')) {
        pathWithoutPrefix = pathWithoutPrefix.substring(5);
      }
      
      // Ensure we don't have double slashes
      if (pathWithoutPrefix) {
        targetUrl = `/docs/${pathWithoutPrefix}`;
      } else {
        targetUrl = '/docs';
      }
    }
    
    // Normalize any double slashes that might have been introduced
    targetUrl = targetUrl.replace(/\/\//g, '/');
    
    console.log(`Navigating to: ${targetUrl}`);
    
    // Use navigate with replace:true to avoid adding to history stack
    navigate(targetUrl, { replace: true });
    
    // Always prevent default navigation for internal links
    return false;
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("smv-theme", newTheme);
      return newTheme;
    });
  };


  // Get server port from environment variables with fallback to 3500
  const serverPort = import.meta.env.VITE_SERVER_PORT || 3500;
  const apiBaseUrl = `http://localhost:${serverPort}`;

  console.log("Using API base URL:", apiBaseUrl);

  return (
    <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
      <div className={`app ${theme}`}>
        <MarkdownContent
          key={"markdown-content-base-ui-doc-page"}
          apiBaseUrl={apiBaseUrl}
          showHomePage={true}         
          hideFileTree={true}
          hideHeader={true}
          hideFooter={true}
          showFrontMatter={true}
          frontMatterMode="full"
          directoryViewEnabled={true}
          directoryViewStyle="detailed"
          showDirectoryBreadcrumbs={true}
          enableDirectorySorting={true}
          onNavigate={handleNavigation}
        />
      </div>
    </ThemeProvider>
  );
};

export default DocumentationPage;
