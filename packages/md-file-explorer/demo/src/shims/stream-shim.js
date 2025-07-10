// Empty shim for stream module
export default {};

// Basic stream implementation
export class Readable {
  constructor() {
    this._data = [];
    this._ended = false;
  }

  push(chunk) {
    if (chunk === null) {
      this._ended = true;
      return false;
    }
    this._data.push(chunk);
    return true;
  }

  read() {
    return this._data.shift() || null;
  }

  pipe() {
    return this;
  }
}

export class Writable {
  constructor() {}
  write() { return true; }
  end() {}
}

export class Transform extends Readable {
  constructor() {
    super();
  }
  _transform() {}
}
