// Empty shim for util module
export default {};

// Common util methods
export const promisify = (fn) => (...args) => Promise.resolve(fn(...args));
export const inherits = (ctor, superCtor) => {
  ctor.super_ = superCtor;
  Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
};
export const inspect = (obj) => JSON.stringify(obj);
