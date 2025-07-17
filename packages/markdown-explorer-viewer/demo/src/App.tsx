import { useState, useEffect } from "react";
import { MarkdownExplorer } from "../../src/components/MarkdownExplorer";
import { CustomFolderRenderer } from "./CustomFolderRenderer";
import { handleDirectNavigation, findNodeByPath } from "./utils/urlHandler";
import { fetchMarkdownContent } from "./utils/contentFetcher";
import "./App.css";
import "./sidebar-scroll.css";
import "./folder-content.css";
import { PackageLinks } from "@asafarim/shared";

function App() {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("markdown-explorer-theme");
    return savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : "light";
  });
  const [initialRoute, setInitialRoute] = useState<string>("/");
  const [fileTree, setFileTree] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("markdown-explorer-theme", theme);
  }, [theme]);

  useEffect(() => {
    // Check if we're running in production/GitHub Pages environment
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const baseUrl = isProduction ? '' : 'http://localhost:3011';
    
    // Get the base path for static files in GitHub Pages
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
    
    // Fetch file tree from API or static source
    const fetchFileTree = async () => {
      try {
        let data;
        
        if (isProduction) {
          // In production, use the pre-generated static JSON file
          // Use the basePath variable defined earlier
          const response = await fetch(`${basePath}md-data/folder-structure.json`);
          data = await response.json();
        } else {
          // In development, use the local server
          const response = await fetch(`${baseUrl}/api/folder-structure`);
          data = await response.json();
        }
        
        setFileTree(data);
        setLoading(false);
        console.log("File tree loaded:", data);
      } catch (err) {
        console.error("Failed to fetch file tree:", err);
        setError("Failed to load file tree");
      } finally {
        setLoading(false);
      }
    };

    fetchFileTree();
  }, []);

  // Handle direct navigation to markdown files
  useEffect(() => {
    if (!fileTree) return; // Don't process until file tree is loaded

    // Get the current URL path and normalize it
    // Check if we have an original path from direct navigation
    const originalPath =
      (window as any).__ORIGINAL_PATH__ || window.location.pathname;
    const { normalizedPath, hasExtension } =
      handleDirectNavigation(originalPath);

    console.log(
      `Original path: ${originalPath}, normalized path: ${normalizedPath}, has extension: ${hasExtension}`
    );

    // Special case for changelog.md
    if (
      normalizedPath === "/changelog.md" ||
      originalPath === "/changelog.md" ||
      originalPath === "changelog.md" ||
      normalizedPath.endsWith("changelog.md")
    ) {
      // Look for changelog.md in the root
      const changelogNode = fileTree.children?.find(
        (child: { name: string; path: string }) =>
          child.name === "changelog.md" ||
          child.path === "changelog.md" ||
          child.path === "/changelog.md"
      );

      if (changelogNode) {
        console.log("Found changelog.md at root, using it:", changelogNode);
        setInitialRoute("/changelog.md");
        return;
      }
    }

    // Special case for root path or README.md - default to README.md
    if (
      normalizedPath === "/" ||
      normalizedPath === "" ||
      normalizedPath === "/README.md" ||
      originalPath === "/README.md" ||
      originalPath === "README.md"
    ) {
      // Look for README.md in the root
      const readmeNode = fileTree.children?.find(
        (child: { name: string; path: string }) =>
          child.name === "README.md" ||
          child.path === "README.md" ||
          child.path === "/README.md"
      );

      if (readmeNode) {
        console.log("Found README.md at root, using as default");
        setInitialRoute("README.md");
        return;
      }
    }

    // Try to find the node based on the path
    let node = findNodeByPath(fileTree, normalizedPath);

    // If not found, try without leading slash
    if (!node && normalizedPath.startsWith("/")) {
      node = findNodeByPath(fileTree, normalizedPath.substring(1));
    }

    // If still not found, try with .md extension
    if (!node && !hasExtension) {
      node = findNodeByPath(fileTree, `${normalizedPath}.md`);
    }

    // Special handling for /md-docs/api paths
    if (!node && normalizedPath.includes("/md-docs/api/")) {
      // Try without the leading slash
      const pathWithoutLeadingSlash = normalizedPath.startsWith("/")
        ? normalizedPath.substring(1)
        : normalizedPath;

      node = findNodeByPath(fileTree, pathWithoutLeadingSlash);

      if (!node) {
        // Try with .md extension
        node = findNodeByPath(fileTree, `${pathWithoutLeadingSlash}.md`);
      }
    }

    if (node) {
      // If the node exists, set it as the initial route
      console.log(`Node found for path: ${node.path}`, node);
      setInitialRoute(node.path);

      // Keep the original URL with extension if it had one
      if (hasExtension && originalPath !== normalizedPath) {
        // Don't replace the URL, keep the .md extension for direct linking
        // This allows users to share URLs with .md extension
      }
    } else if (normalizedPath.includes("/examples/")) {
      // Special handling for examples directory
      // Try to find the specific file in the examples directory
      const examplesNode = findNodeByPath(fileTree, "/examples");

      if (examplesNode && examplesNode.children) {
        // Get the file name from the path
        const pathParts = normalizedPath.split("/");
        const fileName = pathParts[pathParts.length - 1];

        // Try to find the file in the examples directory
        const fileNode = examplesNode.children.find(
          (child) =>
            child.name.toLowerCase() === fileName.toLowerCase() ||
            child.name.toLowerCase() === `${fileName.toLowerCase()}.md`
        );

        if (fileNode) {
          // If the file exists, navigate to it
          console.log(`Found file in examples: ${fileNode.path}`);
          setInitialRoute(fileNode.path);
          return;
        }
      }

      // If we couldn't find the specific file, just navigate to the examples directory
      const examplesBasePath = "/examples";
      console.log(
        `File not found in examples, navigating to directory: ${examplesBasePath}`
      );
      setInitialRoute(examplesBasePath);

      // Update URL to the examples directory
      window.history.replaceState({}, "", examplesBasePath);
    } else if (normalizedPath !== "/") {
      // If the node doesn't exist and it's not the root path
      // Try to find a close match by checking parent paths
      console.warn(
        `Path not found: ${normalizedPath}, trying to find a close match`
      );

      // Split the path into segments and try to find the closest existing node
      const segments = normalizedPath.split("/").filter(Boolean);
      let closestPath = "/";

      for (let i = segments.length - 1; i >= 0; i--) {
        const partialPath = "/" + segments.slice(0, i).join("/");
        const partialNode = findNodeByPath(fileTree, partialPath);

        if (partialNode) {
          closestPath = partialPath;
          console.log(`Found closest match: ${closestPath}`);
          break;
        }
      }

      // Set the closest path as the initial route
      setInitialRoute(closestPath);
      window.history.replaceState({}, "", closestPath);
    }
  }, [fileTree]);

  // Handle navigation events
  const handleNavigate = (path: string, node: any) => {
    if (!node) return;

    // Get the file extension for files
    let urlPath = path;

    // Only add .md extension for file nodes, not folders
    if (
      node.type === "file" &&
      node.name.endsWith(".md") &&
      !path.endsWith(".md")
    ) {
      // For files, append .md to create a permanent link
      urlPath = `${path}.md`;
    } else if (node.type === "folder") {
      // For folders, ensure we don't have a .md extension
      if (urlPath.endsWith(".md")) {
        urlPath = urlPath.slice(0, -3);
      }
    }

    // Update the browser URL without causing a page reload
    window.history.pushState({}, "", urlPath);

    // Log navigation for debugging
    console.log(`Navigated to: ${urlPath}`, node);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <h1>Markdown Explorer Viewer Demo</h1>
        <PackageLinks
          packageName="@asafarim/markdown-explorer-viewer"
          githubPath="markdown-explorer-viewer"
          demoPath="markdown-explorer-viewer"
        />
        <div className="app-controls">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } theme`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      <main className="app-main">
        <MarkdownExplorer
          fileTree={fileTree}
          theme={theme}
          enableSearch={true}
          showBreadcrumbs={true}
          className="demo-explorer"
          disableAutoSelect={true}
          initialRoute={initialRoute}
          onNavigate={(path, node) => handleNavigate(path, node)}
          contentFetcher={fetchMarkdownContent}
          renderFolderContent={({ currentNode, onNodeClick }) => (
            <CustomFolderRenderer
              currentNode={currentNode}
              onNodeClick={onNodeClick}
              theme={theme}
            />
          )}
        />
      </main>

      <footer className="app-footer">
        <p>
          Built with ❤️ using the{" "}
          <strong>@asafarim/markdown-explorer-viewer</strong> package
        </p>
      </footer>
    </div>
  );
}

export default App;
