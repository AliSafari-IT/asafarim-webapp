// Empty shim for fs and fs/promises modules
export default {};

// Common fs methods
export const readFile = async () => '';
export const readFileSync = () => '';
export const writeFile = async () => {};
export const writeFileSync = () => {};
export const stat = async () => ({ isDirectory: () => false });
export const statSync = () => ({ isDirectory: () => false });
export const readdir = async () => [];
export const readdirSync = () => [];
export const mkdir = async () => {};
export const mkdirSync = () => {};
export const promises = {
  readFile: async () => '',
  writeFile: async () => {},
  stat: async () => ({ isDirectory: () => false }),
  readdir: async () => [],
  mkdir: async () => {}
};
