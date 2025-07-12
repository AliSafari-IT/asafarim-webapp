#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

/**
 * Comprehensive extractor for sampleFiles from the markdown-explorer-viewer demo
 * This script handles the complex structure including programmatically added files
 */

interface SampleData {
  [key: string]: string;
}

async function extractAllSampleFiles(inputPath: string, outputDir: string): Promise<void> {
  try {
    console.log('🔍 Reading TypeScript file...');
    const fileContent = await fs.promises.readFile(inputPath, 'utf8');
    
    // Create a safe evaluation environment
    const sampleFiles: SampleData = {};
    
    // Mock the parseFileTree function to avoid dependency issues
    const parseFileTree = () => {};
    
    // Extract the main object declaration
    const regex = /sampleFiles:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\};/;
    const match = fileContent.match(regex);
    
    if (!match) {
      throw new Error('Could not find sampleFiles object');
    }
    
    console.log('📝 Found sampleFiles object, extracting main entries...');
    
    // Parse the main object content
    const objectContent = match[1];
    
    // Extract entries using a more robust approach
    const entries = extractEntries(objectContent);
    
    for (const [filePath, content] of entries) {
      sampleFiles[filePath] = content;
    }
    
    console.log(`✅ Extracted ${Object.keys(sampleFiles).length} main entries`);
    
    // Extract the programmatic additions
    console.log('🔄 Processing programmatic file additions...');
    
    // Find the for loops that add more files
    const forLoopPattern = /for\s*\(\s*let\s+i\s*=\s*(\d+);\s*i\s*<=\s*(\d+);\s*i\+\+\s*\)\s*\{\s*sampleFiles\[`([^`]+)`\]\s*=\s*`([^`]+)`;?\s*\}/g;
    
    let loopMatch;
    while ((loopMatch = forLoopPattern.exec(fileContent)) !== null) {
      const start = parseInt(loopMatch[1]);
      const end = parseInt(loopMatch[2]);
      const pathTemplate = loopMatch[3];
      const contentTemplate = loopMatch[4];
      
      console.log(`  📁 Adding loop-generated files: ${pathTemplate} (${start}-${end})`);
      
      for (let i = start; i <= end; i++) {
        const filePath = pathTemplate.replace(/\${i}/g, i.toString());
        const content = contentTemplate.replace(/\${i}/g, i.toString());
        sampleFiles[filePath] = content;
      }
    }
    
    // Extract individual file assignments
    const individualPattern = /sampleFiles\['([^']+)'\]\s*=\s*`([^`]+)`;/g;
    let individualMatch;
    while ((individualMatch = individualPattern.exec(fileContent)) !== null) {
      const filePath = individualMatch[1];
      const content = individualMatch[2];
      if (!sampleFiles[filePath]) {
        sampleFiles[filePath] = content;
        console.log(`  📄 Added individual file: ${filePath}`);
      }
    }
    
    console.log(`🎉 Total files to extract: ${Object.keys(sampleFiles).length}`);
    
    // Create output directory
    if (fs.existsSync(outputDir)) {
      await fs.promises.rm(outputDir, { recursive: true });
    }
    await fs.promises.mkdir(outputDir, { recursive: true });
    
    // Save all files
    let savedCount = 0;
    const errors: string[] = [];
    
    for (const [filePath, content] of Object.entries(sampleFiles)) {
      try {
        // Clean the path
        const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
        const outputPath = path.join(outputDir, cleanPath);
        
        // Create directories if needed
        const dirPath = path.dirname(outputPath);
        if (!fs.existsSync(dirPath)) {
          await fs.promises.mkdir(dirPath, { recursive: true });
        }
        
        // Write the file
        await fs.promises.writeFile(outputPath, content);
        console.log(`✓ Saved: ${outputPath}`);
        savedCount++;
      } catch (error) {
        errors.push(`Error saving ${filePath}: ${error}`);
      }
    }
    
    console.log(`\n🎉 Extraction completed: ${savedCount} files saved.`);
    
    if (errors.length > 0) {
      console.error(`\n❌ Errors encountered (${errors.length}):`);
      errors.forEach(err => console.error(`  - ${err}`));
    }
    
    // Create a summary file
    const summaryPath = path.join(outputDir, '_EXTRACTION_SUMMARY.md');
    const summaryContent = `# Extraction Summary

## Files Extracted: ${savedCount}

### File List:
${Object.keys(sampleFiles).sort().map(file => `- ${file}`).join('\n')}

### Extraction Details:
- Source: ${inputPath}
- Output: ${outputDir}
- Date: ${new Date().toISOString()}
- Total files: ${savedCount}
- Errors: ${errors.length}

### Structure:
${generateStructureSummary(sampleFiles)}
`;
    
    await fs.promises.writeFile(summaryPath, summaryContent);
    console.log(`📊 Summary saved: ${summaryPath}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

function extractEntries(objectContent: string): [string, string][] {
  const entries: [string, string][] = [];
  
  // For the complex sampleFiles object, we need a more sophisticated approach
  // Let's try to find the specific entries we know exist
  
  console.log('🔍 Extracting main file entries...');
  
  // Method 1: Look for specific known entries with more flexible patterns
  const knownFiles = [
    '/examples/advanced.md',
    '/README.md', 
    '/docs/introduction.md',
    '/docs/getting-started.md'
  ];
  
  for (const fileName of knownFiles) {
    console.log(`  🔍 Looking for: ${fileName}`);
    
    // Create a regex pattern for this specific file
    const escapedName = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`'${escapedName}':\\s*\`([\\s\\S]*?)\`(?=\\s*,\\s*'[^']*':|\\s*\\};)`, 'm');
    
    const match = objectContent.match(pattern);
    if (match) {
      let content = match[1];
      
      // Clean up the content
      content = content.replace(/\\`/g, '`'); // Unescape backticks
      content = content.replace(/\\\\/g, '\\'); // Unescape backslashes
      
      entries.push([fileName, content.trim()]);
      console.log(`    ✅ Found ${fileName} (${content.length} chars)`);
    } else {
      console.log(`    ❌ Could not find ${fileName}`);
    }
  }
  
  // Method 2: Try to find any other files with a more general pattern
  console.log('🔍 Looking for additional file patterns...');
  
  // This regex looks for files that start clearly and end with `, followed by another file or end
  const generalPattern = /'([^']+\.md)':\s*`((?:[^`]|\\`)*?)`\s*(?:,|$)/g;
  let match;
  
  while ((match = generalPattern.exec(objectContent)) !== null) {
    const filePath = match[1];
    let content = match[2];
    
    // Skip if we already have this file
    if (entries.some(([path]) => path === filePath)) {
      continue;
    }
    
    // Clean up the content
    content = content.replace(/\\`/g, '`');
    content = content.replace(/\\\\/g, '\\');
    
    entries.push([filePath, content.trim()]);
    console.log(`    ✅ Found additional file: ${filePath} (${content.length} chars)`);
  }
  
  return entries;
}

function generateStructureSummary(files: SampleData): string {
  const structure: { [key: string]: string[] } = {};
  
  for (const filePath of Object.keys(files)) {
    const parts = filePath.split('/').filter(p => p);
    if (parts.length === 1) {
      if (!structure['/'  ]) structure['/'] = [];
      structure['/'].push(parts[0]);
    } else {
      const folder = '/' + parts.slice(0, -1).join('/');
      if (!structure[folder]) structure[folder] = [];
      structure[folder].push(parts[parts.length - 1]);
    }
  }
  
  let summary = '';
  for (const [folder, files] of Object.entries(structure)) {
    summary += `\n**${folder}**\n`;
    files.forEach(file => {
      summary += `  - ${file}\n`;
    });
  }
  
  return summary;
}

// Run the extraction
const inputPath = 'D:/repos/asafarim-webapp/packages/markdown-explorer-viewer/demo/src/sampleData.ts';
const outputPath = './complete-sample-files';

extractAllSampleFiles(inputPath, outputPath);
