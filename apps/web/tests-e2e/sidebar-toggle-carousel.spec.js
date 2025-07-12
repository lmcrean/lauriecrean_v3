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
 * Test to verify carousel behavior when sidebar is toggled
 */
test_1.test.describe('Sidebar Toggle Carousel Integrity', function () {
    (0, test_1.test)('carousel should maintain visual integrity after sidebar toggle', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var carouselIds, testCarousel, carouselId, _i, carouselIds_1, id, carousel, isVisible, slides, slideCount, nextButton, prevButton, initialActiveSlideIndex, initialImageSrc, initialMetrics, afterNextClickSrc, afterNextClickIndex, indexChanged, imageChanged, afterPrevClickSrc, sidebarCollapseButton, collapseButtonExists, afterToggleMetrics, afterToggleImageSrc, finalNextSrc;
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
                    // Skip test only if truly no carousels are found
                    if (!testCarousel) {
                        console.log('No carousels found, skipping test');
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
                    return [4 /*yield*/, getActiveSlideIndex(page, carouselId)];
                case 13:
                    initialActiveSlideIndex = _c.sent();
                    console.log("Initial active slide index: ".concat(initialActiveSlideIndex));
                    return [4 /*yield*/, getActiveImageSrc(page, carouselId)];
                case 14:
                    initialImageSrc = _c.sent();
                    console.log('Initial slide image src:', initialImageSrc);
                    return [4 /*yield*/, getCarouselMetrics(page, carouselId)];
                case 15:
                    initialMetrics = _c.sent();
                    console.log('Initial carousel metrics:', initialMetrics);
                    // Take a screenshot before toggle
                    return [4 /*yield*/, testCarousel.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'carousels', 'carousel-before-toggle.png')
                        })];
                case 16:
                    // Take a screenshot before toggle
                    _c.sent();
                    // 1. First verify arrows work by checking image changes, not just index
                    // Click next arrow
                    return [4 /*yield*/, nextButton.click()];
                case 17:
                    // 1. First verify arrows work by checking image changes, not just index
                    // Click next arrow
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 18:
                    _c.sent();
                    return [4 /*yield*/, getActiveImageSrc(page, carouselId)];
                case 19:
                    afterNextClickSrc = _c.sent();
                    console.log('Image src after next click:', afterNextClickSrc);
                    return [4 /*yield*/, getActiveSlideIndex(page, carouselId)];
                case 20:
                    afterNextClickIndex = _c.sent();
                    console.log("Slide index after next click: ".concat(afterNextClickIndex));
                    // Take screenshot after clicking next
                    return [4 /*yield*/, testCarousel.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'carousels', 'carousel-after-next.png')
                        })];
                case 21:
                    // Take screenshot after clicking next
                    _c.sent();
                    indexChanged = afterNextClickIndex !== initialActiveSlideIndex;
                    imageChanged = afterNextClickSrc !== initialImageSrc;
                    (0, test_1.expect)(indexChanged || imageChanged, 'Either slide index or image should change when clicking next').toBeTruthy();
                    // Return to original slide
                    return [4 /*yield*/, prevButton.click()];
                case 22:
                    // Return to original slide
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 23:
                    _c.sent();
                    return [4 /*yield*/, getActiveImageSrc(page, carouselId)];
                case 24:
                    afterPrevClickSrc = _c.sent();
                    console.log('Image src after prev click:', afterPrevClickSrc);
                    // Take screenshot after clicking prev
                    return [4 /*yield*/, testCarousel.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'carousels', 'carousel-after-prev.png')
                        })];
                case 25:
                    // Take screenshot after clicking prev
                    _c.sent();
                    // Verify the content changed back (either same as initial or different from "next" state)
                    (0, test_1.expect)(afterPrevClickSrc !== afterNextClickSrc || afterPrevClickSrc === initialImageSrc, 'Image should change back to original or at least different from next state').toBeTruthy();
                    sidebarCollapseButton = page.locator('button.collapseSidebarButton_PEFL, button[aria-label="Collapse sidebar"], button[title="Collapse sidebar"]').first();
                    return [4 /*yield*/, sidebarCollapseButton.isVisible()];
                case 26:
                    collapseButtonExists = _c.sent();
                    if (!!collapseButtonExists) return [3 /*break*/, 31];
                    console.log('Sidebar collapse button not found, skipping collapse test');
                    // Just for visual verification, resize to cause reflow
                    return [4 /*yield*/, page.setViewportSize({ width: 1200, height: 900 })];
                case 27:
                    // Just for visual verification, resize to cause reflow
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 28:
                    _c.sent();
                    return [4 /*yield*/, page.setViewportSize({ width: 1000, height: 900 })];
                case 29:
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 30:
                    _c.sent();
                    return [3 /*break*/, 34];
                case 31:
                    // Click the sidebar collapse button
                    console.log('Found sidebar collapse button, clicking it');
                    return [4 /*yield*/, sidebarCollapseButton.click()];
                case 32:
                    _c.sent();
                    console.log('Clicked sidebar collapse button');
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 33:
                    _c.sent(); // Wait for animation
                    _c.label = 34;
                case 34: return [4 /*yield*/, getCarouselMetrics(page, carouselId)];
                case 35:
                    afterToggleMetrics = _c.sent();
                    console.log('After sidebar toggle metrics:', afterToggleMetrics);
                    // Take a screenshot after toggle
                    return [4 /*yield*/, testCarousel.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'carousels', 'carousel-after-toggle.png')
                        })];
                case 36:
                    // Take a screenshot after toggle
                    _c.sent();
                    return [4 /*yield*/, getActiveImageSrc(page, carouselId)];
                case 37:
                    afterToggleImageSrc = _c.sent();
                    console.log('Image src after sidebar toggle:', afterToggleImageSrc);
                    // Verify the carousel maintains reasonable dimensions
                    (0, test_1.expect)(afterToggleMetrics.slideWidth, 'Carousel slide should maintain reasonable width after toggle').toBeGreaterThan(200);
                    (0, test_1.expect)(afterToggleMetrics.visible, 'Carousel should remain visible after toggle').toBeTruthy();
                    // Verify content hasn't changed - comparing with state after clicking prev (should be same as initial)
                    (0, test_1.expect)(afterToggleImageSrc, 'Carousel should show the same content after sidebar toggle').toBe(afterPrevClickSrc);
                    // 4. Verify arrows still work after sidebar toggle
                    return [4 /*yield*/, nextButton.click()];
                case 38:
                    // 4. Verify arrows still work after sidebar toggle
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 39:
                    _c.sent();
                    return [4 /*yield*/, getActiveImageSrc(page, carouselId)];
                case 40:
                    finalNextSrc = _c.sent();
                    console.log('Final image src after next click:', finalNextSrc);
                    // Take a final screenshot
                    return [4 /*yield*/, testCarousel.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'carousels', 'carousel-final.png')
                        })];
                case 41:
                    // Take a final screenshot
                    _c.sent();
                    // Verify content changed after clicking next
                    (0, test_1.expect)(finalNextSrc !== afterToggleImageSrc, 'Arrows should still change content after sidebar toggle').toBeTruthy();
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
/**
 * Helper function to get carousel metrics
 */
