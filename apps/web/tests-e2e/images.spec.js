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
test_1.test.describe('Image Loading Tests', function () {
    (0, test_1.test)('all images on the projects page should load correctly', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var images, failedImages, _i, images_1, img, src, alt, isVisible, naturalWidth;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // Navigate to the production URL - we'll override baseUrl from command line when running in production
                return [4 /*yield*/, page.goto('/projects')];
                case 1:
                    // Navigate to the production URL - we'll override baseUrl from command line when running in production
                    _c.sent();
                    // Wait for the page to be fully loaded
                    return [4 /*yield*/, page.waitForLoadState('networkidle')];
                case 2:
                    // Wait for the page to be fully loaded
                    _c.sent();
                    return [4 /*yield*/, page.locator('img').all()];
                case 3:
                    images = _c.sent();
                    console.log("Found ".concat(images.length, " images on the page"));
                    failedImages = [];
                    _i = 0, images_1 = images;
                    _c.label = 4;
                case 4:
                    if (!(_i < images_1.length)) return [3 /*break*/, 10];
                    img = images_1[_i];
                    return [4 /*yield*/, img.getAttribute('src')];
                case 5:
                    src = _c.sent();
                    return [4 /*yield*/, img.getAttribute('alt')];
                case 6:
                    alt = (_c.sent()) || 'No alt text';
                    if (!src) {
                        failedImages.push("Image with alt \"".concat(alt, "\" has no src attribute"));
                        return [3 /*break*/, 9];
                    }
                    // Skip GitHub shields badges as they are external resources
                    if (src.includes('img.shields.io')) {
                        console.log("Skipping GitHub shield badge: ".concat(src));
                        return [3 /*break*/, 9];
                    }
                    return [4 /*yield*/, img.isVisible()];
                case 7:
                    isVisible = _c.sent();
                    if (!isVisible) {
                        failedImages.push("Image with src \"".concat(src, "\" and alt \"").concat(alt, "\" is not visible"));
                        return [3 /*break*/, 9];
                    }
                    return [4 /*yield*/, img.evaluate(function (el) { return el.naturalWidth; })];
                case 8:
                    naturalWidth = _c.sent();
                    if (naturalWidth === 0) {
                        failedImages.push("Image failed to load: ".concat(src, " (alt: ").concat(alt, ")"));
                    }
                    _c.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 4];
                case 10:
                    // If any images failed to load, fail the test with details
                    if (failedImages.length > 0) {
                        console.error('Failed images:');
                        failedImages.forEach(function (failedImg) { return console.error(failedImg); });
                        (0, test_1.expect)(failedImages.length, "".concat(failedImages.length, " images failed to load:\n").concat(failedImages.join('\n'))).toBe(0);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    // Test specific key images that should always be present
    (0, test_1.test)('key project images should load correctly', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var keyImages, _i, keyImages_1, _c, selector, description, img, naturalWidth;
        var page = _b.page;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, page.goto('/projects')];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, page.waitForLoadState('networkidle')];
                case 2:
                    _d.sent();
                    keyImages = [
                        { selector: 'img[alt="banner"]', description: 'Banner image' },
                        { selector: '#odyssey-carousel img', description: 'Odyssey carousel image' },
                        { selector: '#coachmatrix-carousel img', description: 'Coach Matrix carousel image' },
                        { selector: '#steamreport-carousel img', description: 'Steam Report carousel image' }
                    ];
                    _i = 0, keyImages_1 = keyImages;
                    _d.label = 3;
                case 3:
                    if (!(_i < keyImages_1.length)) return [3 /*break*/, 7];
                    _c = keyImages_1[_i], selector = _c.selector, description = _c.description;
                    img = page.locator(selector).first();
                    return [4 /*yield*/, (0, test_1.expect)(img, "".concat(description, " should be visible")).toBeVisible()];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, img.evaluate(function (el) { return el.naturalWidth; })];
                case 5:
                    naturalWidth = _d.sent();
                    (0, test_1.expect)(naturalWidth, "".concat(description, " should have loaded properly")).toBeGreaterThan(0);
                    _d.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 3];
                case 7: return [2 /*return*/];
            }
        });
    }); });
});
