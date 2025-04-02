// Extension of the Window interface to include our file system APIs
interface Window {
  fs: {
    readFile(path: string, options?: { encoding?: string }): Promise<Uint8Array | string>;
    // Add other fs methods as needed
  };
}
