"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@playwright/test");
var path_1 = require("path");
/**
 * Tests to verify button styling in projects.md
 */
test_1.test.describe('Button Styling', function () {
    // Before each test, navigate to the projects page
    test_1.test.beforeEach(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // Navigate to the projects page - using the full URL pattern
                return [4 /*yield*/, page.goto('http://localhost:3001/projects')];
                case 1:
                    // Navigate to the projects page - using the full URL pattern
                    _c.sent();
                    // Wait for the page to fully load
                    return [4 /*yield*/, page.waitForLoadState('networkidle')];
                case 2:
                    // Wait for the page to fully load
                    _c.sent();
                    // Wait a bit longer to ensure CSS has loaded
                    return [4 /*yield*/, page.waitForTimeout(1000)];
                case 3:
                    // Wait a bit longer to ensure CSS has loaded
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, test_1.test)('should have buttons with styling applied', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var codeButtons, readmeButtons, liveDemoButtons, codeCount, readmeCount, liveCount, codeButton, readmeButton, liveDemoButton, codeStyles, hasIcons;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // Wait for buttons to be visible
                return [4 /*yield*/, page.waitForSelector('button, .button, [role="button"]')];
                case 1:
                    // Wait for buttons to be visible
                    _c.sent();
                    // Take a screenshot for debugging
                    return [4 /*yield*/, page.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'components', 'buttons-page.png')
                        })];
                case 2:
                    // Take a screenshot for debugging
                    _c.sent();
                    codeButtons = page.locator('button.code-btn');
                    readmeButtons = page.locator('button.readme-btn');
                    liveDemoButtons = page.locator('button.live-demo-btn');
                    return [4 /*yield*/, codeButtons.count()];
                case 3:
                    codeCount = _c.sent();
                    return [4 /*yield*/, readmeButtons.count()];
                case 4:
                    readmeCount = _c.sent();
                    return [4 /*yield*/, liveDemoButtons.count()];
                case 5:
                    liveCount = _c.sent();
                    console.log("Found ".concat(codeCount, " code buttons, ").concat(readmeCount, " readme buttons, ").concat(liveCount, " live demo buttons"));
                    // Only verify at least one of each exists
                    (0, test_1.expect)(codeCount).toBeGreaterThan(0);
                    (0, test_1.expect)(readmeCount).toBeGreaterThan(0);
                    (0, test_1.expect)(liveCount).toBeGreaterThan(0);
                    codeButton = codeButtons.first();
                    readmeButton = readmeButtons.first();
                    liveDemoButton = liveDemoButtons.first();
                    // Verify they are visible
                    return [4 /*yield*/, (0, test_1.expect)(codeButton).toBeVisible()];
                case 6:
                    // Verify they are visible
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(readmeButton).toBeVisible()];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(liveDemoButton).toBeVisible()];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, codeButton.evaluate(function (el) {
                            var styles = window.getComputedStyle(el);
                            return {
                                backgroundColor: styles.backgroundColor,
                                color: styles.color,
                                borderRadius: styles.borderRadius,
                                padding: styles.padding
                            };
                        })];
                case 9:
                    codeStyles = _c.sent();
                    console.log('Code button styles:', codeStyles);
                    // Very basic style checks (just make sure something is applied)
                    (0, test_1.expect)(codeStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
                    (0, test_1.expect)(codeStyles.backgroundColor).not.toBe('transparent');
                    (0, test_1.expect)(codeStyles.color).not.toBe('');
                    return [4 /*yield*/, page.locator('button i').count()];
                case 10:
                    hasIcons = _c.sent();
                    console.log("Found ".concat(hasIcons, " button icons"));
                    (0, test_1.expect)(hasIcons).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
