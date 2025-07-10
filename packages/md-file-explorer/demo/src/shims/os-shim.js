// Empty shim for os module
export default {};

// Common os methods
export const platform = () => 'browser';
export const EOL = '\n';
export const homedir = () => '/home/user';
export const tmpdir = () => '/tmp';
