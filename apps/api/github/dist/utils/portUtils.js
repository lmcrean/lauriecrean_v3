"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortConfig = exports.findAvailablePort = exports.isPortAvailable = void 0;
const http_1 = require("http");
/**
 * Check if a port is available
 */
const isPortAvailable = (port) => {
    return new Promise((resolve) => {
        const server = (0, http_1.createServer)();
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
exports.isPortAvailable = isPortAvailable;
/**
 * Find next available port starting from basePort
 * @param basePort - The starting port to check
 * @param maxAttempts - Maximum number of ports to try (default: 10)
 * @returns Promise<number> - The available port number
 */
const findAvailablePort = async (basePort, maxAttempts = 10) => {
    for (let i = 0; i < maxAttempts; i++) {
        const portToTry = basePort + i;
        const available = await (0, exports.isPortAvailable)(portToTry);
        if (available) {
            if (i > 0) {
                console.log(`🔄 Port ${basePort} was in use, using port ${portToTry} instead`);
            }
            return portToTry;
        }
    }
    throw new Error(`❌ Could not find available port after trying ${maxAttempts} ports starting from ${basePort}`);
};
exports.findAvailablePort = findAvailablePort;
/**
 * Get port configuration from environment with fallbacks
 */
const getPortConfig = () => {
    const PORT_MANUAL = parseInt(process.env.PORT_MANUAL || '3005');
    const PORT_E2E = parseInt(process.env.PORT_E2E || '3015');
    const currentPort = parseInt(process.env.PORT || PORT_E2E.toString());
    return {
        PORT_MANUAL,
        PORT_E2E,
        currentPort
    };
};
exports.getPortConfig = getPortConfig;
//# sourceMappingURL=portUtils.js.map