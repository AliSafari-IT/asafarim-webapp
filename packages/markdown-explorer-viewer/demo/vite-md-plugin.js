/**
 * Vite plugin to handle markdown file URLs
 * This plugin ensures that URLs with .md extensions are properly handled
 * and don't result in 404 errors when accessed directly
 */
export default function markdownUrlPlugin() {
  return {
    name: 'markdown-url-handler',
    configureServer(server) {
      // Add middleware to handle all URLs including .md files
      server.middlewares.use((req, res, next) => {
        const url = req.url;
        
        // Store the original URL in a custom header so the client can access it
        res.setHeader('X-Original-Url', url);
        
        // Check if the URL is a direct file request that should be handled by the SPA
        if (url.endsWith('.md') || url.includes('/docs/') || url.includes('/api/') || url.includes('/examples/')) {
          // Log the rewrite for debugging
          console.log(`[markdown-url-handler] Rewriting ${url} to /index.html`);
          
          // Store the original URL in a custom query parameter
          // This ensures the SPA can access the original URL
          req.url = '/index.html';
        }
        
        next();
      });
    },
    // Handle build-time URL rewrites for preview server
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url;
        
        // Store the original URL in a custom header
        res.setHeader('X-Original-Url', url);
        
        // Check if the URL is a direct file request that should be handled by the SPA
        if (url.endsWith('.md') || url.includes('/docs/') || url.includes('/api/') || url.includes('/examples/')) {
          // Log the rewrite for debugging
          console.log(`[markdown-url-handler] Rewriting ${url} to /index.html`);
          
          // Store the original URL in a custom query parameter
          // This ensures the SPA can access the original URL
          req.url = '/index.html';
        }
        
        next();
      });
    },
    // Add a custom HTML transform to inject a script that handles direct navigation
    transformIndexHtml(html) {
      // Add a script to capture the original URL from the server
      return html.replace(
        '</head>',
        `<script>
          // Handle direct navigation to markdown files
          (function() {
            // Check if we're on a direct navigation to a markdown file
            const path = window.location.pathname;
            if (path.endsWith('.md') || path.includes('/docs/') || path.includes('/api/') || path.includes('/examples/')) {
              console.log('Direct navigation to:', path);
              // Store the original path for the app to use
              window.__ORIGINAL_PATH__ = path;
            }
          })();
        </script>
        </head>`
      );
    }
  };
}
