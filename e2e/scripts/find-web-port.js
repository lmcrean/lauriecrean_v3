const { createServer } = require('http');
const { spawn } = require('child_process');

/**
 * Check if a port is available
 */
const isPortAvailable = (port) => {
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
 */
const findAvailablePort = async (basePort, maxAttempts = 10) => {
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
 * Start Docusaurus with dynamic port
 */
const startDocusaurus = async () => {
  const mode = process.argv[2]; // 'manual' or 'e2e'
  const basePort = mode === 'manual' ? 3010 : 3020;
  
  try {
    const availablePort = await findAvailablePort(basePort);
    
    console.log(`🚀 Starting Docusaurus in ${mode} mode on port ${availablePort}`);
    
    // Set environment variable for React app
    const env = { ...process.env };
    if (mode === 'manual') {
      env.REACT_APP_TEST_MODE = 'manual';
    }
    
    // Start Docusaurus
    const docusaurus = spawn('npm', ['run', 'start', '--', '--port', availablePort.toString()], {
      cwd: '../apps/web',
      stdio: 'inherit',
      env,
      shell: true
    });
    
    // Handle process exit
    process.on('SIGTERM', () => {
      docusaurus.kill('SIGTERM');
    });
    
    process.on('SIGINT', () => {
      docusaurus.kill('SIGINT');
    });
    
    docusaurus.on('exit', (code) => {
      process.exit(code);
    });
    
  } catch (error) {
    console.error('❌ Failed to start web service:', error.message);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  startDocusaurus();
}

module.exports = { findAvailablePort, isPortAvailable }; 