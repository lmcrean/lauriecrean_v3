"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@playwright/test");
exports.default = (0, test_1.defineConfig)({
    testDir: './tests-e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    // Only using Safari as specified in custom instructions
    projects: [
        {
            name: 'safari',
            use: __assign(__assign({}, test_1.devices['Desktop Safari']), { baseURL: 'http://localhost:3000', 
                // Record videos for debugging if tests fail
                video: 'on-first-retry' }),
        },
    ],
    // Run your local dev server before starting the tests
    webServer: {
        command: 'npm run serve',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        stdout: 'pipe',
    },
});
