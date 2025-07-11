
// Browser-side JavaScript for the front matter tool
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('processForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const path = document.getElementById('path').value.trim();
    if (!path) {
      alert('Please enter a file or directory path');
      return;
    }
    
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const date = document.getElementById('date').value.trim();
    const tags = document.getElementById('tags').value.trim();
    const recursive = document.getElementById('recursive').checked;
    const includeDate = document.getElementById('includeDate').checked;
    const includeTags = document.getElementById('includeTags').checked;
    const includeDescription = document.getElementById('includeDescription').checked;
    
    const options = {
      title: title || undefined,
      description: description || undefined,
      date: date || undefined,
      tags: tags ? tags.split(',').map(t => t.trim()) : undefined,
      includeDate,
      includeTags,
      includeDescription
    };
    
    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path, options, recursive })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      displayResults(data.results);
    } catch (error) {
      document.getElementById('results').style.display = 'block';
      document.getElementById('summary').innerHTML = '<p class="error">Error: ' + error.message + '</p>';
    }
  });
  
  function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const summaryDiv = document.getElementById('summary');
    const fileListDiv = document.getElementById('fileList');
    
    resultsDiv.style.display = 'block';
    
    const added = results.filter(r => r.status === 'added').length;
    const skipped = results.filter(r => r.status === 'skipped').length;
    const errors = results.filter(r => r.status === 'error').length;
    
    summaryDiv.innerHTML = '      <p><strong>Added front matter to:</strong> <span class="success">' + added + ' files</span></p>      <p><strong>Skipped:</strong> <span>' + skipped + ' files</span> (already have front matter)</p>      <p><strong>Errors:</strong> <span class="' + (errors > 0 ? 'error' : '') + '">' + errors + ' files</span></p>    ';
    
    fileListDiv.innerHTML = '';
    
    results.forEach(result => {
      const item = document.createElement('div');
      item.className = 'file-item ' + result.status;
      
      let statusText = '';
      switch (result.status) {
        case 'added':
          statusText = 'Added front matter';
          break;
        case 'skipped':
          statusText = 'Skipped (already has front matter)';
          break;
        case 'error':
          statusText = 'Error: ' + result.message;
          break;
      }
      
      item.innerHTML = '<strong>' + result.file + '</strong>: ' + statusText;
      fileListDiv.appendChild(item);
    });
  }
  
  // Implement a simple directory listing for browsing
  document.getElementById('browse').addEventListener('click', async function() {
    const currentPath = document.getElementById('path').value.trim() || 'D:\\repos\\asafarim-webapp\\apps\\base-ui\\md-docs';
    
    try {
      const response = await fetch('/api/browse?path=' + encodeURIComponent(currentPath));
      const data = await response.json();
      
      if (data.error) {
        alert('Error: ' + data.error);
        return;
      }
      
      // Create a simple directory browser dialog
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.zIndex = '1000';
      
      const dialog = document.createElement('div');
      dialog.style.width = '80%';
      dialog.style.maxWidth = '600px';
      dialog.style.maxHeight = '80%';
      dialog.style.backgroundColor = 'white';
      dialog.style.borderRadius = '4px';
      dialog.style.padding = '20px';
      dialog.style.display = 'flex';
      dialog.style.flexDirection = 'column';
      
      const header = document.createElement('div');
      header.style.marginBottom = '10px';
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      
      const title = document.createElement('h3');
      title.textContent = 'Select Directory or File';
      title.style.margin = '0';
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'X';
      closeBtn.style.border = 'none';
      closeBtn.style.background = 'none';
      closeBtn.style.fontSize = '16px';
      closeBtn.style.cursor = 'pointer';
      closeBtn.onclick = function() { document.body.removeChild(modal); };
      
      header.appendChild(title);
      header.appendChild(closeBtn);
      
      const pathDisplay = document.createElement('div');
      pathDisplay.textContent = currentPath;
      pathDisplay.style.padding = '8px';
      pathDisplay.style.backgroundColor = '#f5f5f5';
      pathDisplay.style.borderRadius = '4px';
      pathDisplay.style.marginBottom = '10px';
      pathDisplay.style.wordBreak = 'break-all';
      
      const content = document.createElement('div');
      content.style.overflowY = 'auto';
      content.style.flexGrow = '1';
      content.style.border = '1px solid #ddd';
      content.style.borderRadius = '4px';
      
      // Add parent directory option if not at root
      if (currentPath.includes('/') || currentPath.includes('\\')) {
        const parentDir = document.createElement('div');
        parentDir.textContent = 'Directory: ..';
        parentDir.style.padding = '8px';
        parentDir.style.cursor = 'pointer';
        parentDir.style.borderBottom = '1px solid #eee';
        parentDir.onclick = async function() {
          // Handle both forward and backslashes
          const separator = currentPath.includes('/') ? '/' : '\\';
          const parentPath = currentPath.split(separator).slice(0, -1).join(separator);
          document.getElementById('path').value = parentPath;
          document.body.removeChild(modal);
          document.getElementById('browse').click();
        };
        content.appendChild(parentDir);
      }
      
      // Add directories first
      data.items
        .filter(item => item.isDirectory)
        .forEach(item => {
          const dir = document.createElement('div');
          dir.textContent = 'Directory: ' + item.name;
          dir.style.padding = '8px';
          dir.style.cursor = 'pointer';
          dir.style.borderBottom = '1px solid #eee';
          dir.onclick = function() {
            document.getElementById('path').value = item.path;
            document.body.removeChild(modal);
            document.getElementById('browse').click();
          };
          content.appendChild(dir);
        });
      
      // Then add files
      data.items
        .filter(item => !item.isDirectory && item.name.endsWith('.md'))
        .forEach(item => {
          const file = document.createElement('div');
          file.textContent = 'File: ' + item.name;
          file.style.padding = '8px';
          file.style.cursor = 'pointer';
          file.style.borderBottom = '1px solid #eee';
          file.onclick = function() {
            document.getElementById('path').value = item.path;
            document.body.removeChild(modal);
          };
          content.appendChild(file);
        });
      
      const footer = document.createElement('div');
      footer.style.marginTop = '10px';
      footer.style.display = 'flex';
      footer.style.justifyContent = 'flex-end';
      
      const selectBtn = document.createElement('button');
      selectBtn.textContent = 'Select Current Directory';
      selectBtn.style.padding = '8px 16px';
      selectBtn.style.backgroundColor = '#3498db';
      selectBtn.style.color = 'white';
      selectBtn.style.border = 'none';
      selectBtn.style.borderRadius = '4px';
      selectBtn.style.cursor = 'pointer';
      selectBtn.onclick = function() {
        document.body.removeChild(modal);
      };
      
      footer.appendChild(selectBtn);
      
      dialog.appendChild(header);
      dialog.appendChild(pathDisplay);
      dialog.appendChild(content);
      dialog.appendChild(footer);
      
      modal.appendChild(dialog);
      document.body.appendChild(modal);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
});
  