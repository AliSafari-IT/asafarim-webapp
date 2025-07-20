import React, { useState, useEffect } from "react";
import { MarkdownContent, ThemeProvider } from "@asafarim/simple-md-viewer";
import "@asafarim/simple-md-viewer/dist/style.css";
import "../styles/documentation.css"; // Import our custom CSS to hide the file tree

const DocumentationPage: React.FC = () => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem("smv-theme");
    return savedTheme || "light";
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("smv-theme", newTheme);
      return newTheme;
    });
  };

  // Apply theme to document root for global styling
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Get server port from environment variables with fallback to 3500
  const serverPort = import.meta.env.VITE_SERVER_PORT || 3500;
  const apiBaseUrl = `http://localhost:${serverPort}`;

  console.log("Using API base URL:", apiBaseUrl);

  return (
    <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
      <div className={`app ${theme}`}>
        <MarkdownContent
          apiBaseUrl={apiBaseUrl}
          showHomePage={true}
          apiEndpoints={{
            tree: "/api/tree",
            file: "/api/file",
            search: "/api/search",
            exists: "/api/exists",
          }}
          hideFileTree={true}
          hideHeader={true}
          hideFooter={true}
          key={"markdown-content-base-ui-doc-page"}
          showFrontMatter={true}
          frontMatterMode="full"
        />
      </div>
    </ThemeProvider>
  );
};

export default DocumentationPage;
