// Empty shim for events module
export default {};

// EventEmitter class
export class EventEmitter {
  constructor() {
    this._events = {};
  }

  on(event, listener) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(listener);
    return this;
  }

  emit(event, ...args) {
    if (!this._events[event]) return false;
    this._events[event].forEach(listener => listener(...args));
    return true;
  }

  removeListener(event, listener) {
    if (!this._events[event]) return this;
    this._events[event] = this._events[event].filter(l => l !== listener);
    return this;
  }

  once(event, listener) {
    const onceWrapper = (...args) => {
      listener(...args);
      this.removeListener(event, onceWrapper);
    };
    return this.on(event, onceWrapper);
  }
}
