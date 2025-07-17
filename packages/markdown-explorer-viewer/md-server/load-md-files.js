// This file contains server-side code for loading Markdown files
import { promises as fs } from "fs";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3011;

// Configure CORS to allow requests from the demo app
app.use(
  cors({
    origin: ["http://localhost:3004", "http://127.0.0.1:3004"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Proper way to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(`Server directory: ${__dirname}`);

const MD_DIR = path.resolve(__dirname, "../demo/src/md-docs");
console.log(`Markdown directory: ${MD_DIR}`);

// Middleware to serve static files
app.use("/md-docs", express.static(MD_DIR));

// Endpoint to get all the Markdown files recursively .md and .mdx
app.get("/api/md-docs", async (req, res) => {
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
        } else if (file.endsWith(".md") || file.endsWith(".mdx")) {
          results.push(filePath);
        }
      }
      return results;
    };

    const mdFiles = await getMarkdownFiles(MD_DIR);
    res.json(mdFiles);
    console.log(`Found ${mdFiles.length} Markdown files`);
  } catch (error) {
    console.error("Error reading directory:", error);
    res.status(500).json({ error: "Failed to read directory" });
  }
});

// Endpoint to get the content of a specific Markdown file
app.get("/api/md-docs/:filename", async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(MD_DIR, filename);

  try {
    const content = await fs.readFile(filePath, "utf-8");
    res.json({ content });
    console.log(
      `Endpoint to get the content of a specific Markdown file: ${filePath}`
    );
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).json({ error: "Failed to read file" });
  }
});

// Endpoint to get the content of a specific nested Markdown file like: docs\\api\\overview.md
//"D:\\repos\\asafarim-webapp\\packages\\markdown-explorer-viewer\\demo\\src\\md-docs\\changelog.md",
// "D:\\repos\\asafarim-webapp\\packages\\markdown-explorer-viewer\\demo\\src\\md-docs\\docs\\api\\overview.md",
app.get("/api/md-docs/*", async (req, res) => {
  const filePath = path.join(MD_DIR, req.params[0]);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    res.json({ content });
    console.log(`Found ${mdFiles.length} Markdown files`);
  } catch (error) {
    console.error("Error reading nested file:", error);
    res.status(500).json({ error: "Failed to read nested file" });
  }
});
// usage example: /api/md-docs/api/overview.md

app.get("/api/files", async (req, res) => {
  try {
    const files = await fs.readdir(MD_DIR);
    const mdFiles = files.filter((file) => file.endsWith(".md"));
    res.json(mdFiles);
    console.log(`Found ${mdFiles.length} Markdown files`);
  } catch (error) {
    console.error("Error reading directory:", error);
    res.status(500).json({ error: "Failed to read directory" });
  }
});

// Endpoint to get the content of a specific Markdown file
app.get("/api/files/:filename", async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(MD_DIR, filename);

  try {
    const content = await fs.readFile(filePath, "utf-8");
    res.json({ content });
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).json({ error: "Failed to read file" });
  }
});

// Endpoint to get the folder structure
app.get("/api/folder-structure", async (req, res) => {
  try {
    // Function to recursively build the file tree
    const buildFileTree = async (dirPath, relativePath = "") => {
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
    };

    // Create a root node
    const rootNode = {
      name: "root",
      path: "/",
      type: "folder",
      children: await buildFileTree(MD_DIR),
    };

    res.json(rootNode);
  } catch (error) {
    console.error("Error reading directory:", error);
    res.status(500).json({ error: "Failed to read directory" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "base-ui-server",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
