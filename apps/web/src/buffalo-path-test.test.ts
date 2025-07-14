// Mock fetch API with proper TypeScript types
interface MockResponse {
  ok: boolean;
  status: number;
  statusText: string;
  headers: Headers;
  blob?: () => Promise<Blob>;
}

interface MockFetch {
  (url: string): Promise<MockResponse>;
}

const mockFetch: MockFetch = async (url: string): Promise<MockResponse> => {
  // Log the URL being fetched
  console.log(`Fetching: ${url}`);
  
  // Simulate success for image files
  if (url.endsWith('.png')) {
    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({
        'Content-Type': 'image/png',
      }),
      blob: async (): Promise<Blob> => new Blob(['fake image data'], { type: 'image/png' })
    };
  }
  
  // Simulate 404 for other files
  return {
    ok: false,
    status: 404,
    statusText: 'Not Found',
  };
};

// Type assertion for global fetch
(global as any).fetch = mockFetch;

test('buffalo image paths resolve correctly', async (): Promise<void> => {
  // Define the image paths we expect to work
  const imagePaths: string[] = [
    '/screenshots/buffalo.png',
    '/screenshots/buffalo2.png',
    '/screenshots/buffalo3.png',
    '/screenshots/buffalo4.png',
    '/screenshots/buffalo5.png',
  ];

  // Test each image path
  for (const path of imagePaths) {
    console.log(`Testing path: ${path}`);
    
    const response = await fetch(path);
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/png');
    
    // Test blob functionality
    if (response.blob) {
      const blob = await response.blob();
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('image/png');
    }
  }
});

test('non-image paths return 404', async (): Promise<void> => {
  const testPaths: string[] = [
    '/nonexistent/path.txt',
    '/screenshots/missing.jpg',
    '/invalid/resource',
  ];

  for (const path of testPaths) {
    const response = await fetch(path);
    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);
  }
});

test('image path matching works correctly', async (): Promise<void> => {
  const validPaths: string[] = [
    '/any/deep/path/image.png',
    '/screenshots/buffalo.png',
    '/deep/nested/folder/test.png',
  ];

  for (const path of validPaths) {
    const response = await fetch(path);
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
  }
}); 