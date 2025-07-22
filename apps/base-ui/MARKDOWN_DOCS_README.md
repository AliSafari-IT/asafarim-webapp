# ASafariM Markdown Documentation Server

This directory contains the markdown documentation server and React component for displaying beautiful, interactive documentation using the `@asafarim/simple-md-viewer` package.

## 🚀 Quick Start

### 1. Start the Markdown Server

The server serves markdown files from `public/markdown-files/` directory:

```bash
# Start the markdown server (port 3300)
npm run md-server
```

### 2. Start the React Application

In a separate terminal:

```bash
# Start the React app (port 5173)
npm run start
```

### 3. Access the Documentation

Navigate to: `http://localhost:5173/md-docs`

## 📁 File Structure

```
apps/base-ui/
├── server.js                          # Express server for serving markdown files
├── public/
│   └── markdown-files/                 # Your markdown documentation files
│       ├── README.md                   # Main welcome page
│       ├── getting-started/
│       │   └── quick-start.md         # Quick start guide
│       └── packages/
│           └── simple-md-viewer/
│               └── setup.md           # Package setup guide
└── src/
    └── pages/
        ├── MdDocsPage.tsx             # React component for markdown docs
        └── MdDocsPage.css             # Styling for the docs page
```

## 🔧 Features

### Server Features (server.js)
- ✅ **Express API** - RESTful endpoints for markdown content
- ✅ **CORS Configuration** - Supports multiple frontend ports
- ✅ **File Tree Generation** - Hierarchical structure of markdown files
- ✅ **Directory Details** - File sizes, modification dates, item counts
- ✅ **Health Check** - Server status endpoint
- ✅ **Error Handling** - Comprehensive error responses

### Client Features (MdDocsPage.tsx)
- ✅ **React Integration** - Seamless integration with existing React Router
- ✅ **Theme Support** - Uses existing theme context from your app
- ✅ **Loading States** - Proper loading and error handling
- ✅ **Server Health Check** - Validates server connection on mount
- ✅ **Responsive Design** - Works on all device sizes

## 📋 API Endpoints

The server provides these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /api/health` | GET | Server health check |
| `GET /api/folder-structure` | GET | File tree structure |
| `GET /api/file?path=<path>` | GET | Markdown file content |
| `GET /api/directory-details?path=<path>` | GET | Directory metadata |

### Example API Responses

**Health Check:**
```json
{
  "status": "ok",
  "service": "asafarim-md-server",
  "timestamp": "2025-01-22T10:30:00.000Z",
  "markdownPath": "/path/to/markdown-files"
}
```

**Folder Structure:**
```json
{
  "nodes": [
    {
      "name": "getting-started",
      "path": "getting-started",
      "type": "folder",
      "children": [
        {
          "name": "quick-start.md",
          "path": "getting-started/quick-start.md",
          "type": "file",
          "lastModified": "2025-01-22T10:00:00.000Z",
          "size": 5420
        }
      ]
    }
  ]
}
```

## 🎨 Theme Integration

The component automatically integrates with your existing theme system:

```tsx
// MdDocsPage uses your app's theme context
const { effectiveTheme, toggleTheme } = useTheme();

// Passes theme to the markdown viewer
<ThemeProvider theme={effectiveTheme} toggleTheme={toggleTheme}>
  <MarkdownContent ... />
</ThemeProvider>
```

## 📝 Adding Documentation

### 1. Create Markdown Files

Add `.md` files to `public/markdown-files/`:

```markdown
---
title: "Your Page Title"
description: "Page description"
author: "Your Name"
date: "2025-01-22"
category: "Documentation"
tags:
  - tag1
  - tag2
---

# Your Content

Your markdown content here...
```

### 2. Organize in Folders

Create folder structures for better organization:

```
markdown-files/
├── getting-started/
├── packages/
├── tutorials/
├── api-reference/
└── examples/
```

### 3. YAML Front Matter

Use YAML front matter for rich metadata:

```yaml
---
title: "Page Title"          # Display title
description: "Description"   # Page description
author: "Author Name"        # Author information
date: "2025-01-22"          # Last updated date
category: "Category"         # Content category
tags:                        # Search tags
  - documentation
  - guide
---
```

## 🛠️ Customization

### Styling

Override default styles in `MdDocsPage.css`:

```css
/* Custom theme variables */
:root {
  --smv-primary: #007acc;
  --smv-sidebar-width: 320px;
}

/* Dark theme support */
.md-docs-container.dark {
  /* Dark theme overrides */
}
```

### Server Configuration

Modify `server.js` for custom behavior:

```javascript
// Change port
const PORT = 3300;

// Change markdown directory
const mdDocsPath = path.join(__dirname, 'custom', 'docs');

// Add custom API endpoints
app.get('/api/custom', (req, res) => {
  // Custom logic
});
```

## 🚨 Troubleshooting

### Server Won't Start
1. Check if port 3300 is available
2. Ensure Node.js is installed (v18+)
3. Verify file permissions

### Files Not Loading
1. Check markdown directory exists
2. Verify file extensions (.md or .mdx)
3. Check server logs for errors

### CORS Issues
1. Ensure frontend URL is in CORS configuration
2. Check that both server and client are running
3. Verify API base URL in component

### Styling Issues
1. Import CSS: `import '@asafarim/simple-md-viewer/dist/style.css'`
2. Check for CSS conflicts
3. Verify theme integration

## 📦 Dependencies

The setup requires these packages:

```json
{
  "dependencies": {
    "@asafarim/simple-md-viewer": "workspace:^",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0"
  }
}
```

## 🔄 Development Workflow

### For Documentation Updates

1. **Edit markdown files** in `public/markdown-files/`
2. **Files are served immediately** (no restart needed)
3. **Refresh browser** to see changes

### For Server Changes

1. **Edit server.js**
2. **Restart server**: `npm run md-server`
3. **Refresh browser**

### For Component Changes

1. **Edit MdDocsPage.tsx or CSS**
2. **Vite hot reload** updates automatically

## 📋 Scripts Reference

```bash
# Start markdown server only
npm run md-server

# Start React app only  
npm run start

# Start both server + app
npm run dev-with-docs

# Start existing server + app (your current setup)
npm run dev
```

## 🎯 Next Steps

### Expand Documentation
- Add more markdown files to showcase features
- Create comprehensive API documentation
- Add tutorials and examples

### Enhance Features
- Add search functionality
- Implement file upload for dynamic content
- Add markdown editing capabilities

### Deploy
- Deploy server to cloud platform
- Configure production CORS settings
- Set up CI/CD for documentation updates

---

**Your markdown documentation system is now ready!** 🎉

Visit `http://localhost:5173/md-docs` after starting both servers to see your beautiful documentation in action.
