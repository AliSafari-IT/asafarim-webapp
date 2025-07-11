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
  if (!content) return false;
  
  // Check if the content starts with front matter delimiters
  const trimmed = content.trimStart();
  if (!trimmed.startsWith('---')) return false;
  
  // Verify it's actually front matter by looking for the closing delimiter
  const lines = trimmed.split('\n');
  if (lines.length < 3) return false; // Need at least opening, content, and closing
  
  // Skip the first line (opening delimiter)
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      // Found closing delimiter
      return true;
    }
  }
  
  return false;
}

/**
 * Format a date according to the specified format
 */
function formatDate(date: Date | null | undefined, format: string): string {
  // If date is null or undefined, use current date
  const safeDate = date || new Date();
  
  try {
    const year = safeDate.getFullYear();
    const month = String(safeDate.getMonth() + 1).padStart(2, '0');
    const day = String(safeDate.getDate()).padStart(2, '0');
    
    // Make sure format is a string
    const safeFormat = format || 'YYYY-MM-DD';
    
    return safeFormat
      .replace(/YYYY/g, year.toString())
      .replace(/MM/g, month)
      .replace(/DD/g, day);
  } catch (error) {
    // Fallback to ISO date format if any error occurs
    return new Date().toISOString().split('T')[0];
  }
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
  if (!content) return '';
  
  const lines = content.split('\n');
  
  // Find the first non-empty line that's not a heading
  for (const line of lines) {
    if (line && line.trim() && !line.startsWith('#')) {
      // Return first 150 characters
      return line.trim().substring(0, 150);
    }
  }
  
  // If no suitable line is found, use the first heading or return a default
  for (const line of lines) {
    if (line && line.trim() && line.startsWith('#')) {
      return `Documentation for ${line.replace(/^#+\s+/, '').trim()}`.substring(0, 150);
    }
  }
  
  return 'Documentation';
}

/**
 * Generate tags from content and filename
 */
function generateTags(filename: string, content: string, defaultTags: string[]): string[] {
  // Ensure we have valid arrays to work with
  const tags = defaultTags ? [...defaultTags] : [];
  
  // Add filename-based tags
  if (filename) {
    const baseFilename = path.basename(filename, '.md');
    const filenameTags = baseFilename.split(/[-_]/).filter(tag => tag && tag.length > 2);
    tags.push(...filenameTags);
  }
  
  // Add content-based tags (simple approach)
  if (content) {
    const contentLower = content.toLowerCase();
    const potentialTags = [
      'react', 'typescript', 'javascript', 'api', 'component', 'documentation',
      'guide', 'tutorial', 'reference', 'example', 'configuration'
    ];
    
    const contentTags = potentialTags.filter(tag => contentLower.includes(tag));
    tags.push(...contentTags);
  }
  
  // Remove duplicates and sort
  return [...new Set(tags)];
}

/**
 * Generate front matter for a markdown file
 */
function generateFrontMatter(
  filePath: string, 
  content: string,
  options: FrontMatterOptions
): string {
  // Ensure content is a string
  const safeContent = content || '';
  
  // Extract or generate title
  const contentTitle = extractTitleFromContent(safeContent);
  const title = options.title || contentTitle || generateTitleFromFilename(filePath);
  
  // Generate description if needed
  const description = options.includeDescription 
    ? (options.description || generateDescriptionFromContent(safeContent))
    : '';
  
  // Format date if needed
  let date = '';
  if (options.includeDate) {
    try {
      date = options.date || formatDate(new Date(), options.dateFormat || 'YYYY-MM-DD');
    } catch (error) {
      // Fallback to today's date in ISO format
      date = new Date().toISOString().split('T')[0];
    }
  }
  
  // Generate tags if needed
  const tags = options.includeTags
    ? options.tags || generateTags(filePath, safeContent, options.defaultTags)
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
  
  if (options.includeTags && tags && tags.length > 0) {
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
  
  // Serve static files from the public directory
  // The app.js and index.html files are stored in the public directory
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
