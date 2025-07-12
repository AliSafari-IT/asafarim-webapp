#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import * as ts from 'typescript';
import express from 'express';

interface SampleData {
  [key: string]: string;
}

// Dynamic import for ESM packages
let openFn: any = null;

async function loadOpen() {
  if (!openFn) {
    try {
      const openModule = await import('open');
      openFn = openModule.default;
    } catch (error) {
      console.warn('Could not load open package:', error);
      openFn = () => console.log('Open package not available');
    }
  }
  return openFn;
}

/**
 * Convert TypeScript sample data to individual markdown files
 */
const program = new Command();

program
  .name('convertToMarkdown')
  .description('Extract markdown files from TypeScript sample data files')
  .version('1.0.0')
  .option('-i, --input <path>', 'Path to the TypeScript file containing sample data')
  .option('-o, --output <path>', 'Output directory for the extracted markdown files')
  .option('-v, --variable <name>', 'Name of the variable containing the sample data', 'sampleFiles')
  .option('-p, --prefix <prefix>', 'Remove this prefix from file paths', '')
  .option('-c, --create-dirs', 'Create directories for files with path separators', true)
  .option('-w, --web', 'Start web interface', false)
  .parse(process.argv);

const options = program.opts();

/**
 * Extract sample data from TypeScript file using robust template literal parsing
 */
async function extractSampleData(filePath: string, variableName: string): Promise<SampleData | null> {
  try {
    // Read the TS file content
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    
    // Find the variable declaration
    const startPattern = new RegExp(`${variableName}\\s*:\\s*Record<string,\\s*string>\\s*=\\s*\\{`);
    const startMatch = fileContent.search(startPattern);
    
    if (startMatch === -1) {
      console.error(`Couldn't find variable ${variableName} in ${filePath}`);
      return null;
    }
    
    // Find the opening and closing braces
    const openBraceIndex = fileContent.indexOf('{', startMatch);
    if (openBraceIndex === -1) {
      console.error('Could not find opening brace for object');
      return null;
    }
    
    // Find the matching closing brace
    let braceCount = 0;
    let endIndex = openBraceIndex;
    
    for (let i = openBraceIndex; i < fileContent.length; i++) {
      if (fileContent[i] === '{') braceCount++;
      if (fileContent[i] === '}') braceCount--;
      if (braceCount === 0) {
        endIndex = i;
        break;
      }
    }
    
    const objectContent = fileContent.substring(openBraceIndex + 1, endIndex);
    const result: SampleData = {};
    
    console.log(`Parsing content (${objectContent.length} characters)...`);
    
    // Use a more sophisticated approach to split entries
    // Look for the pattern: '/path': ` at the beginning of lines or after comma
    const entries = splitObjectEntries(objectContent);
    
    console.log(`Found ${entries.length} potential entries`);
    
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i].trim();
      
      // Extract file path and content from each entry
      const pathMatch = entry.match(/^'([^']+\.md)':\s*`([\s\S]*)`$/);
      if (pathMatch) {
        const filePath = pathMatch[1];
        let content = pathMatch[2];
        
        // Clean up the content
        content = content.replace(/\\`/g, '`'); // Unescape backticks
        content = content.replace(/\\\\/g, '\\'); // Unescape backslashes
        content = content.trim();
        
        result[filePath] = content;
        console.log(`  ✅ Extracted: ${filePath} (${content.length} chars)`);
      } else {
        console.log(`  ❌ Could not parse entry ${i + 1}: ${entry.substring(0, 50)}...`);
      }
    }
    
    console.log(`Total files extracted: ${Object.keys(result).length}`);
    console.log('Files found:', Object.keys(result).sort());
    
    return result;
  } catch (error) {
    console.error(`Error extracting sample data: ${error}`);
    return null;
  }
}

/**
 * Split object content into individual entries, handling complex template literals
 */
