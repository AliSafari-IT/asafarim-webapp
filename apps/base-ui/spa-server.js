const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.SERVER_PORT || 3500;

// Enable CORS
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Special middleware to handle SPA routing
app.use((req, res, next) => {
  // Skip API requests and actual files
  if (req.url.startsWith('/api/') || 
      req.url.endsWith('.js') || 
      req.url.endsWith('.css') || 
      req.url.endsWith('.ico') || 
      req.url.endsWith('.png') || 
      req.url.endsWith('.svg') || 
      req.url.endsWith('.jpg')) {
    return next();
  }
  
  // For all other requests, serve index.html
  console.log(`Handling SPA route: ${req.url}`);
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`SPA server running at http://localhost:${PORT}`);
});
