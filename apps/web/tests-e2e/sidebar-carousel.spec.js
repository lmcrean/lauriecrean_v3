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
 * Test to verify carousel arrow functionality
 */
test_1.test.describe('Carousel Arrow Functionality', function () {
    (0, test_1.test)('carousel arrows should correctly navigate between slides', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var carouselIds, testCarousel, carouselId, _i, carouselIds_1, id, carousel, isVisible, slides, slideCount, nextButton, prevButton, initialActiveSlideIndex, afterNextClickIndex, currentIndex, afterPrevClickIndex;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // Navigate to the projects page where we have carousels
                return [4 /*yield*/, page.goto('/projects')];
                case 1:
                    // Navigate to the projects page where we have carousels
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
                    carouselIds = ['coachmatrix-carousel', 'odyssey-carousel'];
                    testCarousel = null;
                    carouselId = '';
                    _i = 0, carouselIds_1 = carouselIds;
                    _c.label = 4;
                case 4:
                    if (!(_i < carouselIds_1.length)) return [3 /*break*/, 7];
                    id = carouselIds_1[_i];
                    carousel = page.locator("#".concat(id));
                    return [4 /*yield*/, carousel.isVisible()];
                case 5:
                    isVisible = _c.sent();
                    if (isVisible) {
                        testCarousel = carousel;
                        carouselId = id;
                        console.log("Found visible carousel: ".concat(id));
                        return [3 /*break*/, 7];
                    }
                    _c.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    // Skip test if no carousels are found
                    if (!testCarousel) {
                        test_1.test.skip('No carousels found on the page');
                        return [2 /*return*/];
                    }
                    // Verify carousel is properly initialized
                    return [4 /*yield*/, (0, test_1.expect)(testCarousel.locator('.splide__track'), "".concat(carouselId, " track should be visible")).toBeVisible()];
                case 8:
                    // Verify carousel is properly initialized
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(testCarousel.locator('.splide__list'), "".concat(carouselId, " list should be visible")).toBeVisible()];
                case 9:
                    _c.sent();
                    slides = testCarousel.locator('.splide__slide');
                    return [4 /*yield*/, slides.count()];
                case 10:
                    slideCount = _c.sent();
                    console.log("Found ".concat(slideCount, " slides in ").concat(carouselId));
                    (0, test_1.expect)(slideCount, "".concat(carouselId, " should have slides")).toBeGreaterThan(0);
                    nextButton = testCarousel.locator('.splide__arrow--next');
                    prevButton = testCarousel.locator('.splide__arrow--prev');
                    return [4 /*yield*/, (0, test_1.expect)(nextButton, 'Next button should be visible').toBeVisible()];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(prevButton, 'Previous button should be visible').toBeVisible()];
                case 12:
                    _c.sent();
                    // Take screenshot of initial state
                    return [4 /*yield*/, testCarousel.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'carousels', 'carousel-initial.png')
                        })];
                case 13:
                    // Take screenshot of initial state
                    _c.sent();
                    return [4 /*yield*/, getActiveSlideIndex(page, carouselId)];
                case 14:
                    initialActiveSlideIndex = _c.sent();
                    console.log("Initial active slide index: ".concat(initialActiveSlideIndex));
                    // Test arrow functionality - click next
                    return [4 /*yield*/, nextButton.click()];
                case 15:
                    // Test arrow functionality - click next
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(300)];
                case 16:
                    _c.sent();
                    // Take screenshot after next click
                    return [4 /*yield*/, testCarousel.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'carousels', 'carousel-after-next.png')
                        })];
                case 17:
                    // Take screenshot after next click
                    _c.sent();
                    return [4 /*yield*/, getActiveSlideIndex(page, carouselId)];
                case 18:
                    afterNextClickIndex = _c.sent();
                    console.log("Active slide index after next click: ".concat(afterNextClickIndex));
                    // Instead of expecting a specific index, just verify it changed
                    (0, test_1.expect)(afterNextClickIndex, 'Active slide should change when next arrow is clicked').not.toBe(initialActiveSlideIndex);
                    currentIndex = afterNextClickIndex;
                    // Click back button to return to original slide
                    return [4 /*yield*/, prevButton.click()];
                case 19:
                    // Click back button to return to original slide
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(300)];
                case 20:
                    _c.sent();
                    // Take screenshot after prev click
                    return [4 /*yield*/, testCarousel.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'carousels', 'carousel-after-prev.png')
                        })];
                case 21:
                    // Take screenshot after prev click
                    _c.sent();
                    return [4 /*yield*/, getActiveSlideIndex(page, carouselId)];
                case 22:
                    afterPrevClickIndex = _c.sent();
                    console.log("Active slide index after prev click: ".concat(afterPrevClickIndex));
                    (0, test_1.expect)(afterPrevClickIndex, 'Active slide should change when prev arrow is clicked').not.toBe(currentIndex);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, test_1.test)('carousel arrows should visibly change slides', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var carouselIds, testCarousel, carouselId, _i, carouselIds_2, id, carousel, isVisible, nextButton, prevButton, initialImageSrc, newImageSrc, finalImageSrc;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // Navigate to the projects page where we have carousels
                return [4 /*yield*/, page.goto('/projects')];
                case 1:
                    // Navigate to the projects page where we have carousels
                    _c.sent();
                    // Wait for the page to fully load and JS to initialize
                    return [4 /*yield*/, page.waitForLoadState('networkidle')];
                case 2:
                    // Wait for the page to fully load and JS to initialize
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(2000)];
                case 3:
                    _c.sent();
                    carouselIds = ['coachmatrix-carousel', 'odyssey-carousel'];
                    testCarousel = null;
                    carouselId = '';
                    _i = 0, carouselIds_2 = carouselIds;
                    _c.label = 4;
                case 4:
                    if (!(_i < carouselIds_2.length)) return [3 /*break*/, 7];
                    id = carouselIds_2[_i];
                    carousel = page.locator("#".concat(id));
                    return [4 /*yield*/, carousel.isVisible()];
                case 5:
                    isVisible = _c.sent();
                    if (isVisible) {
                        testCarousel = carousel;
                        carouselId = id;
                        console.log("Found visible carousel: ".concat(id));
                        return [3 /*break*/, 7];
                    }
                    _c.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    if (!testCarousel) {
                        test_1.test.skip('No carousels found on the page');
                        return [2 /*return*/];
                    }
                    nextButton = testCarousel.locator('.splide__arrow--next');
                    prevButton = testCarousel.locator('.splide__arrow--prev');
                    // Verify arrows exist
                    return [4 /*yield*/, (0, test_1.expect)(nextButton).toBeVisible()];
                case 8:
                    // Verify arrows exist
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(prevButton).toBeVisible()];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, getActiveImageSrc(page, carouselId)];
                case 10:
                    initialImageSrc = _c.sent();
                    console.log('Initial slide image src:', initialImageSrc);
                    // Capture screenshot of the initial state
                    return [4 /*yield*/, testCarousel.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'carousels', 'carousel-visual-initial.png')
                        })];
                case 11:
                    // Capture screenshot of the initial state
                    _c.sent();
                    // Click next and verify image changes
                    return [4 /*yield*/, nextButton.click()];
                case 12:
                    // Click next and verify image changes
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 13:
                    _c.sent();
                    return [4 /*yield*/, getActiveImageSrc(page, carouselId)];
                case 14:
                    newImageSrc = _c.sent();
                    console.log('New slide image src:', newImageSrc);
                    // Verify a different image is showing
                    (0, test_1.expect)(newImageSrc, 'Carousel should display a different image after next click').not.toBe(initialImageSrc);
                    // Take screenshot of new state
                    return [4 /*yield*/, testCarousel.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'carousels', 'carousel-visual-next.png')
                        })];
                case 15:
                    // Take screenshot of new state
                    _c.sent();
                    // Click prev to go back to original slide
                    return [4 /*yield*/, prevButton.click()];
                case 16:
                    // Click prev to go back to original slide
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 17:
                    _c.sent();
                    return [4 /*yield*/, getActiveImageSrc(page, carouselId)];
                case 18:
                    finalImageSrc = _c.sent();
                    console.log('Final slide image src:', finalImageSrc);
                    // Take final screenshot
                    return [4 /*yield*/, testCarousel.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'carousels', 'carousel-visual-prev.png')
                        })];
                case 19:
                    // Take final screenshot
                    _c.sent();
                    // Verify we've returned to the original image or moved to a different one
                    // Different carousels may behave differently on prev click
                    (0, test_1.expect)(finalImageSrc, 'Carousel should display a different image after prev click').not.toBe(newImageSrc);
                    return [2 /*return*/];
            }
        });
    }); });
});
/**
 * Helper function to get the index of the current active slide
 */