function getCarouselMetrics(page, carouselId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, page.evaluate(function (id) {
                    var carousel = document.querySelector("#".concat(id));
                    if (!carousel)
                        return null;
                    // Get track and active slide
                    var track = carousel.querySelector('.splide__track');
                    var activeSlide = carousel.querySelector('.splide__slide.is-active, .splide__slide.is-visible') ||
                        carousel.querySelector('.splide__slide');
                    if (!track || !activeSlide)
                        return { width: 0, height: 0, visible: false };
                    // Get position information
                    var carouselRect = carousel.getBoundingClientRect();
                    var trackRect = track.getBoundingClientRect();
                    var slideRect = activeSlide.getBoundingClientRect();
                    return {
                        carouselWidth: carouselRect.width,
                        carouselHeight: carouselRect.height,
                        trackWidth: trackRect.width,
                        trackHeight: trackRect.height,
                        slideWidth: slideRect.width,
                        slideHeight: slideRect.height,
                        slideLeft: slideRect.left,
                        slideTop: slideRect.top,
                        width: carouselRect.width,
                        height: carouselRect.height,
                        visible: carouselRect.width > 0 && carouselRect.height > 0 &&
                            slideRect.width > 0 && slideRect.height > 0
                    };
                }, carouselId)];
        });
    });
}
