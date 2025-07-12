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
 * Production tests to verify typeface styling on the deployed site
 */
test_1.test.describe('Production Typeface Styling', function () {
    // Before each test, navigate to the home page
    test_1.test.beforeEach(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // baseURL is set in playwright.prod.config.ts to https://lauriecrean.dev
                return [4 /*yield*/, page.goto('/')];
                case 1:
                    // baseURL is set in playwright.prod.config.ts to https://lauriecrean.dev
                    _c.sent();
                    // Wait for the page to fully load
                    return [4 /*yield*/, page.waitForLoadState('networkidle')];
                case 2:
                    // Wait for the page to fully load
                    _c.sent();
                    // Wait a bit longer to ensure CSS has loaded
                    return [4 /*yield*/, page.waitForTimeout(2000)];
                case 3:
                    // Wait a bit longer to ensure CSS has loaded
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // Test that font resources are loaded
    (0, test_1.test)('should load font resources', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var fontRequests;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // Take a screenshot for debugging
                return [4 /*yield*/, page.screenshot({
                        path: path_1.default.join('tests-e2e', 'screenshots', 'components', 'prod-typefaces-fonts.png')
                    })];
                case 1:
                    // Take a screenshot for debugging
                    _c.sent();
                    return [4 /*yield*/, page.evaluate(function () {
                            // Get all resources loaded by the page
                            var resources = performance.getEntriesByType('resource');
                            // Filter for font files
                            var fontFiles = resources.filter(function (resource) {
                                var url = resource.name.toLowerCase();
                                return (url.includes('.ttf') ||
                                    url.includes('.otf') ||
                                    url.includes('.woff') ||
                                    url.includes('font'));
                            }).map(function (resource) { return resource.name; });
                            return fontFiles;
                        })];
                case 2:
                    fontRequests = _c.sent();
                    console.log('Font resources loaded:', fontRequests);
                    // Check if any font files were loaded
                    (0, test_1.expect)(fontRequests.length).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
    // Test that the CSS styles are loaded
    (0, test_1.test)('should load CSS with font definitions', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var cssFiles;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.evaluate(function () {
                        var resources = performance.getEntriesByType('resource');
                        return resources
                            .filter(function (resource) { return resource.name.toLowerCase().includes('.css'); })
                            .map(function (resource) { return resource.name; });
                    })];
                case 1:
                    cssFiles = _c.sent();
                    console.log('CSS files loaded in production:', cssFiles);
                    // Check if any CSS files were loaded
                    (0, test_1.expect)(cssFiles.length).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
    // Test that elements exist on the page with expected styling
    (0, test_1.test)('should have properly styled headings and paragraphs', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var h1Count, pCount, h1HasStyle, pHasStyle;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.locator('h1').count()];
                case 1:
                    h1Count = _c.sent();
                    (0, test_1.expect)(h1Count).toBeGreaterThan(0);
                    return [4 /*yield*/, page.locator('p').count()];
                case 2:
                    pCount = _c.sent();
                    (0, test_1.expect)(pCount).toBeGreaterThan(0);
                    // Take a screenshot of the page to visually verify fonts
                    return [4 /*yield*/, page.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'pages', 'prod-typefaces-page.png'),
                            fullPage: true
                        })];
                case 3:
                    // Take a screenshot of the page to visually verify fonts
                    _c.sent();
                    if (!(h1Count > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, page.locator('h1').first().evaluate(function (el) {
                            var style = window.getComputedStyle(el);
                            return {
                                fontFamily: style.fontFamily,
                                fontSize: style.fontSize,
                                textAlign: style.textAlign
                            };
                        })];
                case 4:
                    h1HasStyle = _c.sent();
                    console.log('H1 computed styles:', h1HasStyle);
                    // Check that h1 has font styling (basic verification)
                    (0, test_1.expect)(h1HasStyle.fontFamily).not.toBe('');
                    (0, test_1.expect)(h1HasStyle.fontSize).not.toBe('');
                    _c.label = 5;
                case 5:
                    if (!(pCount > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, page.locator('p').first().evaluate(function (el) {
                            var style = window.getComputedStyle(el);
                            return {
                                fontFamily: style.fontFamily,
                                fontSize: style.fontSize,
                                lineHeight: style.lineHeight
                            };
                        })];
                case 6:
                    pHasStyle = _c.sent();
                    console.log('Paragraph computed styles:', pHasStyle);
                    // Check that paragraph has font styling (basic verification)
                    (0, test_1.expect)(pHasStyle.fontFamily).not.toBe('');
                    (0, test_1.expect)(pHasStyle.fontSize).not.toBe('');
                    _c.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); });
    // Visual comparison test - capture reference screenshot
    (0, test_1.test)('visual comparison of styled elements', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var h1Element, pElement;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // Navigate to a specific page that has consistent content
                return [4 /*yield*/, page.goto('/')];
                case 1:
                    // Navigate to a specific page that has consistent content
                    _c.sent();
                    return [4 /*yield*/, page.waitForLoadState('networkidle')];
                case 2:
                    _c.sent();
                    h1Element = page.locator('h1').first();
                    return [4 /*yield*/, h1Element.count()];
                case 3:
                    if (!((_c.sent()) > 0)) return [3 /*break*/, 5];
                    // Take screenshot of the h1 element for visual comparison
                    return [4 /*yield*/, h1Element.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'elements', 'prod-h1-element.png')
                        })];
                case 4:
                    // Take screenshot of the h1 element for visual comparison
                    _c.sent();
                    _c.label = 5;
                case 5:
                    pElement = page.locator('p').first();
                    return [4 /*yield*/, pElement.count()];
                case 6:
                    if (!((_c.sent()) > 0)) return [3 /*break*/, 8];
                    // Take screenshot of the paragraph element for visual comparison
                    return [4 /*yield*/, pElement.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'elements', 'prod-p-element.png')
                        })];
                case 7:
                    // Take screenshot of the paragraph element for visual comparison
                    _c.sent();
                    _c.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    }); });
});