function splitObjectEntries(content: string): string[] {
  const entries: string[] = [];
  let currentEntry = '';
  let inTemplateString = false;
  let templateDepth = 0;
  let braceDepth = 0;
  let i = 0;
  
  while (i < content.length) {
    const char = content[i];
    const nextChar = content[i + 1];
    const prevChar = content[i - 1];
    
    // Handle template string boundaries
    if (char === '`' && prevChar !== '\\') {
      if (!inTemplateString) {
        inTemplateString = true;
        templateDepth = 1;
      } else {
        templateDepth--;
        if (templateDepth === 0) {
          inTemplateString = false;
        }
      }
    }
    
    // Handle nested template strings (like ${})
    if (inTemplateString) {
      if (char === '$' && nextChar === '{') {
        templateDepth++;
        i++; // Skip the {
      } else if (char === '}' && templateDepth > 1) {
        templateDepth--;
      }
    }
    
    // Handle braces outside template strings
    if (!inTemplateString) {
      if (char === '{') braceDepth++;
      if (char === '}') braceDepth--;
    }
    
    currentEntry += char;
    
    // Check if we've reached the end of an entry
    if (!inTemplateString && braceDepth === 0 && char === ',' && 
        (nextChar === ' ' || nextChar === '\n' || nextChar === '\r')) {
      // Remove the trailing comma and add to entries
      const entry = currentEntry.slice(0, -1).trim();
      if (entry && entry.includes(':')) {
        entries.push(entry);
      }
      currentEntry = '';
    }
    
    i++;
  }
  
  // Add the last entry
  if (currentEntry.trim() && currentEntry.includes(':')) {
    entries.push(currentEntry.trim());
  }
  
  return entries;
}

/**
 * Save extracted files to disk
 */
async function saveFiles(data: SampleData, outputDir: string, removePrefix: string, createDirs: boolean): Promise<void> {
  if (!data) {
    console.error('No data to save');
    return;
  }
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    await fs.promises.mkdir(outputDir, { recursive: true });
  }
  
  let savedCount = 0;
  const errors: string[] = [];
  
  for (const [filePath, content] of Object.entries(data)) {
    try {
      // Remove prefix if specified
      const relativePath = removePrefix ? filePath.replace(new RegExp(`^${removePrefix}`), '') : filePath;
      // Remove leading slash if present
      const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
      // Create full output path
      const outputPath = path.join(outputDir, cleanPath);
      
      // Create directories if needed
      if (createDirs) {
        const dirPath = path.dirname(outputPath);
        if (!fs.existsSync(dirPath)) {
          await fs.promises.mkdir(dirPath, { recursive: true });
        }
      }
      
      // Write the file
      await fs.promises.writeFile(outputPath, content);
      savedCount++;
      console.log(`✓ Saved: ${outputPath}`);
    } catch (error) {
      errors.push(`Error saving ${filePath}: ${error}`);
    }
  }
  
  console.log(`\n✅ Extraction completed: ${savedCount} files saved.`);
  
  if (errors.length > 0) {
    console.error(`\n❌ Errors encountered (${errors.length}):`);
    errors.forEach(err => console.error(`  - ${err}`));
  }
}

/**
 * Start web server for browser-based UI
 */
