Object.defineProperty(window, 'crypto', {
  value: {
    ...window.crypto,
    randomUUID: () => 'test-uuid'
  }
}); 