#!/bin/bash

# ProjectCard Demo Setup Script
echo "🚀 Setting up ProjectCard Demo..."

# Build the package
echo "📦 Building the package..."
cd "$(dirname "$0")"
npm run build

# Install demo dependencies
echo "⬇️  Installing demo dependencies..."
cd demo
npm install

# Start the demo
echo "🎯 Starting the demo..."
npm run dev
