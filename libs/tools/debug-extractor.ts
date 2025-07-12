#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

/**
 * Debug extractor to understand the exact structure of the sampleData.ts file
 */

async function debugSampleFile(inputPath: string): Promise<void> {
  try {
    console.log('🔍 Analyzing sampleData.ts structure...');
    const fileContent = await fs.promises.readFile(inputPath, 'utf8');
    
    // Find the sampleFiles object
    const startPattern = /sampleFiles:\s*Record<string,\s*string>\s*=\s*\{/;
    const startMatch = fileContent.search(startPattern);
    
    if (startMatch === -1) {
      console.error('Could not find sampleFiles object');
      return;
    }
    
    console.log(`Found sampleFiles at position ${startMatch}`);
    
    // Show first 500 characters after the opening brace
    const openBraceIndex = fileContent.indexOf('{', startMatch);
    const sample = fileContent.substring(openBraceIndex + 1, openBraceIndex + 500);
    
    console.log('\n📄 First 500 characters of object content:');
    console.log('=' .repeat(50));
    console.log(sample);
    console.log('=' .repeat(50));
    
    // Find the closing brace
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
    console.log(`\n📊 Object content length: ${objectContent.length} characters`);
    
    // Look for all file path patterns
    const pathPattern = /'([^']+\.md)':\s*`/g;
    const foundPaths: string[] = [];
    let match;
    
    while ((match = pathPattern.exec(objectContent)) !== null) {
      foundPaths.push(match[1]);
    }
    
    console.log(`\n📁 Found ${foundPaths.length} file paths:`);
    foundPaths.forEach((path, index) => {
      console.log(`  ${index + 1}. ${path}`);
    });
    
    // Check for programmatic additions
    console.log('\n🔄 Checking for programmatic file additions...');
    
    const forLoopPattern = /for\s*\(\s*let\s+i\s*=\s*(\d+);\s*i\s*<=\s*(\d+);\s*i\+\+\s*\)\s*\{\s*sampleFiles\[`([^`]+)`\]\s*=\s*`([^`]+)`;?\s*\}/g;
    const individualPattern = /sampleFiles\['([^']+)'\]\s*=\s*`([^`]+)`;/g;
    
    let loopMatches = 0;
    let individualMatches = 0;
    
    while ((match = forLoopPattern.exec(fileContent)) !== null) {
      loopMatches++;
      const start = parseInt(match[1]);
      const end = parseInt(match[2]);
      const template = match[3];
      console.log(`  Loop ${loopMatches}: ${template} (${start}-${end}) = ${end - start + 1} files`);
    }
    
    while ((match = individualPattern.exec(fileContent)) !== null) {
      individualMatches++;
      console.log(`  Individual ${individualMatches}: ${match[1]}`);
    }
    
    console.log(`\n📈 Summary:`);
    console.log(`  - Main object entries: ${foundPaths.length}`);
    console.log(`  - Loop-generated entries: ${loopMatches} loops`);
    console.log(`  - Individual entries: ${individualMatches}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the debug analysis
debugSampleFile('sampleData.ts');
