export function setInputFiles(input, files) {
  Object.defineProperty(input, 'files', {
    value: files,
    writable: false,
    configurable: true,
  });
}

export function makeFile(name, size = 1024, type = 'application/pdf') {
  return new File([new Uint8Array(size)], name, { type, lastModified: Date.now() });
}
