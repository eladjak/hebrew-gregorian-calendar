import '@testing-library/jest-dom';

// מוק גלובלי ל-Worker
global.Worker = class {
  constructor() {
    this.onmessage = jest.fn();
  }
  postMessage = jest.fn();
};

// מוק לפונקציית scrollTo
window.scrollTo = jest.fn();

// מוק ל-ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// מוק ל-URL
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// מוק ל-console.warn ו-console.error
console.warn = jest.fn();
console.error = jest.fn();
