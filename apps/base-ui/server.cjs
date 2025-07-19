const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
// Update path to point to the public/md-docs directory where the files actually exist
const mdDocsPath = path.join(__dirname, "public", "md-docs");
const portNr = process.env.SERVER_PORT || 3500;
console.log(`Server port: ${portNr}, MD docs path: ${mdDocsPath}`);

// Ensure the dist directory exists
const distPath = path.join(__dirname, "dist");
if (!fs.existsSync(distPath)) {
  console.log(`Creating dist directory: ${distPath}`);
  fs.mkdirSync(distPath, { recursive: true });
}

// Create md-docs directory if it doesn't exist
if (!fs.existsSync(mdDocsPath)) {
  console.log(`Creating md-docs directory: ${mdDocsPath}`);
  fs.mkdirSync(mdDocsPath, { recursive: true });
  
  // Create a sample README.md file
  const readmePath = path.join(mdDocsPath, "README.md");
  const readmeContent = `# ASafariM Documentation

## Welcome to the Documentation

This is a sample markdown file created for testing the documentation viewer.

### Features

- Simple Markdown Viewer
- File Tree Navigation
- Dark/Light Theme Toggle

### Getting Started

To get started with ASafariM, follow these steps:

1. Clone the repository
2. Install dependencies with \`pnpm install\`
3. Start the development server with \`pnpm dev\`

For more information, check out the [documentation](https://asafarim.com/docs).
`;
  
  fs.writeFileSync(readmePath, readmeContent);
  console.log(`Created sample README.md file at ${readmePath}`);
  
  // Create a docs directory with another markdown file
  const docsDir = path.join(mdDocsPath, "docs");
  fs.mkdirSync(docsDir, { recursive: true });
  console.log(`Created docs directory: ${docsDir}`);
  
  // Create an API.md file
  const apiPath = path.join(docsDir, "API.md");
  const apiContent = `# API Documentation

## Endpoints

### GET /api/docs/tree

Returns the file tree structure.

### GET /api/docs/file

Returns the content of a specific file.

## Examples

\`\`\`javascript
// Example: Fetching the file tree
fetch('/api/docs/tree')
  .then(response => response.json())
  .then(data => console.log(data));
\`\`\`
`;
  
  fs.writeFileSync(apiPath, apiContent);
  console.log(`Created sample API.md file at ${apiPath}`);
} else {
  console.log(`Directory already exists: ${mdDocsPath}`);
  
  // List contents of the directory
  try {
    const contents = fs.readdirSync(mdDocsPath);
    console.log(`Contents of ${mdDocsPath}:`, contents);
  } catch (error) {
    console.error(`Error reading directory ${mdDocsPath}:`, error);
  }
}

// Add Content Security Policy middleware
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; connect-src 'self' http://localhost:* ws://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
  );
  next();
});

// Serve static files
app.use("/md-docs", express.static(mdDocsPath));

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3501', 'http://localhost:3000'],
  credentials: true
}));

// API to get folder structure
app.get("/api/folder-structure", (req, res) => {
  try {
    const folderStructure = getFolderStructure(mdDocsPath);
    res.json({ nodes: folderStructure });
  } catch (error) {
    res.status(500).json({ error: "Failed to get folder structure" });
  }
});

// API to get file tree (endpoint for simple-md-viewer)
app.get("/api/docs/tree", (req, res) => {
  try {
    console.log("Received request to /api/docs/tree");
    const pathParam = req.query.path || '';
    const depth = req.query.depth ? parseInt(req.query.depth) : undefined;
    
    console.log(`Path parameter: "${pathParam}", Depth: ${depth}`);
    
    const basePath = pathParam ? path.join(mdDocsPath, pathParam) : mdDocsPath;
    console.log(`Base path for folder structure: ${basePath}`);
    
    // Check if directory exists
    if (!fs.existsSync(basePath)) {
      console.error(`Directory does not exist: ${basePath}`);
      return res.status(404).json({ 
        success: false, 
        error: "Directory not found" 
      });
    }
    
    const folderStructure = getFolderStructure(basePath, pathParam, depth);
    
    res.json({ 
      success: true,
      nodes: folderStructure 
    });
  } catch (error) {
    console.error("Error getting file tree:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to get file tree",
      details: error.message
    });
  }
});

