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
/**
 * Tests to verify image paths for problematic carousels:
 * - crocodile-kingdom
 * - hoverboard
 * - antelope (not a carousel but has image issues)
 */
test_1.test.describe('Problem Carousel Image Tests', function () {
    (0, test_1.test)('crocodile-kingdom carousel should have correct image paths', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var carousel, images, imageCount, i, image, src, alt, imageResponse, status_1, error_1, normalizedSrc, altResponse, altError_1;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // Navigate to the projects page
                return [4 /*yield*/, page.goto('/projects')];
                case 1:
                    // Navigate to the projects page
                    _c.sent();
                    // Wait for the page to fully load
                    return [4 /*yield*/, page.waitForLoadState('networkidle')];
                case 2:
                    // Wait for the page to fully load
                    _c.sent();
                    // Wait additional time for JavaScript to initialize carousels
                    return [4 /*yield*/, page.waitForTimeout(2000)];
                case 3:
                    // Wait additional time for JavaScript to initialize carousels
                    _c.sent();
                    carousel = page.locator('#crocodile-kingdom-carousel');
                    return [4 /*yield*/, (0, test_1.expect)(carousel, 'Crocodile Kingdom carousel should be visible').toBeVisible()];
                case 4:
                    _c.sent();
                    images = carousel.locator('img');
                    return [4 /*yield*/, images.count()];
                case 5:
                    imageCount = _c.sent();
                    console.log("Found ".concat(imageCount, " images in Crocodile Kingdom carousel"));
                    i = 0;
                    _c.label = 6;
                case 6:
                    if (!(i < imageCount)) return [3 /*break*/, 17];
                    image = images.nth(i);
                    return [4 /*yield*/, image.getAttribute('src')];
                case 7:
                    src = _c.sent();
                    return [4 /*yield*/, image.getAttribute('alt')];
                case 8:
                    alt = (_c.sent()) || 'No alt text';
                    console.log("Image ".concat(i + 1, " - src: ").concat(src, ", alt: ").concat(alt));
                    if (!src) return [3 /*break*/, 16];
                    _c.label = 9;
                case 9:
                    _c.trys.push([9, 11, , 16]);
                    return [4 /*yield*/, page.request.get(src)];
                case 10:
                    imageResponse = _c.sent();
                    status_1 = imageResponse.status();
                    console.log("Image ".concat(src, " returned status: ").concat(status_1));
                    (0, test_1.expect)(status_1, "Image ".concat(src, " should return a 200 response")).toBe(200);
                    return [3 /*break*/, 16];
                case 11:
                    error_1 = _c.sent();
                    console.error("Error fetching image ".concat(src, ":"), error_1);
                    normalizedSrc = src;
                    _c.label = 12;
                case 12:
                    _c.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, page.request.get(normalizedSrc)];
                case 13:
                    altResponse = _c.sent();
                    console.log("Alternative path ".concat(normalizedSrc, " returned status: ").concat(altResponse.status()));
                    console.log("Image ".concat(i + 1, " should use path: ").concat(normalizedSrc, " instead of ").concat(src));
                    return [3 /*break*/, 15];
                case 14:
                    altError_1 = _c.sent();
                    console.error("Error fetching alternative path ".concat(normalizedSrc, ":"), altError_1);
                    // The test should fail since both paths failed
                    throw new Error("Image ".concat(src, " cannot be loaded with either path pattern"));
                case 15: return [3 /*break*/, 16];
                case 16:
                    i++;
                    return [3 /*break*/, 6];
                case 17: return [2 /*return*/];
            }
        });
    }); });
    (0, test_1.test)('hoverboard carousel should have correct image paths', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var carousel, images, imageCount, i, image, src, alt, imageResponse, status_2, error_2, normalizedSrc, altResponse, altError_2;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // Navigate to the projects page
                return [4 /*yield*/, page.goto('/projects')];
                case 1:
                    // Navigate to the projects page
                    _c.sent();
                    // Wait for the page to fully load
                    return [4 /*yield*/, page.waitForLoadState('networkidle')];
                case 2:
                    // Wait for the page to fully load
                    _c.sent();
                    // Wait additional time for JavaScript to initialize carousels
                    return [4 /*yield*/, page.waitForTimeout(2000)];
                case 3:
                    // Wait additional time for JavaScript to initialize carousels
                    _c.sent();
                    carousel = page.locator('#hoverboard-carousel');
                    return [4 /*yield*/, (0, test_1.expect)(carousel, 'Hoverboard carousel should be visible').toBeVisible()];
                case 4:
                    _c.sent();
                    images = carousel.locator('img');
                    return [4 /*yield*/, images.count()];
                case 5:
                    imageCount = _c.sent();
                    console.log("Found ".concat(imageCount, " images in Hoverboard carousel"));
                    i = 0;
                    _c.label = 6;
                case 6:
                    if (!(i < imageCount)) return [3 /*break*/, 17];
                    image = images.nth(i);
                    return [4 /*yield*/, image.getAttribute('src')];
                case 7:
                    src = _c.sent();
                    return [4 /*yield*/, image.getAttribute('alt')];
                case 8:
                    alt = (_c.sent()) || 'No alt text';
                    console.log("Image ".concat(i + 1, " - src: ").concat(src, ", alt: ").concat(alt));
                    if (!src) return [3 /*break*/, 16];
                    _c.label = 9;
                case 9:
                    _c.trys.push([9, 11, , 16]);
                    return [4 /*yield*/, page.request.get(src)];
                case 10:
                    imageResponse = _c.sent();
                    status_2 = imageResponse.status();
                    console.log("Image ".concat(src, " returned status: ").concat(status_2));
                    (0, test_1.expect)(status_2, "Image ".concat(src, " should return a 200 response")).toBe(200);
                    return [3 /*break*/, 16];
                case 11:
                    error_2 = _c.sent();
                    console.error("Error fetching image ".concat(src, ":"), error_2);
                    normalizedSrc = src;
                    _c.label = 12;
                case 12:
                    _c.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, page.request.get(normalizedSrc)];
                case 13:
                    altResponse = _c.sent();
                    console.log("Alternative path ".concat(normalizedSrc, " returned status: ").concat(altResponse.status()));
                    console.log("Image ".concat(i + 1, " should use path: ").concat(normalizedSrc, " instead of ").concat(src));
                    return [3 /*break*/, 15];
                case 14:
                    altError_2 = _c.sent();
                    console.error("Error fetching alternative path ".concat(normalizedSrc, ":"), altError_2);
                    // The test should fail since both paths failed
                    throw new Error("Image ".concat(src, " cannot be loaded with either path pattern"));
                case 15: return [3 /*break*/, 16];
                case 16:
                    i++;
                    return [3 /*break*/, 6];
                case 17: return [2 /*return*/];
            }
        });
    }); });
    (0, test_1.test)('antelope image should have correct path', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var antelopeSection, antelopeImage, src, imageResponse, status_3, error_3, normalizedSrc, altResponse, altError_3;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // Navigate to the projects page
                return [4 /*yield*/, page.goto('/projects')];
                case 1:
                    // Navigate to the projects page
                    _c.sent();
                    // Wait for the page to fully load
                    return [4 /*yield*/, page.waitForLoadState('networkidle')];
                case 2:
                    // Wait for the page to fully load
                    _c.sent();
                    // Wait additional time for JavaScript to initialize
                    return [4 /*yield*/, page.waitForTimeout(2000)];
                case 3:
                    // Wait additional time for JavaScript to initialize
                    _c.sent();
                    antelopeSection = page.locator('h2:has-text("Antelope")').locator('..').locator('..');
                    antelopeImage = antelopeSection.locator('img[src*="antelope"]');
                    // Verify the image exists
                    return [4 /*yield*/, (0, test_1.expect)(antelopeImage, 'Antelope image should be visible').toBeVisible()];
                case 4:
                    // Verify the image exists
                    _c.sent();
                    return [4 /*yield*/, antelopeImage.getAttribute('src')];
                case 5:
                    src = _c.sent();
                    console.log("Antelope image src: ".concat(src));
                    if (!src) return [3 /*break*/, 13];
                    _c.label = 6;
                case 6:
                    _c.trys.push([6, 8, , 13]);
                    return [4 /*yield*/, page.request.get(src)];
                case 7:
                    imageResponse = _c.sent();
                    status_3 = imageResponse.status();
                    console.log("Image ".concat(src, " returned status: ").concat(status_3));
                    (0, test_1.expect)(status_3, "Image ".concat(src, " should return a 200 response")).toBe(200);
                    return [3 /*break*/, 13];
                case 8:
                    error_3 = _c.sent();
                    console.error("Error fetching image ".concat(src, ":"), error_3);
                    normalizedSrc = src;
                    _c.label = 9;
                case 9:
                    _c.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, page.request.get(normalizedSrc)];
                case 10:
                    altResponse = _c.sent();
                    console.log("Alternative path ".concat(normalizedSrc, " returned status: ").concat(altResponse.status()));
                    console.log("Antelope image should use path: ".concat(normalizedSrc, " instead of ").concat(src));
                    return [3 /*break*/, 12];
                case 11:
                    altError_3 = _c.sent();
                    console.error("Error fetching alternative path ".concat(normalizedSrc, ":"), altError_3);
                    // The test should fail since both paths failed
                    throw new Error("Image ".concat(src, " cannot be loaded with either path pattern"));
                case 12: return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    }); });
});
