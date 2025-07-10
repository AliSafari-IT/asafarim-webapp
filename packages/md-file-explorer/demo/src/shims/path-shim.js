// Empty shim for path module
export default {};

// Common path methods
export const join = (...args) => args.join('/');
export const resolve = (...args) => args.join('/');
export const dirname = (path) => path.split('/').slice(0, -1).join('/');
export const basename = (path) => path.split('/').pop();
export const extname = (path) => {
  const base = basename(path);
  const lastDotIndex = base.lastIndexOf('.');
  return lastDotIndex < 0 ? '' : base.slice(lastDotIndex);
};
export const normalize = (path) => path.replace(/\\/g, '/');
export const isAbsolute = (path) => /^\/|^[A-Z]:/i.test(path);
export const relative = (from, to) => to;
