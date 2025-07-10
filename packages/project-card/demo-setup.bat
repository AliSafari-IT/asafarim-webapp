@echo off
REM ProjectCard Demo Setup Script
echo 🚀 Setting up ProjectCard Demo...

REM Build the package
echo 📦 Building the package...
cd /d %~dp0
npm run build

REM Install demo dependencies
echo ⬇️ Installing demo dependencies...
cd demo
npm install

REM Start the demo
echo 🎯 Starting the demo...
npm run dev