// API to get file content (endpoint for simple-md-viewer with /api/docs/file path)
app.get("/api/docs/file", (req, res) => {
  try {
    console.log("Received request to /api/docs/file");
    const filePath = req.query.path;
    if (!filePath) {
      return res.status(400).json({ 
        success: false,
        error: "File path is required" 
      });
    }
    
    console.log(`File path: ${filePath}`);
    
    // Remove /docs/ prefix if present (from the frontend)
    const normalizedPath = filePath.replace(/^\/docs\//, '');
    let fullPath = path.join(mdDocsPath, normalizedPath);
    
    console.log(`Full file path: ${fullPath}`);
    
    // Check if the path is a directory
    const isDirectory = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
    if (isDirectory) {
      console.log(`Path is a directory: ${fullPath}`);
      // Return a special response for directories
      return res.json({
        success: true,
        isDirectory: true,
        content: `# ${path.basename(normalizedPath)}

This is a directory. Please select a file from the sidebar.`
      });
    }
    
    // If file doesn't exist, try adding .md extension
    if (!fs.existsSync(fullPath)) {
      const fullPathWithMd = `${fullPath}.md`;
      console.log(`File not found, trying with .md extension: ${fullPathWithMd}`);
      
      if (fs.existsSync(fullPathWithMd)) {
        fullPath = fullPathWithMd;
        console.log(`Found file with .md extension: ${fullPath}`);
      } else {
        console.error(`File not found even with .md extension: ${fullPathWithMd}`);
        return res.status(404).json({ 
          success: false,
          error: "File not found" 
        });
      }
    }
    
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      res.json({ 
        success: true,
        content 
      });
    } catch (readError) {
      console.error(`Error reading file: ${fullPath}`, readError);
      return res.status(500).json({ 
        success: false,
        error: `Error reading file: ${readError.message}` 
      });
    }
  } catch (error) {
    console.error("Error getting file content:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to get file content",
      details: error.message
    });
  }
});

// API to search files (endpoint for simple-md-viewer)
app.get("/api/docs/search", (req, res) => {
  try {
    console.log("Received request to /api/docs/search");
    const query = req.query.q || '';
    const includeContent = req.query.includeContent === 'true';
    
    console.log(`Search query: "${query}", Include content: ${includeContent}`);
    
    // Simple search implementation - can be enhanced later
    const results = searchFiles(mdDocsPath, query, includeContent);
    
    res.json({ 
      success: true,
      results 
    });
  } catch (error) {
    console.error("Error searching files:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to search files",
      details: error.message
    });
  }
});

// API to check if file exists (endpoint for simple-md-viewer)
app.get("/api/docs/exists", (req, res) => {
  try {
    console.log("Received request to /api/docs/exists");
    const filePath = req.query.path;
    if (!filePath) {
      return res.status(400).json({ 
        success: false,
        error: "File path is required" 
      });
    }
    
    console.log(`Checking if file exists: ${filePath}`);
    
    const fullPath = path.join(mdDocsPath, filePath.replace(/^\/docs\//, ''));
    const exists = fs.existsSync(fullPath);
    
    res.json({ 
      success: true,
      exists
    });
  } catch (error) {
    console.error("Error checking file existence:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to check file existence",
      details: error.message
    });
  }
});

// Add compatibility endpoints for @asafarim/simple-md-viewer
// These endpoints mirror the /api/docs/* endpoints but without the 'docs' segment

// API to get file tree (compatibility endpoint for simple-md-viewer)
app.get("/api/tree", (req, res) => {
  try {
    console.log("Received request to /api/tree (compatibility endpoint)");
    const pathParam = req.query.path || '';
    const depth = req.query.depth ? parseInt(req.query.depth) : undefined;
    
    console.log(`Path parameter: "${pathParam}", Depth: ${depth}`);
    
    const basePath = pathParam ? path.join(mdDocsPath, pathParam) : mdDocsPath;
    console.log(`Base path for folder structure: ${basePath}`);
    
    // Check if directory exists
    if (!fs.existsSync(basePath)) {
      console.error(`Directory does not exist: ${basePath}`);
      return res.status(404).json({ 
        success: false, 
        error: "Directory not found" 
      });
    }
    
    const folderStructure = getFolderStructure(basePath, pathParam, depth);
    
    res.json({ 
      success: true,
      nodes: folderStructure 
    });
  } catch (error) {
    console.error("Error getting file tree:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to get file tree",
      details: error.message
    });
  }
});

// API to get file content (compatibility endpoint for simple-md-viewer)
app.get("/api/file", (req, res) => {
  try {
    console.log("Received request to /api/file (compatibility endpoint)");
    const filePath = req.query.path;
    if (!filePath) {
      return res.status(400).json({ 
        success: false,
        error: "File path is required" 
      });
    }
    
    console.log(`File path: ${filePath}`);
    
    // Remove /docs/ prefix if present (from the frontend)
    const normalizedPath = filePath.replace(/^\/docs\//, '');
    let fullPath = path.join(mdDocsPath, normalizedPath);
    
    console.log(`Full file path: ${fullPath}`);
    
    // Check if the path is a directory
    const isDirectory = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
    if (isDirectory) {
      console.log(`Path is a directory: ${fullPath}`);
      // Return a special response for directories
      return res.json({
        success: true,
        isDirectory: true,
        content: `# ${path.basename(normalizedPath)}

This is a directory. Please select a file from the sidebar.`
      });
    }
    
    // If file doesn't exist, try adding .md extension
    if (!fs.existsSync(fullPath)) {
      const fullPathWithMd = `${fullPath}.md`;
      console.log(`File not found, trying with .md extension: ${fullPathWithMd}`);
      
      if (fs.existsSync(fullPathWithMd)) {
        fullPath = fullPathWithMd;
        console.log(`Found file with .md extension: ${fullPath}`);
      } else {
        console.error(`File not found even with .md extension: ${fullPathWithMd}`);
        return res.status(404).json({ 
          success: false,
          error: "File not found" 
        });
      }
    }
    
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      res.json({ 
        success: true,
        content 
      });
    } catch (readError) {
      console.error(`Error reading file: ${fullPath}`, readError);
      return res.status(500).json({ 
        success: false,
        error: `Error reading file: ${readError.message}` 
      });
    }
  } catch (error) {
    console.error("Error getting file content:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to get file content",
      details: error.message
    });
  }
});

