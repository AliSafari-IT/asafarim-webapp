document.addEventListener('DOMContentLoaded', () => {
  const converterForm = document.getElementById('converterForm');
  const browseFilesBtn = document.getElementById('browseFiles');
  const fileListContainer = document.getElementById('fileListContainer');
  const fileList = document.getElementById('fileList');
  const resultsContainer = document.getElementById('resultsContainer');
  const results = document.getElementById('results');
  
  // Load available TypeScript files
  loadTsFiles();
  
  // Event listeners
  converterForm.addEventListener('submit', handleFormSubmit);
  browseFilesBtn.addEventListener('click', toggleFileList);
  
  // Functions
  async function loadTsFiles() {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      
      if (data.files && data.files.length > 0) {
        renderFileList(data.files);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }
  
  function renderFileList(files) {
    fileList.innerHTML = '';
    
    files.forEach(file => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.textContent = file;
      fileItem.addEventListener('click', () => {
        document.getElementById('inputPath').value = file;
        toggleFileList();
      });
      
      fileList.appendChild(fileItem);
    });
  }
  
  function toggleFileList() {
    fileListContainer.classList.toggle('hidden');
  }
  
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(converterForm);
    const payload = {
      inputPath: formData.get('inputPath'),
      outputPath: formData.get('outputPath'),
      variableName: formData.get('variableName'),
      prefix: formData.get('prefix'),
      createDirs: formData.get('createDirs') === 'on'
    };
    
    try {
      // Show loading state
      results.innerHTML = '<div class="loading">Processing...</div>';
      resultsContainer.classList.remove('hidden');
      
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        results.innerHTML = `
          <div class="success">
            <h4>✅ Conversion Successful</h4>
            <p>${data.message}</p>
            <p><strong>${data.fileCount}</strong> files extracted to: <code>${payload.outputPath}</code></p>
          </div>
        `;
      } else {
        results.innerHTML = `
          <div class="error">
            <h4>❌ Conversion Failed</h4>
            <p>${data.error}</p>
          </div>
        `;
      }
    } catch (error) {
      results.innerHTML = `
        <div class="error">
          <h4>❌ Error</h4>
          <p>${error.message || 'An unexpected error occurred'}</p>
        </div>
      `;
    }
  }
});