const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3500;
const mdDocsPath = path.join(__dirname, "dist", "md-docs");

// Serve static files
app.use("/md-docs", express.static(mdDocsPath));

// Enable CORS
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3500", "http://localhost:5173"],
  credentials: false
}));

// API to get folder structure
app.get("/api/folder-structure", (req, res) => {
  try {
    const folderStructure = getFolderStructure(mdDocsPath);
    res.json({ nodes: folderStructure });
  } catch (error) {
    res.status(500).json({ error: "Failed to get folder structure" });
  }
});

// API to get file content
app.get("/api/file", (req, res) => {
  try {
    const filePath = req.query.path;
    if (!filePath) {
      return res.status(400).json({ error: "File path is required" });
    }

    const fullPath = path.join(mdDocsPath, filePath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: "File not found" });
    }

    const content = fs.readFileSync(fullPath, "utf-8");
    res.json({ content, path: filePath });
  } catch (error) {
    res.status(500).json({ error: "Failed to read file" });
  }
});

function getFolderStructure(dirPath, relativePath = "") {
  const items = fs.readdirSync(dirPath);
  const result = [];

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    const itemRelativePath = path.join(relativePath, item).replace(/\\/g, "/");

    if (stats.isDirectory()) {
      result.push({
        name: item,
        path: itemRelativePath,
        type: "folder",
        children: getFolderStructure(itemPath, itemRelativePath),
      });
    } else if (item.endsWith(".md")) {
      result.push({
        name: item,
        path: itemRelativePath,
        type: "file",
      });
    }
  }

  return result;
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});