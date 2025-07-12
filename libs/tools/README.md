# @asafarim/md-tools

A collection of tools for working with markdown files in the ASafariM webapp, with a focus on front matter management.

## Table of Contents

- [Installation](#installation)
- [Front Matter Tool](#front-matter-tool)
  - [Basic Usage](#basic-usage)
  - [Command Line Interface](#command-line-interface)
  - [Interactive Mode](#interactive-mode)
  - [Web Interface](#web-interface)
- [Advanced Usage](#advanced-usage)
  - [Custom Front Matter](#custom-front-matter)
  - [Processing Directories](#processing-directories)
  - [Batch Processing](#batch-processing)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

## Installation

```bash
# Navigate to the tools directory
cd ./libs/tools

# Install dependencies
pnpm install

# Build the tools (optional)
pnpm build
```

## Front Matter Tool

The front matter tool (`add-frontmatter.ts`) helps you add YAML front matter to markdown files. It can automatically generate titles, descriptions, dates, and tags based on file content.

### Basic Usage

```bash
# Run in interactive mode
pnpm start

# Process a specific file
npx ts-node add-frontmatter.ts path/to/file.md

# Launch web interface
pnpm run web
```

### Command Line Interface

The tool provides a powerful command line interface with various options:

```bash
# Basic usage with a single file
npx ts-node add-frontmatter.ts ./docs/example.md

# Process a directory (recursive by default)
npx ts-node add-frontmatter.ts ./docs/CurrentProjects

# Non-recursive directory processing
npx ts-node add-frontmatter.ts ./docs/CurrentProjects --no-recursive

# Specify a custom title
npx ts-node add-frontmatter.ts path/to/file.md --title "Custom Document Title"

# Specify a custom description
npx ts-node add-frontmatter.ts path/to/file.md --description "This is a custom description for the document"

# Specify a custom date
npx ts-node add-frontmatter.ts path/to/file.md --date "2025-07-11"

# Specify custom tags
npx ts-node add-frontmatter.ts path/to/file.md --tags "react,component,documentation,asafarim"

# Exclude date from front matter
npx ts-node add-frontmatter.ts path/to/file.md --no-date

# Exclude tags from front matter
npx ts-node add-frontmatter.ts path/to/file.md --no-tags

# Exclude description from front matter
npx ts-node add-frontmatter.ts path/to/file.md --no-description

# Launch web interface
npx ts-node add-frontmatter.ts --web
```

### Interactive Mode

When run without arguments, the tool enters interactive mode, guiding you through the process:

```bash
npx ts-node add-frontmatter.ts
```

This will prompt you for:

- File or directory path
- Title (optional)
- Description (optional)
- Date (optional)
- Tags (optional)
- Whether to include date, tags, and description
- Whether to process directories recursively

Example interactive session:

```bash
=== Add Front Matter - Interactive Mode ===

Enter file or directory path: D:\repos\asafarim-webapp\apps\base-ui\md-docs\CurrentProjects\igs-pharma
Title (leave empty for auto-generation): 
Description (leave empty for auto-generation): Documentation for IGS Pharma projects
Date (leave empty for today's date): 
Tags (comma-separated, leave empty for auto-generation): pharma,healthcare,project
Include date? (y/n, default: y): y
Include tags? (y/n, default: y): y
Include description? (y/n, default: y): y
Process recursively? (y/n, default: y): y

Processing...

Results:
--------
Added front matter to 3 files
Skipped 0 files (already have front matter)
Encountered 0 errors
```

### Web Interface

The web interface provides a user-friendly way to add front matter to your markdown files:

```bash
# Launch the web interface
npx ts-node add-frontmatter.ts --web
```

This will:

1. Start a local web server (default port: 3030)
2. Open your default browser to the interface
3. Allow you to configure and process files through a graphical interface

The web interface features:

- File/directory path input with browse button
- Options for recursive processing
- Front matter customization (title, description, date, tags)
- Toggle switches for including/excluding front matter elements
- Results display showing processed, skipped, and error files

## Advanced Usage

### Custom Front Matter

You can fully customize the front matter that gets added to your files:

```bash
# Add custom front matter with specific title, description, date and tags
npx ts-node add-frontmatter.ts path/to/file.md \
  --title "Custom Document Title" \
  --description "This is a detailed description of the document" \
  --date "2025-07-11" \
  --tags "react,typescript,documentation,advanced"
```

### Processing Directories

Process all markdown files in a directory structure:

```bash
# Process all markdown files in a directory and its subdirectories
npx ts-node add-frontmatter.ts D:\repos\asafarim-webapp\apps\base-ui\md-docs

# Process only the markdown files in the specified directory (not subdirectories)
npx ts-node add-frontmatter.ts D:\repos\asafarim-webapp\apps\base-ui\md-docs --no-recursive
```

### Batch Processing

Process multiple specific directories:

```bash
# Process multiple directories in sequence
npx ts-node add-frontmatter.ts D:\repos\asafarim-webapp\apps\base-ui\md-docs\CurrentProjects\igs-pharma
npx ts-node add-frontmatter.ts D:\repos\asafarim-webapp\apps\base-ui\md-docs\CurrentProjects\packages\asafarim
npx ts-node add-frontmatter.ts D:\repos\asafarim-webapp\apps\base-ui\md-docs\SharedComponents
```

Or create a batch script:

```bash
# batch-add-frontmatter.sh
#!/bin/bash

DIRS=(
  "D:/repos/asafarim-webapp/apps/base-ui/md-docs/CurrentProjects/igs-pharma"
  "D:/repos/asafarim-webapp/apps/base-ui/md-docs/CurrentProjects/packages/asafarim"
  "D:/repos/asafarim-webapp/apps/base-ui/md-docs/SharedComponents"
)

for dir in "${DIRS[@]}"; do
  npx ts-node add-frontmatter.ts "$dir" --tags "documentation,asafarim"
done
```

## API Reference

The tool also exports functions that can be used programmatically:

```typescript
import { 
  processFile, 
  processDirectory, 
  generateFrontMatter, 
  startWebServer 
} from './add-frontmatter';

// Process a single file
const result = await processFile('path/to/file.md', {
  title: 'Custom Title',
  description: 'Custom description',
  date: '2025-07-11',
  tags: ['tag1', 'tag2'],
  includeDate: true,
  includeTags: true,
  includeDescription: true,
  defaultTags: ['documentation'],
  dateFormat: 'YYYY-MM-DD'
});

// Process a directory
const results = await processDirectory('path/to/directory', {
  // options same as above
}, true); // recursive

// Start the web server programmatically
startWebServer(3030); // custom port
```

## Troubleshooting

### Common Issues

1. **File access errors**
   - Ensure you have write permissions for the files you're trying to modify
   - Check if files are locked by another process
   - Verify that the paths are correct

2. **Front matter not being added**
   - Check if the file already has front matter (the tool skips these files)
   - Ensure the file is a valid markdown file with .md extension

3. **Web interface not opening**
   - Check if port 3030 is already in use
   - Try specifying a different port: `npx ts-node add-frontmatter.ts --web --port 3031`

4. **Dependencies not found**
   - Make sure you've run `pnpm install` in the tools directory
   - Check that all dependencies in package.json are installed

For more help, open an issue in the repository or contact the ASafariM team.
