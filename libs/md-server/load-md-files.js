// This file contains server-side code for loading Markdown files
import { promises as fs } from 'fs';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3011;

// Proper way to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(`Server directory: ${__dirname}`);

const MD_DIR = path.resolve(__dirname, '../../packages/markdown-explorer-viewer/demo/src/md-docs');
console.log(`Markdown directory: ${MD_DIR}`);

// Middleware to serve static files
app.use('/docs', express.static(MD_DIR));

// Endpoint to get all the Markdown files recursively .md and .mdx
app.get('/api/docs', async (req, res) => {  
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

// Endpoint to get the content of a specific Markdown file
app.get('/api/docs/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(MD_DIR, filename);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});
  
// Endpoint to get the content of a specific nested Markdown file like: docs\\api\\overview.md
//"D:\\repos\\asafarim-webapp\\packages\\markdown-explorer-viewer\\demo\\src\\md-docs\\changelog.md",
  // "D:\\repos\\asafarim-webapp\\packages\\markdown-explorer-viewer\\demo\\src\\md-docs\\docs\\api\\overview.md",
app.get('/api/docs/*', async (req, res) => {
  const filePath = path.join(MD_DIR, req.params[0]);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading nested file:', error);
    res.status(500).json({ error: 'Failed to read nested file' });
  }
});
// usage example: /api/docs/api/overview.md

app.get('/api/files', async (req, res) => {
  try {
    const files = await fs.readdir(MD_DIR);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    res.json(mdFiles);
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).json({ error: 'Failed to read directory' });
  }
});

// Endpoint to get the content of a specific Markdown file
app.get('/api/files/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(MD_DIR, filename);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

// Endpoint to get the folder structure
app.get('/api/folder-structure', async (req, res) => {
  try {
    const files = await fs.readdir(MD_DIR);
    const folderStructure = files.map(file => {
      return {
        name: file,
        isDirectory: fsSync.statSync(path.join(MD_DIR, file)).isDirectory()
      };
    });
    res.json(folderStructure);
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).json({ error: 'Failed to read directory' });
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
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;