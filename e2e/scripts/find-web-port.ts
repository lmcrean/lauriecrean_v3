import { createServer, Server } from 'http';
import { spawn, ChildProcess } from 'child_process';

/**
 * Check if a port is available
 */
const isPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve: (value: boolean) => void): void => {
    const server: Server = createServer();
    
    server.listen(port, (): void => {
      server.close((): void => {
        resolve(true);
      });
    });
    
    server.on('error', (): void => {
      resolve(false);
    });
  });
};

/**
 * Find next available port starting from basePort
 */
const findAvailablePort = async (basePort: number, maxAttempts: number = 10): Promise<number | null> => {
  for (let i = 0; i < maxAttempts; i++) {
    const portToTry: number = basePort + i;
    const available: boolean = await isPortAvailable(portToTry);
    
    if (available) {
      return portToTry;
    }
  }
  
  return null; // No available port found
};

/**
 * Start Docusaurus development server on available port
 */
const startDocusaurus = async (): Promise<{ port: number; process: ChildProcess } | null> => {
  const basePort: number = 3010;
  const port: number | null = await findAvailablePort(basePort);
  
  if (!port) {
    console.error('❌ No available port found');
    return null;
  }
  
  console.log(`🚀 Starting Docusaurus on port ${port}`);
  
  const docusaurusProcess: ChildProcess = spawn('npm', ['start', '--', '--port', port.toString()], {
    stdio: 'inherit',
    shell: true
  });
  
  // Wait a moment for the server to start
  await new Promise((resolve: (value: void) => void): void => {
    setTimeout(resolve, 3000);
  });
  
  return { port, process: docusaurusProcess };
};

/**
 * Check if a service is running on a specific port
 */
const checkService = async (port: number): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:${port}`);
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Main execution function
 */
const main = async (): Promise<void> => {
  try {
    console.log('🔍 Finding available port for web service...');
    
    const result = await startDocusaurus();
    
    if (!result) {
      process.exit(1);
    }
    
    const { port, process: docusaurusProcess } = result;
    
    // Check if service is actually running
    const isRunning: boolean = await checkService(port);
    
    if (isRunning) {
      console.log(`✅ Web service running on port ${port}`);
      console.log(`🌐 Available at: http://localhost:${port}`);
    } else {
      console.log(`⚠️ Web service may not be fully ready on port ${port}`);
    }
    
    // Handle process cleanup
    process.on('SIGINT', (): void => {
      console.log('\n🛑 Shutting down web service...');
      docusaurusProcess.kill();
      process.exit(0);
    });
    
  } catch (error: unknown) {
    console.error('❌ Error starting web service:', error);
    process.exit(1);
  }
};

// Export functions for testing
export {
  isPortAvailable,
  findAvailablePort,
  startDocusaurus,
  checkService
};

// Run main if this file is executed directly
if (require.main === module) {
  main();
} 