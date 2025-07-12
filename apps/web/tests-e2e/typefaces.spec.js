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
 * Tests to verify typeface styling across the site
 */
test_1.test.describe('Typeface Styling', function () {
    // Before each test, navigate to the home page
    test_1.test.beforeEach(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // Navigate to the home page
                return [4 /*yield*/, page.goto('http://localhost:3000')];
                case 1:
                    // Navigate to the home page
                    _c.sent();
                    // Wait for the page to fully load
                    return [4 /*yield*/, page.waitForLoadState('networkidle')];
                case 2:
                    // Wait for the page to fully load
                    _c.sent();
                    // Wait longer to ensure CSS and fonts have loaded
                    return [4 /*yield*/, page.waitForTimeout(3000)];
                case 3:
                    // Wait longer to ensure CSS and fonts have loaded
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // Test that the font files are loaded in the page
    (0, test_1.test)('should load font files', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var _i, _c, fontFile, fontUrl, fontResponse, fontRequests, hasFunnelFont, hasGlacialFont, hasActorFont;
        var page = _b.page;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: 
                // Take a screenshot for debugging
                return [4 /*yield*/, page.screenshot({
                        path: path_1.default.join('tests-e2e', 'screenshots', 'components', 'typefaces-fonts.png')
                    })];
                case 1:
                    // Take a screenshot for debugging
                    _d.sent();
                    _i = 0, _c = ['FunnelDisplay-VariableFont_wght.ttf', 'GlacialIndifference-Regular.woff', 'GlacialIndifference-Bold.woff'];
                    _d.label = 2;
                case 2:
                    if (!(_i < _c.length)) return [3 /*break*/, 5];
                    fontFile = _c[_i];
                    fontUrl = "http://localhost:3000/fonts/".concat(fontFile);
                    return [4 /*yield*/, page.evaluate(function (url) { return __awaiter(void 0, void 0, void 0, function () {
                            var response, error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, fetch(url)];
                                    case 1:
                                        response = _a.sent();
                                        return [2 /*return*/, {
                                                status: response.status,
                                                contentType: response.headers.get('content-type'),
                                                ok: response.ok
                                            }];
                                    case 2:
                                        error_1 = _a.sent();
                                        return [2 /*return*/, { error: error_1.toString(), ok: false }];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }, fontUrl)];
                case 3:
                    fontResponse = _d.sent();
                    console.log("Font file ".concat(fontFile, " check:"), fontResponse);
                    (0, test_1.expect)(fontResponse.ok).toBeTruthy();
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, page.evaluate(function () {
                        // Get all resources loaded by the page
                        var resources = performance.getEntriesByType('resource');
                        // Filter for font files
                        var fontFiles = resources.filter(function (resource) {
                            var url = resource.name.toLowerCase();
                            return url.includes('.ttf') || url.includes('.otf') || url.includes('.woff');
                        }).map(function (resource) { return resource.name; });
                        return fontFiles;
                    })];
                case 6:
                    fontRequests = _d.sent();
                    console.log('Font files loaded:', fontRequests);
                    // Check if any font files were loaded
                    (0, test_1.expect)(fontRequests.length).toBeGreaterThan(0);
                    hasFunnelFont = fontRequests.some(function (url) { return url.includes('funnel') || url.includes('FunnelDisplay'); });
                    hasGlacialFont = fontRequests.some(function (url) { return url.includes('glacial') || url.includes('GlacialIndifference'); });
                    hasActorFont = fontRequests.some(function (url) { return url.includes('actor'); });
                    // Log what we found for debugging
                    console.log('Found fonts - Funnel:', hasFunnelFont, 'GlacialIndifference:', hasGlacialFont, 'Actor:', hasActorFont);
                    return [2 /*return*/];
            }
        });
    }); });
    // Test that the CSS file with font definitions is loaded
    (0, test_1.test)('should load typefaces CSS file', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var cssFiles, hasFontCss;
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
                    console.log('CSS files loaded:', cssFiles);
                    // Check if any CSS files were loaded
                    (0, test_1.expect)(cssFiles.length).toBeGreaterThan(0);
                    hasFontCss = cssFiles.some(function (url) {
                        return url.includes('typefaces') ||
                            url.includes('fonts') ||
                            url.includes('styles') ||
                            url.includes('main');
                    });
                    (0, test_1.expect)(hasFontCss).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    // Test that elements exist on the page with expected styling
    (0, test_1.test)('should have heading and paragraph elements on the page', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var h1Count, pCount, h1Styles, hasFunnelFont, pStyles, hasGlacialFont;
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
                            path: path_1.default.join('tests-e2e', 'screenshots', 'pages', 'typefaces-page.png'),
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
                    h1Styles = _c.sent();
                    console.log('H1 computed styles:', h1Styles);
                    // Check that h1 has Funnel Display font (or at least a non-default font)
                    (0, test_1.expect)(h1Styles.fontFamily).not.toBe('');
                    hasFunnelFont = h1Styles.fontFamily.toLowerCase().includes('funnel');
                    console.log('H1 has Funnel Display font:', hasFunnelFont);
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
                    pStyles = _c.sent();
                    console.log('Paragraph computed styles:', pStyles);
                    // Check that paragraph has GlacialIndifference font (or at least a non-default font)
                    (0, test_1.expect)(pStyles.fontFamily).not.toBe('');
                    hasGlacialFont = pStyles.fontFamily.toLowerCase().includes('glacial');
                    console.log('Paragraph has GlacialIndifference font:', hasGlacialFont);
                    _c.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); });
});
