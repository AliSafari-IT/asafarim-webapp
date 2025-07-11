#!/usr/bin/env node
/**
 * add-frontmatter.ts
 * A tool to add front matter to markdown files
 * 
 * Features:
 * - Process individual files or directories recursively
 * - Skip files that already have front matter
 * - Generate front matter based on file content and name
 * - Web-based UI for configuration
 * - Command-line interface for automation
 */

import * as fs from 'fs';
import * as path from 'path';
import express from 'express';
import { program } from 'commander';
import * as readline from 'readline';
import { FILE } from 'dns';
// Use dynamic import for open package (ESM module)

// Types
interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
}

interface FrontMatterOptions {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  includeDate: boolean;
  includeTags: boolean;
  includeDescription: boolean;
  defaultTags: string[];
  dateFormat: string;
}

interface ProcessResult {
  file: string;
  status: 'added' | 'skipped' | 'error';
  message?: string;
}

// Default options
const defaultOptions: FrontMatterOptions = {
  includeDate: true,
  includeTags: true,
  includeDescription: true,
  defaultTags: ['documentation'],
  dateFormat: 'YYYY-MM-DD',
};

/**
 * Check if a file already has front matter
 */
function hasFrontMatter(content: string): boolean {
  return content.trimStart().startsWith('---');
}

/**
 * Format a date according to the specified format
 */
function formatDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day);
}

/**
 * Extract title from markdown content
 */
