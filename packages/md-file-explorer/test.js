#!/usr/bin/env node

import { MdFileExplorer } from './dist/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testMdFileExplorer() {
  console.log('🧪 Testing @asafarim/md-file-explorer\n');

  // Create explorer instance
  const testDocsPath = path.join(__dirname, 'test-docs');
  const explorer = new MdFileExplorer(testDocsPath, {
    includeExtensions: ['.md', '.mdx'],
    parseMarkdownMetadata: true,
    sortBy: 'name'
  });

  try {
    // Test 1: Get complete file tree
    console.log('📁 Test 1: Getting complete file tree...');
    const completeTree = await explorer.scanDirectory();
    console.log(`Found ${completeTree.totalFiles} files and ${completeTree.totalFolders} folders`);
    console.log('Tree structure:', JSON.stringify(completeTree.nodes, null, 2));
    console.log('');

    // Test 2: Lazy loading - get only first level
    console.log('⚡ Test 2: Lazy loading (depth 1)...');
    const lazyTree = await explorer.getFileTree('', 1);
    console.log('First level only:', JSON.stringify(lazyTree, null, 2));
    console.log('');

    // Test 3: Get file content
    console.log('📄 Test 3: Getting file content...');
    const fileContent = await explorer.getFileContent('changelogs/CHANGELOG.md');
    console.log('File content preview:');
    console.log(`Path: ${fileContent.path}`);
    console.log(`Metadata:`, fileContent.metadata);
    console.log(`Content preview: ${fileContent.content.substring(0, 200)}...`);
    console.log('');

    // Test 4: Search functionality
    console.log('🔍 Test 4: Search functionality...');
    const searchResults = await explorer.searchFiles('react');
    console.log(`Found ${searchResults.length} files matching "react":`);
    searchResults.forEach(file => {
      console.log(`- ${file.path} (${file.type})`);
    });
    console.log('');

    // Test 5: Check if file exists
    console.log('✅ Test 5: File existence check...');
    const exists1 = await explorer.fileExists('changelogs/CHANGELOG.md');
    const exists2 = await explorer.fileExists('nonexistent.md');
    console.log(`changelogs/CHANGELOG.md exists: ${exists1}`);
    console.log(`nonexistent.md exists: ${exists2}`);
    console.log('');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testMdFileExplorer();