// API to search files (compatibility endpoint for simple-md-viewer)
app.get("/api/search", (req, res) => {
  try {
    console.log("Received request to /api/search (compatibility endpoint)");
    const query = req.query.q || '';
    const includeContent = req.query.includeContent === 'true';
    
    console.log(`Search query: "${query}", Include content: ${includeContent}`);
    
    // Simple search implementation - can be enhanced later
    const results = searchFiles(mdDocsPath, query, includeContent);
    
    res.json({ 
      success: true,
      results 
    });
  } catch (error) {
    console.error("Error searching files:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to search files",
      details: error.message
    });
  }
});

// API to check if file exists (compatibility endpoint for simple-md-viewer)
app.get("/api/exists", (req, res) => {
  try {
    console.log("Received request to /api/exists (compatibility endpoint)");
    const filePath = req.query.path;
    if (!filePath) {
      return res.status(400).json({ 
        success: false,
        error: "File path is required" 
      });
    }
    
    console.log(`Checking if file exists: ${filePath}`);
    
    const fullPath = path.join(mdDocsPath, filePath.replace(/^\/docs\//, ''));
    const exists = fs.existsSync(fullPath);
    
    res.json({ 
      success: true,
      exists
    });
  } catch (error) {
    console.error("Error checking file existence:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to check file existence",
      details: error.message
    });
  }
});

function getFolderStructure(dirPath, relativePath = "", depth) {
  try {
    console.log(`Getting folder structure for: ${dirPath}, relativePath: ${relativePath}, depth: ${depth}`);
    
    // Check if directory exists
    if (!fs.existsSync(dirPath)) {
      console.error(`Directory does not exist: ${dirPath}`);
      return [];
    }
    
    const items = fs.readdirSync(dirPath);
    console.log(`Found ${items.length} items in ${dirPath}`);
    const result = [];

    for (const item of items) {
      try {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        
        // Calculate the relative path correctly
        // If relativePath is empty, just use item name
        // Otherwise, join relativePath with item name
        const itemRelativePath = relativePath 
          ? path.join(relativePath, item).replace(/\\/g, "/")
          : item;
          
        console.log(`Processing item: ${item}, path: ${itemRelativePath}, isDir: ${stats.isDirectory()}`);

        if (stats.isDirectory()) {
          // If depth is undefined, traverse all levels
          // If depth is 0, don't include children
          // Otherwise, decrement depth and continue traversing
          if (depth === 0) {
            result.push({
              name: item,
              path: itemRelativePath,
              type: "folder",
            });
          } else {
            const nextDepth = typeof depth === 'number' ? depth - 1 : undefined;
            result.push({
              name: item,
              path: itemRelativePath,
              type: "folder",
              children: getFolderStructure(itemPath, itemRelativePath, nextDepth),
            });
          }
        } else if (item.endsWith(".md")) {
          result.push({
            name: item,
            path: itemRelativePath,
            type: "file",
          });
        }
      } catch (itemError) {
        console.error(`Error processing item ${item}: ${itemError.message}`);
        // Continue with other items even if one fails
      }
    }

    return result;
  } catch (error) {
    console.error(`Error getting folder structure for ${dirPath}: ${error.message}`);
    return []; // Return empty array instead of throwing to prevent API failure
  }
}

// Helper function to search files
function searchFiles(dirPath, query, includeContent) {
  const results = [];
  const searchRecursive = (currentPath, relativePath = '') => {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const stats = fs.statSync(itemPath);
      const itemRelativePath = path.join(relativePath, item).replace(/\\/g, "/");
      
      if (stats.isDirectory()) {
        searchRecursive(itemPath, itemRelativePath);
      } else if (item.endsWith('.md')) {
        const lowerQuery = query.toLowerCase();
        const lowerName = item.toLowerCase();
        
        // Check if filename matches query
        if (lowerName.includes(lowerQuery)) {
          const result = {
            name: item,
            path: itemRelativePath,
            type: 'file'
          };
          
          // Add content if requested
          if (includeContent) {
            try {
              const content = fs.readFileSync(itemPath, 'utf-8');
              // Check if content matches query
              if (content.toLowerCase().includes(lowerQuery)) {
                result.content = content;
                results.push(result);
              }
            } catch (error) {
              console.error(`Error reading file ${itemPath}:`, error);
            }
          } else {
            results.push(result);
          }
        }
      }
    }
  };
  
  searchRecursive(dirPath);
  return results;
}

app.listen(portNr, () => {
  console.log(`Server running at http://localhost:${portNr}`);
});