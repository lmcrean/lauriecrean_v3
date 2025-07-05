import { createServer } from 'http';

/**
 * Check if a port is available
 */
export const isPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = createServer();
    
    server.listen(port, () => {
      server.close(() => {
        resolve(true);
      });
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
};

/**
 * Find next available port starting from basePort
 * @param basePort - The starting port to check
 * @param maxAttempts - Maximum number of ports to try (default: 10)
 * @returns Promise<number> - The available port number
 */
export const findAvailablePort = async (basePort: number, maxAttempts: number = 10): Promise<number> => {
  for (let i = 0; i < maxAttempts; i++) {
    const portToTry = basePort + i;
    const available = await isPortAvailable(portToTry);
    
    if (available) {
      if (i > 0) {
        console.log(`🔄 Port ${basePort} was in use, using port ${portToTry} instead`);
      }
      return portToTry;
    }
  }
  
  throw new Error(`❌ Could not find available port after trying ${maxAttempts} ports starting from ${basePort}`);
};

/**
 * Get port configuration from environment with fallbacks
 */
export const getPortConfig = () => {
  const PORT_MANUAL = parseInt(process.env.PORT_MANUAL || '3005');
  const PORT_E2E = parseInt(process.env.PORT_E2E || '3015');
  const currentPort = parseInt(process.env.PORT || PORT_E2E.toString());
  
  return {
    PORT_MANUAL,
    PORT_E2E,
    currentPort
  };
}; 