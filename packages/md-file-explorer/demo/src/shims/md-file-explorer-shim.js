// Re-export the browser-compatible mock implementation
import { BrowserMdFileExplorer, mockFileTree, mockFileContent } from '../mockData';

// Re-export the mock implementation as the main API
export { BrowserMdFileExplorer as MdFileExplorer };

// Re-export the types from the original package
export const FileNode = {};
export const ScanResult = {};
export const ExplorerOptions = {};
export const ExplorerAPI = {};

// Re-export mock data
export const mockData = {
  fileTree: mockFileTree,
  fileContent: mockFileContent
};