async function startWebServer() {
  const app = express();
  const PORT = 3333;
  
  // Serve static files
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.json());
  
  // Root route - serve index.html
  app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Index file not found. Please restart the server.');
    }
  });
  
  // Create public directory if it doesn't exist
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  console.log(`📁 Public directory: ${publicDir}`);
  
  // Create HTML file
  const htmlPath = path.join(publicDir, 'index.html');
  fs.writeFileSync(htmlPath, generateHtml());
  console.log(`✓ Created: ${htmlPath}`);
  
  // Create CSS file
  const cssPath = path.join(publicDir, 'styles.css');
  fs.writeFileSync(cssPath, generateCss());
  console.log(`✓ Created: ${cssPath}`);
  
  // Create JS file
  const jsPath = path.join(publicDir, 'script.js');
  fs.writeFileSync(jsPath, generateJs());
  console.log(`✓ Created: ${jsPath}`);
  
  // API routes
  app.post('/api/convert', async (req, res) => {
    try {
      const { inputPath, outputPath, variableName, prefix, createDirs } = req.body;
      
      if (!inputPath || !outputPath) {
        return res.status(400).json({ error: 'Input and output paths are required' });
      }
      
      // Check if input file exists
      if (!fs.existsSync(inputPath)) {
        return res.status(404).json({ error: `Input file not found: ${inputPath}` });
      }
      
      // Extract the sample data
      const sampleData = await extractSampleData(inputPath, variableName || 'sampleFiles');
      
      if (!sampleData) {
        return res.status(500).json({ error: `Failed to extract sample data from ${inputPath}` });
      }
      
      const fileCount = Object.keys(sampleData).length;
      
      // Save the files
      await saveFiles(sampleData, outputPath, prefix || '', createDirs !== false);
      
      res.json({ 
        success: true, 
        message: `Successfully extracted ${fileCount} files to ${outputPath}`,
        fileCount
      });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });
  
  // List available typescript files
  app.get('/api/files', (req, res) => {
    try {
      const baseDir = path.resolve(process.cwd());
      const tsFiles = findTsFiles(baseDir, 3); // Limit depth to 3 to avoid too many files
      res.json({ files: tsFiles });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });
  
  // Start the server
  app.listen(PORT, async () => {
    console.log(`🌐 Web interface running at http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
    console.log(`📋 Open your browser and navigate to: http://localhost:${PORT}`);
    console.log(`🔍 Available routes:`);
    console.log(`  GET  /              - Main interface`);
    console.log(`  POST /api/convert   - Convert files`);
    console.log(`  GET  /api/files     - List TypeScript files`);
    
    // Try to open browser automatically, but don't fail if it doesn't work
    setTimeout(async () => {
      try {
        const openModule = await import('open');
        const open = openModule.default;
        await open(`http://localhost:${PORT}`);
        console.log(`🚀 Browser should open automatically`);
      } catch (error) {
        // Silently ignore errors - the user can open manually
        console.log(`💡 Tip: If browser didn't open automatically, copy the URL above`);
      }
    }, 1000); // Delay to ensure server is fully ready
  });
}

/**
 * Find TypeScript files recursively (with depth limit)
 */
function findTsFiles(dir: string, maxDepth: number, currentDepth = 0): string[] {
  if (currentDepth > maxDepth) return [];
  
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      files.push(...findTsFiles(fullPath, maxDepth, currentDepth + 1));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Generate HTML for the web interface
 */
function generateHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Converter Tool</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>Markdown Converter Tool</h1>
      <p>Extract markdown files from TypeScript sample data</p>
    </header>
    
    <main>
      <div class="form-container">
        <form id="converterForm">
          <div class="form-group">
            <label for="inputPath">Input TypeScript File:</label>
            <div class="input-with-button">
              <input type="text" id="inputPath" name="inputPath" placeholder="Path to TypeScript file" required>
              <button type="button" id="browseFiles" class="secondary-button">Browse</button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="outputPath">Output Directory:</label>
            <input type="text" id="outputPath" name="outputPath" placeholder="Path to output directory" required>
          </div>
          
          <div class="form-group">
            <label for="variableName">Variable Name:</label>
            <input type="text" id="variableName" name="variableName" placeholder="Variable containing sample data" value="sampleFiles">
          </div>
          
          <div class="form-group">
            <label for="prefix">Path Prefix to Remove:</label>
            <input type="text" id="prefix" name="prefix" placeholder="Optional prefix to remove from file paths">
          </div>
          
          <div class="form-group checkbox">
            <input type="checkbox" id="createDirs" name="createDirs" checked>
            <label for="createDirs">Create Directories for Nested Paths</label>
          </div>
          
          <div class="button-group">
            <button type="submit" class="primary-button">Convert Files</button>
            <button type="reset" class="secondary-button">Reset</button>
          </div>
        </form>
      </div>
      
      <div class="file-list-container hidden" id="fileListContainer">
        <h3>Available TypeScript Files</h3>
        <div class="file-list" id="fileList"></div>
      </div>
      
      <div class="results-container hidden" id="resultsContainer">
        <h3>Results</h3>
        <div id="results"></div>
      </div>
    </main>
    
    <footer>
      <p>&copy; 2025 Ali Safari - ASafariM Tools</p>
    </footer>
  </div>
  
  <script src="script.js"></script>
</body>
</html>`;
}

/**
 * Generate CSS for the web interface
 */
function generateCss(): string {
  return `/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f7f9fc;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header styles */
header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e1e4e8;
}

header h1 {
  color: #0366d6;
  margin-bottom: 0.5rem;
}

header p {
  color: #586069;
}

/* Form styles */
.form-container {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.input-with-button {
  display: flex;
}

.input-with-button input {
  flex: 1;
  border-radius: 4px 0 0 4px;
}

.input-with-button button {
  border-radius: 0 4px 4px 0;
  margin-left: -1px;
}

.checkbox {
  display: flex;
  align-items: center;
}

.checkbox input {
  margin-right: 0.5rem;
  width: auto;
}

.checkbox label {
  margin-bottom: 0;
}

.button-group {
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-button {
  background-color: #0366d6;
  color: white;
}

.primary-button:hover {
  background-color: #0256b9;
  transform: translateY(-1px);
}

.secondary-button {
  background-color: #f1f2f3;
  color: #24292e;
}

.secondary-button:hover {
  background-color: #e1e4e8;
  transform: translateY(-1px);
}

/* Results styles */
.results-container, .file-list-container {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.results-container h3, .file-list-container h3 {
  margin-bottom: 1rem;
  color: #24292e;
  border-bottom: 1px solid #e1e4e8;
  padding-bottom: 0.5rem;
}

.success {
  color: #28a745;
  padding: 1rem;
  background-color: #f0fff4;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.error {
  color: #d73a49;
  padding: 1rem;
  background-color: #fff5f5;
  border-radius: 4px;
  margin-bottom: 1rem;
}

/* File list styles */
.file-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  padding: 0.5rem;
}

.file-item {
  padding: 0.5rem;
  border-bottom: 1px solid #f1f2f3;
  cursor: pointer;
}

.file-item:hover {
  background-color: #f6f8fa;
}

.file-item:last-child {
  border-bottom: none;
}

/* Utility */
.hidden {
  display: none;
}

/* Footer */
footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e1e4e8;
  color: #586069;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .form-container, .results-container, .file-list-container {
    padding: 1rem;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  button {
    width: 100%;
  }
}`;
}

/**
 * Generate JavaScript for the web interface
 */
function generateJs(): string {
  return `document.addEventListener('DOMContentLoaded', () => {
  const converterForm = document.getElementById('converterForm');
  const browseFilesBtn = document.getElementById('browseFiles');
  const fileListContainer = document.getElementById('fileListContainer');
  const fileList = document.getElementById('fileList');
  const resultsContainer = document.getElementById('resultsContainer');
  const results = document.getElementById('results');
  
  // Load available TypeScript files
  loadTsFiles();
  
  // Event listeners
  converterForm.addEventListener('submit', handleFormSubmit);
  browseFilesBtn.addEventListener('click', toggleFileList);
  
  // Functions
  async function loadTsFiles() {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      
      if (data.files && data.files.length > 0) {
        renderFileList(data.files);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }
  
  function renderFileList(files) {
    fileList.innerHTML = '';
    
    files.forEach(file => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.textContent = file;
      fileItem.addEventListener('click', () => {
        document.getElementById('inputPath').value = file;
        toggleFileList();
      });
      
      fileList.appendChild(fileItem);
    });
  }
  
  function toggleFileList() {
    fileListContainer.classList.toggle('hidden');
  }
  
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(converterForm);
    const payload = {
      inputPath: formData.get('inputPath'),
      outputPath: formData.get('outputPath'),
      variableName: formData.get('variableName'),
      prefix: formData.get('prefix'),
      createDirs: formData.get('createDirs') === 'on'
    };
    
    try {
      // Show loading state
      results.innerHTML = '<div class="loading">Processing...</div>';
      resultsContainer.classList.remove('hidden');
      
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        results.innerHTML = \`
          <div class="success">
            <h4>✅ Conversion Successful</h4>
            <p>\${data.message}</p>
            <p><strong>\${data.fileCount}</strong> files extracted to: <code>\${payload.outputPath}</code></p>
          </div>
        \`;
      } else {
        results.innerHTML = \`
          <div class="error">
            <h4>❌ Conversion Failed</h4>
            <p>\${data.error}</p>
          </div>
        \`;
      }
    } catch (error) {
      results.innerHTML = \`
        <div class="error">
          <h4>❌ Error</h4>
          <p>\${error.message || 'An unexpected error occurred'}</p>
        </div>
      \`;
    }
  }
});`;
}

// Main function
async function main() {
  const options = program.opts();
  
  // Start web interface if --web flag is provided
  if (options.web) {
    await startWebServer();
    return;
  }
  
  // For command-line usage, input and output are required
  if (!options.input || !options.output) {
    console.error('❌ Error: Both --input and --output are required for command-line usage.');
    console.error('💡 Use --web flag to start the web interface instead.');
    console.error('\nUsage:');
    console.error('  Command-line: npx ts-node convertToMarkdown.ts --input <path> --output <path>');
    console.error('  Web interface: npx ts-node convertToMarkdown.ts --web');
    process.exit(1);
  }
  
  try {
    const { input, output, variable, prefix, createDirs } = options;
    
    console.log(`🔍 Extracting markdown files from: ${input}`);
    console.log(`📁 Output directory: ${output}`);
    
    // Check if input file exists
    if (!fs.existsSync(input)) {
      console.error(`❌ Input file not found: ${input}`);
      process.exit(1);
    }
    
    // Extract the sample data
    const sampleData = await extractSampleData(input, variable);
    
    if (!sampleData) {
      console.error(`❌ Failed to extract sample data from ${input}`);
      process.exit(1);
    }
    
    const fileCount = Object.keys(sampleData).length;
    console.log(`📑 Found ${fileCount} sample files in variable '${variable}'`);
    
    // Save the files
    await saveFiles(sampleData, output, prefix, createDirs);
    
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
}

main();
