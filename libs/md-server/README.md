# Markdown File Server

A Node.js/Express server that provides REST API endpoints for serving markdown files and folder structures. This server is designed to work with the `@asafarim/markdown-explorer-viewer` package to demonstrate its capabilities.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or 20+
- npm, yarn, or pnpm

### Installation & Setup

1. **Navigate to the server directory:**
   ```bash
   cd libs/md-server
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Start the server:**
   ```bash
   node load-md-files.js
   ```

The server will start on `http://localhost:3011` and serve markdown files from:
```
packages/markdown-explorer-viewer/demo/src/md-docs/
```

## 📚 API Endpoints

### 1. Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "service": "md-file-folder-server",
  "timestamp": "2025-07-13T10:30:00.000Z"
}
```

### 2. Get Folder Structure
```http
GET /api/folder-structure
```
**Description:** Returns a hierarchical tree structure of all markdown files and folders.

**Response:**
```json
{
  "name": "root",
  "path": "/",
  "type": "folder",
  "children": [
    {
      "name": "docs",
      "path": "/docs",
      "type": "folder",
      "children": [
        {
          "name": "api",
          "path": "/docs/api",
          "type": "folder",
          "children": [
            {
              "name": "overview.md",
              "path": "/docs/api/overview.md",
              "type": "file",
              "lastModified": "2025-07-13T10:00:00.000Z",
              "size": 1234
            }
          ]
        }
      ]
    }
  ]
}
```

### 3. Get All Markdown Files
```http
GET /api/md-files
```
**Description:** Returns a flat list of all markdown files with their full file paths.

**Response:**
```json
[
  "D:\\repos\\asafarim-webapp\\packages\\markdown-explorer-viewer\\demo\\src\\md-docs\\changelog.md",
  "D:\\repos\\asafarim-webapp\\packages\\markdown-explorer-viewer\\demo\\src\\md-docs\\docs\\api\\overview.md"
]
```

### 4. Get Markdown File Content
```http
GET /api/md-content/{file-path}
```
**Description:** Returns the content of a specific markdown file.

**Examples:**
- `GET /api/md-content/changelog.md`
- `GET /api/md-content/docs/api/overview.md`
- `GET /api/md-content/docs/getting-started.md`

**Response:**
```json
{
  "content": "# API Overview\n\nThe Markdown Explorer Viewer provides..."
}
```

## 🔧 Configuration

### CORS Settings

The server is configured to allow requests from these origins:
- `http://localhost:3000` (Create React App default)
- `http://localhost:3003` (Custom port)
- `http://localhost:5173` (Vite default)
- `http://localhost:4173` (Vite preview)

### Markdown Directory

By default, the server serves files from:
```
../../packages/markdown-explorer-viewer/demo/src/md-docs
```

To change this, modify the `MD_DIR` constant in `load-md-files.js`:
```javascript
const MD_DIR = path.resolve(__dirname, 'your/custom/path');
```

## 🛠️ Development

### File Structure
```
libs/md-server/
├── load-md-files.js     # Main server file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

### Adding New Endpoints

To add new API endpoints, edit `load-md-files.js` and add your routes:

```javascript
app.get('/api/your-endpoint', async (req, res) => {
  try {
    // Your logic here
    res.json({ data: 'your-data' });
  } catch (error) {
    res.status(500).json({ error: 'Error message' });
  }
});
```

### Error Handling

The server includes comprehensive error handling:
- File not found (404)
- Server errors (500)
- CORS errors
- Directory access errors

### Logging

The server logs:
- Startup information
- File access attempts
- Error details
- Directory contents for debugging

## 📦 Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **fs/promises** - File system operations

## 🚀 Usage with Markdown Explorer Viewer

This server is designed to work with the `@asafarim/markdown-explorer-viewer` React component:

1. **Start this server** on port 3011
2. **Configure your React app** to use the API endpoints
3. **Pass a custom contentFetcher** to the MarkdownExplorer component:

```tsx
import { MarkdownExplorer } from '@asafarim/markdown-explorer-viewer';

const fetchMarkdownContent = async (filePath: string) => {
  const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  const response = await fetch(`http://localhost:3011/api/md-content/${cleanPath}`);
  const data = await response.json();
  return data.content;
};

function App() {
  const [fileTree, setFileTree] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3011/api/folder-structure')
      .then(res => res.json())
      .then(data => setFileTree(data));
  }, []);

  return (
    <MarkdownExplorer
      fileTree={fileTree}
      contentFetcher={fetchMarkdownContent}
      theme="auto"
      enableSearch={true}
    />
  );
}
```

## 🔗 Related

- **Demo App:** `../../packages/markdown-explorer-viewer/demo/`
- **Package:** `../../packages/markdown-explorer-viewer/`
- **Sample Files:** `../../packages/markdown-explorer-viewer/demo/src/md-docs/`

## 🐛 Troubleshooting

### Server won't start
- Check if port 3011 is available
- Ensure Node.js version is 18+
- Verify dependencies are installed

### CORS errors
- Add your frontend URL to the CORS configuration
- Check that requests are coming from allowed origins

### Files not found
- Verify the MD_DIR path exists
- Check file permissions
- Ensure markdown files have `.md` or `.mdx` extensions

### API returns empty responses
- Check server logs for errors
- Verify the markdown directory contains files
- Test endpoints directly with curl or Postman

## 📝 License

MIT License - see the main project LICENSE file for details.