function extractTitleFromContent(content: string): string | null {
  const lines = content.split('\n');
  
  // Look for the first heading
  for (const line of lines) {
    const headingMatch = line.match(/^#+\s+(.+)$/);
    if (headingMatch) {
      return headingMatch[1].trim();
    }
  }
  
  return null;
}

/**
 * Generate title from filename
 */
function generateTitleFromFilename(filename: string): string {
  return path.basename(filename, '.md')
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate description from content
 */
function generateDescriptionFromContent(content: string): string {
  const lines = content.split('\n');
  
  // Find the first non-empty line that's not a heading
  for (const line of lines) {
    if (line.trim() && !line.startsWith('#')) {
      // Return first 150 characters
      return line.trim().substring(0, 150);
    }
  }
  
  return '';
}

/**
 * Generate tags from content and filename
 */
function generateTags(filename: string, content: string, defaultTags: string[]): string[] {
  const tags = [...defaultTags];
  
  // Add filename-based tags
  const baseFilename = path.basename(filename, '.md');
  const filenameTags = baseFilename.split(/[-_]/).filter(tag => tag.length > 2);
  
  // Add content-based tags (simple approach)
  const contentLower = content.toLowerCase();
  const potentialTags = [
    'react', 'typescript', 'javascript', 'api', 'component', 'documentation',
    'guide', 'tutorial', 'reference', 'example', 'configuration'
  ];
  
  const contentTags = potentialTags.filter(tag => contentLower.includes(tag));
  
  // Combine tags, remove duplicates and sort
  return [...new Set([...tags, ...filenameTags, ...contentTags])];
}

/**
 * Generate front matter for a markdown file
 */
function generateFrontMatter(
  filePath: string, 
  content: string,
  options: FrontMatterOptions
): string {
  // Extract or generate title
  const contentTitle = extractTitleFromContent(content);
  const title = options.title || contentTitle || generateTitleFromFilename(filePath);
  
  // Generate description if needed
  const description = options.includeDescription 
    ? (options.description || generateDescriptionFromContent(content))
    : '';
  
  // Format date if needed
  const date = options.includeDate
    ? options.date || formatDate(new Date(), options.dateFormat)
    : '';
  
  // Generate tags if needed
  const tags = options.includeTags
    ? options.tags || generateTags(filePath, content, options.defaultTags)
    : [];
  
  // Build front matter
  let frontMatter = '---\n';
  frontMatter += `title: "${title}"\n`;
  
  if (options.includeDescription && description) {
    frontMatter += `description: "${description}"\n`;
  }
  
  if (options.includeDate && date) {
    frontMatter += `date: "${date}"\n`;
  }
  
  if (options.includeTags && tags.length > 0) {
    frontMatter += `tags: [${tags.map(tag => `"${tag}"`).join(', ')}]\n`;
  }
  
  frontMatter += '---\n\n';
  
  return frontMatter;
}

/**
 * Process a single markdown file
 */
async function processFile(
  filePath: string, 
  options: FrontMatterOptions
): Promise<ProcessResult> {
  try {
    // Check if file exists and is a markdown file
    if (!fs.existsSync(filePath) || !filePath.toLowerCase().endsWith('.md')) {
      return {
        file: filePath,
        status: 'error',
        message: 'Not a markdown file or file does not exist'
      };
    }
    
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has front matter
    if (hasFrontMatter(content)) {
      return {
        file: filePath,
        status: 'skipped',
        message: 'Already has front matter'
      };
    }
    
    // Generate front matter
    const frontMatter = generateFrontMatter(filePath, content, options);
    
    // Write updated content
    fs.writeFileSync(filePath, frontMatter + content);
    
    return {
      file: filePath,
      status: 'added'
    };
  } catch (error) {
    return {
      file: filePath,
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Process files in a directory recursively
 */
async function processDirectory(
  dirPath: string, 
  options: FrontMatterOptions,
  recursive = true
): Promise<ProcessResult[]> {
  const results: ProcessResult[] = [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory() && recursive) {
        // Process subdirectory recursively
        const subResults = await processDirectory(fullPath, options, recursive);
        results.push(...subResults);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        // Process markdown file
        const result = await processFile(fullPath, options);
        results.push(result);
      }
    }
  } catch (error) {
    results.push({
      file: dirPath,
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
  
  return results;
}

/**
 * Command-line interface
 */
function setupCLI() {
  program
    .name('add-frontmatter')
    .description('Add front matter to markdown files')
    .version('1.0.0');
  
  program
    .option('-r, --recursive', 'Process directories recursively', true)
    .option('-t, --title <title>', 'Specify a title')
    .option('-d, --description <description>', 'Specify a description')
    .option('--date <date>', 'Specify a date (YYYY-MM-DD)')
    .option('--tags <tags>', 'Specify tags (comma-separated)')
    .option('--no-date', 'Exclude date from front matter')
    .option('--no-tags', 'Exclude tags from front matter')
    .option('--no-description', 'Exclude description from front matter')
    .option('--web', 'Launch web interface', false)
    .option('-p, --port <port>', 'Port for web interface', '3030')
    .argument('[path]', 'File or directory path (optional with --web)')
    .action(async (targetPath, cmdOptions) => {
      if (cmdOptions.web) {
        startWebServer(parseInt(cmdOptions.port || '3030'));
        return;
      }
      
      // Ensure path is provided when not using web interface
      if (!targetPath) {
        console.error('Error: Path argument is required when not using --web');
        process.exit(1);
      }
      
      const options: FrontMatterOptions = {
        ...defaultOptions,
        title: cmdOptions.title,
        description: cmdOptions.description,
        date: cmdOptions.date,
        tags: cmdOptions.tags ? cmdOptions.tags.split(',').map((t: string) => t.trim()) : undefined,
        includeDate: cmdOptions.date !== false,
        includeTags: cmdOptions.tags !== false,
        includeDescription: cmdOptions.description !== false
      };
      
      console.log(`Processing ${targetPath}...`);
      
      let results: ProcessResult[] = [];
      
      if (fs.statSync(targetPath).isDirectory()) {
        results = await processDirectory(targetPath, options, cmdOptions.recursive);
      } else {
        const result = await processFile(targetPath, options);
        results = [result];
      }
      
      // Print results
      console.log('\nResults:');
      console.log('--------');
      
      const added = results.filter(r => r.status === 'added').length;
      const skipped = results.filter(r => r.status === 'skipped').length;
      const errors = results.filter(r => r.status === 'error').length;
      
      console.log(`Added front matter to ${added} files`);
      console.log(`Skipped ${skipped} files (already have front matter)`);
      console.log(`Encountered ${errors} errors`);
      
      if (errors > 0) {
        console.log('\nErrors:');
        results
          .filter(r => r.status === 'error')
          .forEach(r => console.log(`- ${r.file}: ${r.message}`));
      }
    });
  
  program.parse();
}

/**
 * Interactive CLI mode
 */
async function startInteractiveCLI() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  };
  
  console.log('=== Add Front Matter - Interactive Mode ===\n');
  
  const targetPath = await question('Enter file or directory path: ');
  
  if (!fs.existsSync(targetPath)) {
    console.error('Error: Path does not exist');
    rl.close();
    return;
  }
  
  const isDirectory = fs.statSync(targetPath).isDirectory();
  
  const options: FrontMatterOptions = { ...defaultOptions };
  
  // Configure options
  options.title = await question('Title (leave empty for auto-generation): ');
  options.description = await question('Description (leave empty for auto-generation): ');
  options.date = await question(`Date (leave empty for today's date): `);
  
  const tagsInput = await question('Tags (comma-separated, leave empty for auto-generation): ');
  if (tagsInput.trim()) {
    options.tags = tagsInput.split(',').map(t => t.trim());
  }
  
  const includeDate = await question('Include date? (y/n, default: y): ');
  options.includeDate = includeDate.toLowerCase() !== 'n';
  
  const includeTags = await question('Include tags? (y/n, default: y): ');
  options.includeTags = includeTags.toLowerCase() !== 'n';
  
  const includeDescription = await question('Include description? (y/n, default: y): ');
  options.includeDescription = includeDescription.toLowerCase() !== 'n';
  
  let recursive = false;
  if (isDirectory) {
    const recursiveInput = await question('Process recursively? (y/n, default: y): ');
    recursive = recursiveInput.toLowerCase() !== 'n';
  }
  
  console.log('\nProcessing...');
  
  let results: ProcessResult[] = [];
  
  if (isDirectory) {
    results = await processDirectory(targetPath, options, recursive);
  } else {
    const result = await processFile(targetPath, options);
    results = [result];
  }
  
  // Print results
  console.log('\nResults:');
  console.log('--------');
  
  const added = results.filter(r => r.status === 'added').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const errors = results.filter(r => r.status === 'error').length;
  
  console.log(`Added front matter to ${added} files`);
  console.log(`Skipped ${skipped} files (already have front matter)`);
  console.log(`Encountered ${errors} errors`);
  
  if (errors > 0) {
    console.log('\nErrors:');
    results
      .filter(r => r.status === 'error')
      .forEach(r => console.log(`- ${r.file}: ${r.message}`));
  }
  
  rl.close();
}

/**
 * Start web server for UI
 */
function startWebServer(port = 3030) {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
  
  // API endpoints for browsing files
  app.get('/api/browse', async (req, res) => {
    try {
      const dirPath = req.query.path as string;
      
      if (!dirPath || !fs.existsSync(dirPath)) {
        return res.status(400).json({ error: 'Invalid path' });
      }
      
      const stats = fs.statSync(dirPath);
      
      if (!stats.isDirectory()) {
        return res.json({
          path: dirPath,
          items: []
        });
      }
      
      const items: FileItem[] = fs.readdirSync(dirPath, { withFileTypes: true })
        .map(item => {
          const itemPath = path.join(dirPath, item.name);
          return {
            name: item.name,
            path: itemPath,
            isDirectory: item.isDirectory()
          };
        });
      
      res.json({
        path: dirPath,
        items
      });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });
  
  // API endpoint for processing files
  app.post('/api/process', async (req, res) => {
    try {
      const { path: targetPath, options, recursive } = req.body;
      
      if (!targetPath || !fs.existsSync(targetPath)) {
        return res.status(400).json({ error: 'Invalid path' });
      }
      
      const isDirectory = fs.statSync(targetPath).isDirectory();
      let results: ProcessResult[] = [];
      
      if (isDirectory) {
        results = await processDirectory(targetPath, options, recursive);
      } else {
        const result = await processFile(targetPath, options);
        results = [result];
      }
      
      res.json({ results });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });
  
  // Create HTML for the web interface
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Add Front Matter</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #2c3e50;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input[type="text"], textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    input[type="checkbox"] {
      margin-right: 5px;
    }
    button {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    button:hover {
      background-color: #2980b9;
    }
    .results {
      margin-top: 20px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f9f9f9;
    }
    .error {
      color: #e74c3c;
    }
    .success {
      color: #27ae60;
    }
    .file-list {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #eee;
      padding: 10px;
      margin-top: 10px;
    }
    .file-item {
      padding: 5px;
      border-bottom: 1px solid #eee;
    }
    .file-item:last-child {
      border-bottom: none;
    }
    .added {
      color: #27ae60;
    }
    .skipped {
      color: #f39c12;
    }
    .error {
      color: #e74c3c;
    }
  </style>
</head>
<body>
  <h1>Add Front Matter to Markdown Files</h1>
  
  <div class="form-group">
    <label for="path">File or Directory Path:</label>
    <input type="text" id="path" placeholder="Enter path to file or directory">
    <button id="browse">Browse...</button>
  </div>
  
  <div class="form-group">
    <label for="recursive">
      <input type="checkbox" id="recursive" checked>
      Process directories recursively
    </label>
  </div>
  
  <div class="form-group">
    <label for="title">Title (leave empty for auto-generation):</label>
    <input type="text" id="title" placeholder="Front matter title">
  </div>
  
  <div class="form-group">
    <label for="description">Description (leave empty for auto-generation):</label>
    <textarea id="description" rows="2" placeholder="Front matter description"></textarea>
  </div>
  
  <div class="form-group">
    <label for="date">Date (leave empty for today's date):</label>
    <input type="text" id="date" placeholder="YYYY-MM-DD">
  </div>
  
  <div class="form-group">
    <label for="tags">Tags (comma-separated, leave empty for auto-generation):</label>
    <input type="text" id="tags" placeholder="tag1, tag2, tag3">
  </div>
  
  <div class="form-group">
    <label>
      <input type="checkbox" id="includeDate" checked>
      Include date in front matter
    </label>
  </div>
  
  <div class="form-group">
    <label>
      <input type="checkbox" id="includeTags" checked>
      Include tags in front matter
    </label>
  </div>
  
  <div class="form-group">
    <label>
      <input type="checkbox" id="includeDescription" checked>
      Include description in front matter
    </label>
  </div>
  
  <button id="process">Process Files</button>
  
  <div id="results" class="results" style="display: none;">
    <h2>Results</h2>
    <div id="summary"></div>
    <div id="fileList" class="file-list"></div>
  </div>
  
  <script>
    document.getElementById('process').addEventListener('click', async () => {
      const path = document.getElementById('path').value.trim();
      if (!path) {
        alert('Please enter a valid path');
        return;
      }
      
      const options = {
        title: document.getElementById('title').value.trim() || undefined,
        description: document.getElementById('description').value.trim() || undefined,
        date: document.getElementById('date').value.trim() || undefined,
        tags: document.getElementById('tags').value.trim() 
          ? document.getElementById('tags').value.split(',').map(t => t.trim())
          : undefined,
        includeDate: document.getElementById('includeDate').checked,
        includeTags: document.getElementById('includeTags').checked,
        includeDescription: document.getElementById('includeDescription').checked,
        defaultTags: ['documentation'],
        dateFormat: 'YYYY-MM-DD'
      };
      
      const recursive = document.getElementById('recursive').checked;
      
      try {
        const response = await fetch('/api/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ path, options, recursive })
        });
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        displayResults(data.results);
      } catch (error) {
        document.getElementById('results').style.display = 'block';
        document.getElementById('summary').innerHTML = \`<p class="error">Error: \${error.message}</p>\`;
      }
    });
    
    function displayResults(results) {
      const resultsDiv = document.getElementById('results');
      const summaryDiv = document.getElementById('summary');
      const fileListDiv = document.getElementById('fileList');
      
      resultsDiv.style.display = 'block';
      
      const added = results.filter(r => r.status === 'added').length;
      const skipped = results.filter(r => r.status === 'skipped').length;
      const errors = results.filter(r => r.status === 'error').length;
      
      summaryDiv.innerHTML = \`
        <p><strong>Added front matter to:</strong> <span class="success">\${added} files</span></p>
        <p><strong>Skipped:</strong> <span>\${skipped} files</span> (already have front matter)</p>
        <p><strong>Errors:</strong> <span class="\${errors > 0 ? 'error' : ''}">\${errors} files</span></p>
      \`;
      
      fileListDiv.innerHTML = '';
      
      results.forEach(result => {
        const item = document.createElement('div');
        item.className = \`file-item \${result.status}\`;
        
        let statusText = '';
        switch (result.status) {
          case 'added':
            statusText = 'Added front matter';
            break;
          case 'skipped':
            statusText = 'Skipped (already has front matter)';
            break;
          case 'error':
            statusText = \`Error: \${result.message}\`;
            break;
        }
        
        item.innerHTML = \`<strong>\${result.file}</strong>: \${statusText}\`;
        fileListDiv.appendChild(item);
      });
    }
    
    // Implement a simple directory listing for browsing
    document.getElementById('browse').addEventListener('click', async () => {
      const currentPath = document.getElementById('path').value.trim() || 'D:\\repos\\asafarim-webapp\\apps\\base-ui\\md-docs';
      
      try {
        const response = await fetch('/api/browse?path=' + encodeURIComponent(currentPath));
        const data = await response.json();
        
        if (data.error) {
          alert('Error: ' + data.error);
          return;
        }
        
        // Create a simple directory browser dialog
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
        
        const dialog = document.createElement('div');
        dialog.style.width = '80%';
        dialog.style.maxWidth = '600px';
        dialog.style.maxHeight = '80%';
        dialog.style.backgroundColor = 'white';
        dialog.style.borderRadius = '4px';
        dialog.style.padding = '20px';
        dialog.style.display = 'flex';
        dialog.style.flexDirection = 'column';
        
        const header = document.createElement('div');
        header.style.marginBottom = '10px';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        
        const title = document.createElement('h3');
        title.textContent = 'Select Directory or File';
        title.style.margin = '0';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'X';
        closeBtn.style.border = 'none';
        closeBtn.style.background = 'none';
        closeBtn.style.fontSize = '16px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => document.body.removeChild(modal);
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        const pathDisplay = document.createElement('div');
        pathDisplay.textContent = currentPath;
        pathDisplay.style.padding = '8px';
        pathDisplay.style.backgroundColor = '#f5f5f5';
        pathDisplay.style.borderRadius = '4px';
        pathDisplay.style.marginBottom = '10px';
        pathDisplay.style.wordBreak = 'break-all';
        
        const content = document.createElement('div');
        content.style.overflowY = 'auto';
        content.style.flexGrow = '1';
        content.style.border = '1px solid #ddd';
        content.style.borderRadius = '4px';
        
        // Add parent directory option if not at root
        if (currentPath.includes('\\')) {
          const parentDir = document.createElement('div');
          parentDir.textContent = 'Directory: ..';
          parentDir.style.padding = '8px';
          parentDir.style.cursor = 'pointer';
          parentDir.style.borderBottom = '1px solid #eee';
          parentDir.onclick = async () => {
            const parentPath = currentPath.split('\\').slice(0, -1).join('\\');
            document.getElementById('path').value = parentPath;
            document.body.removeChild(modal);
            document.getElementById('browse').click();
          };
          content.appendChild(parentDir);
        }
        
        // Add directories first
        data.items
          .filter(item => item.isDirectory)
          .forEach(item => {
            const dir = document.createElement('div');
            dir.textContent = 'Directory: ' + item.name;
            dir.style.padding = '8px';
            dir.style.cursor = 'pointer';
            dir.style.borderBottom = '1px solid #eee';
            dir.onclick = () => {
              document.getElementById('path').value = item.path;
              document.body.removeChild(modal);
              document.getElementById('browse').click();
            };
            content.appendChild(dir);
          });
        
        // Then add files
        data.items
          .filter(item => !item.isDirectory && item.name.endsWith('.md'))
          .forEach(item => {
            const file = document.createElement('div');
            file.textContent = 'File: ' + item.name;
            file.style.padding = '8px';
            file.style.cursor = 'pointer';
            file.style.borderBottom = '1px solid #eee';
            file.onclick = () => {
              document.getElementById('path').value = item.path;
              document.body.removeChild(modal);
            };
            content.appendChild(file);
          });
        
        const footer = document.createElement('div');
        footer.style.marginTop = '10px';
        footer.style.display = 'flex';
        footer.style.justifyContent = 'flex-end';
        
        const selectBtn = document.createElement('button');
        selectBtn.textContent = 'Select Current Directory';
        selectBtn.style.padding = '8px 16px';
        selectBtn.style.backgroundColor = '#3498db';
        selectBtn.style.color = 'white';
        selectBtn.style.border = 'none';
        selectBtn.style.borderRadius = '4px';
        selectBtn.style.cursor = 'pointer';
        selectBtn.onclick = () => {
          document.body.removeChild(modal);
        };
        
        footer.appendChild(selectBtn);
        
        dialog.appendChild(header);
        dialog.appendChild(pathDisplay);
        dialog.appendChild(content);
        dialog.appendChild(footer);
        
        modal.appendChild(dialog);
        document.body.appendChild(modal);
      } catch (error) {
        alert('Error browsing files: ' + (error.message || 'Unknown error'));
      }
    });
  </script>
</body>
</html>`;

  // Create public directory if it doesn't exist
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Write HTML file
  fs.writeFileSync(path.join(publicDir, 'index.html'), htmlContent);
  
  // Start server
  app.listen(port, async () => {
    console.log(`Web interface running at http://localhost:${port}`);
    // Dynamically import the open package
    try {
      const openModule = await import('open');
      await openModule.default(`http://localhost:${port}`);
    } catch (error) {
      console.log('Could not automatically open browser. Please open the URL manually.');
    }
  });
}

// Main entry point
if (require.main === module) {
  // Check if running directly
  if (process.argv.length > 2) {
    // Command line mode
    setupCLI();
  } else {
    // Interactive mode
    startInteractiveCLI();
  }
}

// Export functions for use as a module
export {
  processFile,
  processDirectory,
  generateFrontMatter,
  startWebServer
};
