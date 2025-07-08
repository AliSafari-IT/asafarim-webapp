import express from 'express';
import cors from 'cors';
import { MdFileExplorer } from '@asafarim/md-file-explorer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create md-file-explorer instance
const docsPath = path.join(__dirname, '../base-ui/md-docs');
const explorer = new MdFileExplorer(docsPath, {
  includeExtensions: ['.md', '.mdx'],
  parseMarkdownMetadata: true,
  sortBy: 'name',
  maxDepth: 10
});

// Convert md-file-explorer FileNode to client-compatible format
const convertFileNode = (node) => {
  return {
    name: node.name,
    path: node.path,
    type: node.type,
    children: node.children?.map(convertFileNode),
    lastModified: node.lastModified?.toISOString(),
    size: node.size,
    metadata: node.metadata
  };
};

// Routes

// Get file tree
app.get('/api/docs/tree', async (req, res) => {
  try {
    const { path: queryPath, depth } = req.query;
    
    let result;
    if (depth) {
      result = await explorer.getFileTree(queryPath, parseInt(depth));
    } else {
      const scanResult = await explorer.scanDirectory(queryPath);
      result = scanResult.nodes;
    }
    
    const convertedNodes = result.map(convertFileNode);
    
    res.json({
      nodes: convertedNodes,
      success: true
    });
  } catch (error) {
    console.error('Error getting file tree:', error);
    res.status(500).json({
      error: 'Failed to get file tree',
      message: error.message,
      success: false
    });
  }
});

// Get file content
app.get('/api/docs/file', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    
    if (!filePath) {
      return res.status(400).json({
        error: 'File path is required',
        success: false
      });
    }
    
    // Remove /docs prefix if present
    const actualPath = filePath.replace(/^\/docs\//, '');
    const content = await explorer.getFileContent(actualPath);
    
    res.json({
      content: content.content,
      metadata: content.metadata,
      path: content.path,
      lastModified: content.lastModified?.toISOString(),
      success: true
    });
  } catch (error) {
    console.error('Error getting file content:', error);
    res.status(500).json({
      error: 'Failed to get file content',
      message: error.message,
      success: false
    });
  }
});

// Search files
app.get('/api/docs/search', async (req, res) => {
  try {
    const { q: query, includeContent } = req.query;
    
    if (!query) {
      return res.status(400).json({
        error: 'Search query is required',
        success: false
      });
    }
    
    const results = await explorer.searchFiles(query, includeContent === 'true');
    const convertedResults = results.map(convertFileNode);
    
    res.json({
      results: convertedResults,
      query,
      success: true
    });
  } catch (error) {
    console.error('Error searching files:', error);
    res.status(500).json({
      error: 'Failed to search files',
      message: error.message,
      success: false
    });
  }
});

// Check if file exists
app.get('/api/docs/exists', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    
    if (!filePath) {
      return res.status(400).json({
        error: 'File path is required',
        success: false
      });
    }
    
    const actualPath = filePath.replace(/^\/docs\//, '');
    const exists = await explorer.fileExists(actualPath);
    
    res.json({
      exists,
      path: filePath,
      success: true
    });
  } catch (error) {
    console.error('Error checking file existence:', error);
    res.status(500).json({
      error: 'Failed to check file existence',
      message: error.message,
      success: false
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'base-ui-server',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving docs from: ${docsPath}`);
  console.log(`🔗 API endpoints:`);
  console.log(`   GET /api/docs/tree?path=&depth=`);
  console.log(`   GET /api/docs/file?path=`);
  console.log(`   GET /api/docs/search?q=&includeContent=`);
  console.log(`   GET /api/docs/exists?path=`);
  console.log(`   GET /api/health`);
});
