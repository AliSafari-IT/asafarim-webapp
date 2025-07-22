import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3300;
const mdDocsPath = path.join(__dirname, 'public', 'markdown-files'); // Your markdown folder

// Configure CORS for your React app
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'],
  credentials: true
}));

// API to return folder structure
app.get('/api/folder-structure', (req, res) => {
  try {
    const folderStructure = getFolderStructure(mdDocsPath);
    res.json({ nodes: folderStructure });
  } catch (error) {
    console.error('Error getting folder structure:', error);
    res.status(500).json({ error: 'Failed to read folder structure' });
  }
});

// API to serve markdown files
app.get('/api/file', (req, res) => {
  try {
    const filePath = path.join(mdDocsPath, req.query.path);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      res.json({ content });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

// API to get directory details with file sizes
app.get('/api/directory-details', (req, res) => {
  try {
    const directoryPath = req.query.path || '';
    const fullPath = path.join(mdDocsPath, directoryPath);
    
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
      return res.status(404).json({ error: 'Directory not found' });
    }

    const directoryDetails = getDirectoryDetails(fullPath, directoryPath);
    res.json(directoryDetails);
  } catch (error) {
    console.error('Error reading directory details:', error);
    res.status(500).json({ error: 'Failed to read directory details' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'asafarim-md-server',
    timestamp: new Date().toISOString(),
    markdownPath: mdDocsPath
  });
});

function getFolderStructure(dirPath, relativePath = '') {
  const items = fs.readdirSync(dirPath);
  const result = [];

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    const itemRelativePath = path.join(relativePath, item).replace(/\\/g, '/');

    if (stats.isDirectory()) {
      result.push({
        name: item,
        path: itemRelativePath,
        type: 'folder',
        children: getFolderStructure(itemPath, itemRelativePath)
      });
    } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
      result.push({
        name: item,
        path: itemRelativePath,
        type: 'file',
        lastModified: stats.mtime.toISOString(),
        size: stats.size
      });
    }
  }

  return result;
}

// Helper function for directory details
function getDirectoryDetails(dirPath, relativePath = '') {
  const items = fs.readdirSync(dirPath);
  const result = [];

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    const itemRelativePath = path.join(relativePath, item).replace(/\\/g, '/');

    if (stats.isDirectory()) {
      const folderSize = calculateFolderSize(itemPath);
      const itemCount = countItemsInFolder(itemPath);
      
      result.push({
        name: item,
        path: itemRelativePath,
        type: 'folder',
        lastModified: stats.mtime.toISOString(),
        size: folderSize,
        itemCount: itemCount.total,
        fileCount: itemCount.files,
        folderCount: itemCount.folders
      });
    } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
      result.push({
        name: item,
        path: itemRelativePath,
        type: 'file',
        lastModified: stats.mtime.toISOString(),
        size: stats.size
      });
    }
  }

  return result;
}

function calculateFolderSize(folderPath) {
  let totalSize = 0;
  
  try {
    const items = fs.readdirSync(folderPath);
    
    for (const item of items) {
      const itemPath = path.join(folderPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        totalSize += calculateFolderSize(itemPath);
      } else {
        totalSize += stats.size;
      }
    }
  } catch (error) {
    console.error('Error calculating folder size:', error);
  }
  
  return totalSize;
}

function countItemsInFolder(folderPath) {
  let count = { total: 0, files: 0, folders: 0 };
  
  try {
    const items = fs.readdirSync(folderPath);
    
    for (const item of items) {
      const itemPath = path.join(folderPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        count.folders++;
        count.total++;
        const subCount = countItemsInFolder(itemPath);
        count.total += subCount.total;
        count.files += subCount.files;
        count.folders += subCount.folders;
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        count.files++;
        count.total++;
      }
    }
  } catch (error) {
    console.error('Error counting items in folder:', error);
  }
  
  return count;
}

app.listen(PORT, () => {
  console.log(`🚀 ASafariM Markdown Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving markdown files from: ${mdDocsPath}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   - GET /api/health`);
  console.log(`   - GET /api/folder-structure`);
  console.log(`   - GET /api/file?path=<file-path>`);
  console.log(`   - GET /api/directory-details?path=<directory-path>`);
  
  // Check if markdown directory exists
  if (!fs.existsSync(mdDocsPath)) {
    console.log(`⚠️  Warning: Markdown directory doesn't exist: ${mdDocsPath}`);
    console.log(`   Create the directory and add some .md files to get started.`);
  } else {
    const stats = fs.statSync(mdDocsPath);
    if (stats.isDirectory()) {
      const items = fs.readdirSync(mdDocsPath);
      const mdFiles = items.filter(item => item.endsWith('.md') || item.endsWith('.mdx'));
      console.log(`📄 Found ${mdFiles.length} markdown files in ${items.length} total items`);
    }
  }
});

export default app;
