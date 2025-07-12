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
 * Test to verify Buffalo carousel functionality and image loading
 */
test_1.test.describe('Buffalo Carousel', function () {
    (0, test_1.test)('buffalo carousel should load and display correctly', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var buffaloCarousel, slides, slideCount, nextButton, prevButton, progressBar, images, imageCount, i, image, src, alt, initialSlide, initialSrc, newActiveSlide, newSrc;
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
                    // Wait additional time for JavaScript to initialize carousel
                    return [4 /*yield*/, page.waitForTimeout(2000)];
                case 3:
                    // Wait additional time for JavaScript to initialize carousel
                    _c.sent();
                    buffaloCarousel = page.locator('#buffalo-carousel');
                    return [4 /*yield*/, (0, test_1.expect)(buffaloCarousel, 'Buffalo carousel should be visible').toBeVisible()];
                case 4:
                    _c.sent();
                    // Check if the carousel has the proper structure
                    return [4 /*yield*/, (0, test_1.expect)(buffaloCarousel.locator('.splide__track'), 'Buffalo carousel track should be visible').toBeVisible()];
                case 5:
                    // Check if the carousel has the proper structure
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(buffaloCarousel.locator('.splide__list'), 'Buffalo carousel list should be visible').toBeVisible()];
                case 6:
                    _c.sent();
                    slides = buffaloCarousel.locator('.splide__slide');
                    return [4 /*yield*/, slides.count()];
                case 7:
                    slideCount = _c.sent();
                    (0, test_1.expect)(slideCount, 'Buffalo carousel should have at least 1 slide').toBeGreaterThan(0);
                    console.log("Found ".concat(slideCount, " slides in buffalo carousel"));
                    nextButton = buffaloCarousel.locator('.splide__arrow--next');
                    prevButton = buffaloCarousel.locator('.splide__arrow--prev');
                    return [4 /*yield*/, (0, test_1.expect)(nextButton, 'Next button should be visible').toBeVisible()];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(prevButton, 'Previous button should be visible').toBeVisible()];
                case 9:
                    _c.sent();
                    progressBar = buffaloCarousel.locator('.my-carousel-progress');
                    return [4 /*yield*/, (0, test_1.expect)(progressBar, 'Progress bar container should be visible').toBeVisible()];
                case 10:
                    _c.sent();
                    images = buffaloCarousel.locator('img');
                    return [4 /*yield*/, images.count()];
                case 11:
                    imageCount = _c.sent();
                    console.log("Found ".concat(imageCount, " images in buffalo carousel"));
                    i = 0;
                    _c.label = 12;
                case 12:
                    if (!(i < imageCount)) return [3 /*break*/, 16];
                    image = images.nth(i);
                    return [4 /*yield*/, image.getAttribute('src')];
                case 13:
                    src = _c.sent();
                    return [4 /*yield*/, image.getAttribute('alt')];
                case 14:
                    alt = (_c.sent()) || 'No alt text';
                    console.log("Image ".concat(i + 1, " - src: ").concat(src, ", alt: ").concat(alt));
                    // Verify the image path follows expected structure
                    if (src) {
                        (0, test_1.expect)(src, "Image ".concat(i + 1, " should have a valid src path")).toBeTruthy();
                        // Check if the path uses the expected structure
                        if (src.includes('/screenshots/')) {
                            console.log("Image ".concat(i + 1, " uses /screenshots/ path structure"));
                        }
                        else {
                            console.log("Image ".concat(i + 1, " uses a different path structure: ").concat(src));
                        }
                    }
                    _c.label = 15;
                case 15:
                    i++;
                    return [3 /*break*/, 12];
                case 16: 
                // Take a screenshot of the buffalo carousel for visual reference
                return [4 /*yield*/, buffaloCarousel.screenshot({
                        path: path_1.default.join('tests-e2e', 'screenshots', 'carousels', 'buffalo-carousel.png')
                    })];
                case 17:
                    // Take a screenshot of the buffalo carousel for visual reference
                    _c.sent();
                    if (!(slideCount > 1)) return [3 /*break*/, 22];
                    initialSlide = buffaloCarousel.locator('.splide__slide.is-active, .splide__slide').first();
                    return [4 /*yield*/, initialSlide.locator('img').getAttribute('src')];
                case 18:
                    initialSrc = _c.sent();
                    // Click the next button
                    return [4 /*yield*/, nextButton.click()];
                case 19:
                    // Click the next button
                    _c.sent();
                    // Wait for transition
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 20:
                    // Wait for transition
                    _c.sent();
                    newActiveSlide = buffaloCarousel.locator('.splide__slide.is-active, .splide__slide').first();
                    return [4 /*yield*/, newActiveSlide.locator('img').getAttribute('src')];
                case 21:
                    newSrc = _c.sent();
                    // Verify the slide changed (different image src)
                    (0, test_1.expect)(newSrc, 'Carousel should navigate to a different slide').not.toBe(initialSrc);
                    _c.label = 22;
                case 22: return [2 /*return*/];
            }
        });
    }); });
});
