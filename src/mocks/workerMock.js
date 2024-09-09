export default class Worker {
  constructor() {
    this.onmessage = jest.fn();
  }
  postMessage = jest.fn();
}