// Script to export markdown data as static JSON files for GitHub Pages deployment
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Proper way to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default paths
const MD_DIR = path.resolve(__dirname, "../demo/src/md-docs");
const OUTPUT_DIR = path.resolve(__dirname, "../demo/public/md-data");

async function ensureDirectoryExists(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Directory created: ${dir}`);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

// Function to recursively get all markdown files
async function getMarkdownFiles(dir) {
  let results = [];
  const files = await fs.readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    
    if (stat.isDirectory()) {
      const nestedResults = await getMarkdownFiles(filePath);
      results = results.concat(nestedResults);
    } else if (file.endsWith(".md") || file.endsWith(".mdx")) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Function to recursively build the file tree
async function buildFileTree(dirPath, relativePath = "") {
  const files = await fs.readdir(dirPath);
  const result = [];

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const relPath = path.join(relativePath, file).replace(/\\/g, "/");
    const stats = await fs.stat(filePath);
    const isDir = stats.isDirectory();

    const node = {
      name: file,
      path: relPath,
      type: isDir ? "folder" : "file",
      lastModified: stats.mtime.toISOString(),
      size: stats.size,
    };

    if (isDir) {
      node.children = await buildFileTree(filePath, relPath);
    }

    result.push(node);
  }

  return result;
}

// Main export function
async function exportStaticData() {
  try {
    // Create output directory if it doesn't exist
    await ensureDirectoryExists(OUTPUT_DIR);
    
    // Export folder structure
    const rootNode = {
      name: "root",
      path: "/",
      type: "folder",
      children: await buildFileTree(MD_DIR),
    };
    
    await fs.writeFile(
      path.join(OUTPUT_DIR, "folder-structure.json"),
      JSON.stringify(rootNode, null, 2)
    );
    console.log("Exported folder structure");
    
    // Export list of all markdown files
    const mdFiles = await getMarkdownFiles(MD_DIR);
    const relativeFiles = mdFiles.map(file => path.relative(MD_DIR, file).replace(/\\/g, "/"));
    
    await fs.writeFile(
      path.join(OUTPUT_DIR, "md-files.json"),
      JSON.stringify(relativeFiles, null, 2)
    );
    console.log(`Exported list of ${relativeFiles.length} markdown files`);
    
    // Export content of each markdown file
    for (const file of mdFiles) {
      const relativePath = path.relative(MD_DIR, file).replace(/\\/g, "/");
      const content = await fs.readFile(file, "utf-8");
      
      // Create nested directories in output if needed
      const outputFilePath = path.join(OUTPUT_DIR, "content", relativePath);
      await ensureDirectoryExists(path.dirname(outputFilePath));
      
      // Write the raw markdown content
      await fs.writeFile(
        outputFilePath,
        content
      );
      console.log(`Exported raw content: ${relativePath}`);
      
      // Also create a JSON version with metadata
      await fs.writeFile(
        `${outputFilePath}.json`,
        JSON.stringify({ content }, null, 2)
      );
      console.log(`Exported JSON content: ${relativePath}.json`);
    }
    
    console.log("Exported all markdown content");
    console.log("Static export completed successfully!");
    
  } catch (error) {
    console.error("Error exporting static data:", error);
    process.exit(1);
  }
}

// Run the export
exportStaticData();
