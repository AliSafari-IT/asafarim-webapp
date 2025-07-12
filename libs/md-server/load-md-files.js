// This file contains server-side code for loading Markdown files
import { promises as fs } from 'fs';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3011;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3003', 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}));

// Add JSON middleware
app.use(express.json());

// Proper way to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(`Server directory: ${__dirname}`);

const MD_DIR = path.resolve(__dirname, '../../packages/markdown-explorer-viewer/demo/src/md-docs');
console.log(`Markdown directory: ${MD_DIR}`);

// Middleware to serve static files
app.use('/docs', express.static(MD_DIR));

// Endpoint to get the list of Markdown files (recursively including nested directories) md and mdx files
app.get('/api/md-files', async (req, res) => {
  try {
    const getMarkdownFiles = async (dir) => {
      let results = [];
      const files = await fs.readdir(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
          const nestedResults = await getMarkdownFiles(filePath);
          results = results.concat(nestedResults);
        } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
          results.push(filePath);
        }
      }
      return results;
    };

    const mdFiles = await getMarkdownFiles(MD_DIR);
    res.json(mdFiles);
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).json({ error: 'Failed to read directory' });
  }
});
  
// Endpoint to get the content of a specific nested Markdown file like: docs\\api\\overview.md
//"D:\\repos\\asafarim-webapp\\packages\\markdown-explorer-viewer\\demo\\src\\md-docs\\changelog.md",
  // "D:\\repos\\asafarim-webapp\\packages\\markdown-explorer-viewer\\demo\\src\\md-docs\\docs\\api\\overview.md",
app.get('/api/md-content/*', async (req, res) => {
  const requestedPath = req.params[0];
  const filePath = path.join(MD_DIR, requestedPath);
  
  console.log('Requested path:', requestedPath);
  console.log('Full file path:', filePath);
  console.log('MD_DIR:', MD_DIR);
  
  try {
    // Check if file exists
    const fileExists = fsSync.existsSync(filePath);
    console.log('File exists:', fileExists);
    
    if (!fileExists) {
      // List directory contents for debugging
      const dirPath = path.dirname(filePath);
      console.log('Directory path:', dirPath);
      try {
        const dirContents = await fs.readdir(dirPath);
        console.log('Directory contents:', dirContents);
      } catch (dirError) {
        console.log('Directory does not exist or cannot be read:', dirError.message);
      }
      
      return res.status(404).json({ 
        error: 'File not found',
        requestedPath,
        fullPath: filePath,
        mdDir: MD_DIR
      });
    }
    
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading nested file:', error);
    res.status(500).json({ 
      error: 'Failed to read nested file',
      details: error.message,
      requestedPath,
      fullPath: filePath
    });
  }
});
// usage example: /api/md-content/docs/api/overview.md

// Endpoint to get the folder structure as a hierarchical tree
app.get('/api/folder-structure', async (req, res) => {
  try {
    const buildFileTree = async (dirPath, basePath = '') => {
      const files = await fs.readdir(dirPath);
      const children = [];
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);
        const relativePath = path.join(basePath, file).replace(/\\/g, '/');
        const fullPath = relativePath.startsWith('/') ? relativePath : '/' + relativePath;
        
        if (stat.isDirectory()) {
          const subChildren = await buildFileTree(filePath, relativePath);
          children.push({
            name: file,
            path: fullPath,
            type: 'folder',
            children: subChildren,
            lastModified: stat.mtime.toISOString(),
            size: stat.size
          });
        } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
          children.push({
            name: file,
            path: fullPath,
            type: 'file',
            lastModified: stat.mtime.toISOString(),
            size: stat.size
          });
        }
      }
      
      return children;
    };
    
    const rootChildren = await buildFileTree(MD_DIR);
    
    const fileTree = {
      name: 'root',
      path: '/',
      type: 'folder',
      children: rootChildren
    };
    
    // Set cache control headers to prevent caching issues
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    res.json(fileTree);
  } catch (error) {
    console.error('Error building folder structure:', error);
    res.status(500).json({ error: 'Failed to build folder structure' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'md-file-folder-server',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // add list of endpoints with usage examples
  console.log('Available endpoints:' + '\n');
  console.log('1. GET /api/md-files - List all Markdown files: /api/md-files');
  console.log('2. GET /api/md-content/* - Get content of a specific Markdown file: /api/md-content/docs/api/overview.md');
  console.log('3. GET /api/folder-structure - Get folder structure: /api/folder-structure');
  console.log('4. GET /api/health - Health check: /api/health');
});

export default app;

// Add markdown processing dependency (you'll need to install this)
// npm install marked highlight.js

// import { marked } from 'marked';
// import hljs from 'highlight.js';