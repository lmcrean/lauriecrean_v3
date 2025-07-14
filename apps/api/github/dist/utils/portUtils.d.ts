/**
 * Check if a port is available
 */
export declare const isPortAvailable: (port: number) => Promise<boolean>;
/**
 * Find next available port starting from basePort
 * @param basePort - The starting port to check
 * @param maxAttempts - Maximum number of ports to try (default: 10)
 * @returns Promise<number> - The available port number
 */
export declare const findAvailablePort: (basePort: number, maxAttempts?: number) => Promise<number>;
/**
 * Get port configuration from environment with fallbacks
 */
export declare const getPortConfig: () => {
    PORT_MANUAL: number;
    PORT_E2E: number;
    currentPort: number;
};
//# sourceMappingURL=portUtils.d.ts.map