function getActiveSlideIndex(page, carouselId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, page.evaluate(function (id) {
                    var carousel = document.querySelector("#".concat(id));
                    if (!carousel)
                        return -1;
                    var slides = carousel.querySelectorAll('.splide__slide');
                    var slideArray = Array.from(slides);
                    // First look for .is-active or .is-visible class
                    var activeSlideIndex = slideArray.findIndex(function (slide) {
                        return slide.classList.contains('is-active') ||
                            slide.classList.contains('is-visible');
                    });
                    // If no active class found, return the first slide index
                    return activeSlideIndex !== -1 ? activeSlideIndex : 0;
                }, carouselId)];
        });
    });
}
/**
 * Helper function to get the image src of the active slide
 */
function getActiveImageSrc(page, carouselId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, page.evaluate(function (id) {
                    var carousel = document.querySelector("#".concat(id));
                    if (!carousel)
                        return null;
                    // Find active slide or first slide
                    var activeSlide = carousel.querySelector('.splide__slide.is-active, .splide__slide.is-visible') ||
                        carousel.querySelector('.splide__slide');
                    if (!activeSlide)
                        return null;
                    // Get image src
                    var image = activeSlide.querySelector('img');
                    return image ? image.src : null;
                }, carouselId)];
        });
    });
}
