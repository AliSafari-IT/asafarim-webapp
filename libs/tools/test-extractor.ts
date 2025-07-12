#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

// Simple test to extract sampleFiles data
async function testExtraction() {
  const inputPath = 'D:/repos/asafarim-webapp/packages/markdown-explorer-viewer/demo/src/sampleData.ts';
  const outputPath = './test-extracted';
  
  try {
    // Read the TS file content
    const fileContent = await fs.promises.readFile(inputPath, 'utf8');
    
    // Extract sampleFiles object using regex
    const regex = /sampleFiles:\s*Record<string,\s*string>\s*=\s*{([\s\S]*?)};/;
    const match = fileContent.match(regex);
    
    if (!match) {
      console.error('Could not find sampleFiles object');
      return;
    }
    
    console.log('Found sampleFiles object!');
    console.log('First 200 characters of match:');
    console.log(match[1].substring(0, 200) + '...');
    
    // Create output directory
    if (!fs.existsSync(outputPath)) {
      await fs.promises.mkdir(outputPath, { recursive: true });
    }
    
    // Parse the object more carefully
    const objectContent = match[1];
    
    // Split by file entries (looking for patterns like '/path': `content`)
    const fileEntries = objectContent.split(/,\s*'\//).filter(entry => entry.trim());
    
    console.log(`Found ${fileEntries.length} potential file entries`);
    
    let savedCount = 0;
    
    for (let i = 0; i < fileEntries.length; i++) {
      let entry = fileEntries[i];
      
      // Add back the leading slash if this isn't the first entry
      if (i > 0) {
        entry = '/' + entry;
      }
      
      // Extract path and content
      const pathMatch = entry.match(/^'?([^']+)'?\s*:\s*`([\s\S]*?)(`$|`,?\s*$)/);
      
      if (pathMatch) {
        const filePath = pathMatch[1];
        let content = pathMatch[2];
        
        // Clean up the content - remove trailing backticks and commas
        content = content.replace(/`+\s*,?\s*$/, '');
        
        // Create the file
        const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
        const outputFilePath = path.join(outputPath, cleanPath);
        
        // Create directories if needed
        const dirPath = path.dirname(outputFilePath);
        if (!fs.existsSync(dirPath)) {
          await fs.promises.mkdir(dirPath, { recursive: true });
        }
        
        // Write the file
        await fs.promises.writeFile(outputFilePath, content);
        console.log(`✓ Saved: ${outputFilePath}`);
        savedCount++;
      }
    }
    
    console.log(`\n✅ Extraction completed: ${savedCount} files saved.`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testExtraction();
