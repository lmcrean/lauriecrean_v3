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
 * Visual verification test for sidebar toggle effect on carousels
 */
test_1.test.describe('Sidebar Toggle Visual Verification', function () {
    (0, test_1.test)('should capture and verify carousel states during sidebar toggle', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var carouselSelector, carouselExists, nextButton, prevButton, nextExists, prevExists, sidebarCollapseButton, collapseButtonExists, sidebarExpandButton, expandButtonExists;
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
                    return [4 /*yield*/, page.waitForTimeout(2000)];
                case 3:
                    _c.sent();
                    carouselSelector = '#coachmatrix-carousel';
                    return [4 /*yield*/, page.locator(carouselSelector).isVisible()];
                case 4:
                    carouselExists = _c.sent();
                    if (!carouselExists) {
                        console.log('Coachmatrix carousel not found, skipping test');
                        return [2 /*return*/];
                    }
                    console.log('Coachmatrix carousel found, proceeding with test');
                    nextButton = page.locator("".concat(carouselSelector, " .splide__arrow--next"));
                    prevButton = page.locator("".concat(carouselSelector, " .splide__arrow--prev"));
                    return [4 /*yield*/, nextButton.isVisible()];
                case 5:
                    nextExists = _c.sent();
                    return [4 /*yield*/, prevButton.isVisible()];
                case 6:
                    prevExists = _c.sent();
                    if (!nextExists || !prevExists) {
                        console.log('Carousel arrows not found, skipping test');
                        return [2 /*return*/];
                    }
                    console.log('Carousel arrows found, proceeding with test');
                    // Take a screenshot of the initial state
                    return [4 /*yield*/, page.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'visual-regression', 'full-page-initial.png')
                        })];
                case 7:
                    // Take a screenshot of the initial state
                    _c.sent();
                    return [4 /*yield*/, page.locator(carouselSelector).screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'visual-regression', 'carousel-initial.png')
                        })];
                case 8:
                    _c.sent();
                    console.log('Initial screenshots captured');
                    // 1. First verify normal carousel navigation
                    // Click on next arrow to verify normal carousel functionality
                    return [4 /*yield*/, nextButton.click()];
                case 9:
                    // 1. First verify normal carousel navigation
                    // Click on next arrow to verify normal carousel functionality
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, page.locator(carouselSelector).screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'visual-regression', 'next-click.png')
                        })];
                case 11:
                    _c.sent();
                    console.log('Arrow click screenshot captured');
                    // Return to original slide
                    return [4 /*yield*/, prevButton.click()];
                case 12:
                    // Return to original slide
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 13:
                    _c.sent();
                    return [4 /*yield*/, page.locator(carouselSelector).screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'visual-regression', 'prev-click.png')
                        })];
                case 14:
                    _c.sent();
                    console.log('Return to original slide screenshot captured');
                    sidebarCollapseButton = page.locator('button.collapseSidebarButton_PEFL, button[aria-label="Collapse sidebar"], button[title="Collapse sidebar"]').first();
                    return [4 /*yield*/, sidebarCollapseButton.isVisible()];
                case 15:
                    collapseButtonExists = _c.sent();
                    if (!collapseButtonExists) {
                        console.log('Sidebar collapse button not found, skipping collapse test');
                        return [2 /*return*/];
                    }
                    console.log('Sidebar collapse button found, proceeding with collapse test');
                    // Collapse the sidebar
                    return [4 /*yield*/, sidebarCollapseButton.click()];
                case 16:
                    // Collapse the sidebar
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(1000)];
                case 17:
                    _c.sent(); // Wait for animation to complete
                    // Take screenshots after sidebar collapse
                    return [4 /*yield*/, page.screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'visual-regression', 'full-page-after-collapse.png')
                        })];
                case 18:
                    // Take screenshots after sidebar collapse
                    _c.sent();
                    return [4 /*yield*/, page.locator(carouselSelector).screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'visual-regression', 'carousel-after-collapse.png')
                        })];
                case 19:
                    _c.sent();
                    console.log('After sidebar collapse screenshots captured');
                    // 3. Verify carousel functionality still works after sidebar collapse
                    // Click next arrow again after sidebar toggle
                    return [4 /*yield*/, nextButton.click()];
                case 20:
                    // 3. Verify carousel functionality still works after sidebar collapse
                    // Click next arrow again after sidebar toggle
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 21:
                    _c.sent();
                    return [4 /*yield*/, page.locator(carouselSelector).screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'visual-regression', 'next-after-collapse.png')
                        })];
                case 22:
                    _c.sent();
                    console.log('Next arrow after collapse screenshot captured');
                    // Click prev arrow to return to original slide
                    return [4 /*yield*/, prevButton.click()];
                case 23:
                    // Click prev arrow to return to original slide
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 24:
                    _c.sent();
                    return [4 /*yield*/, page.locator(carouselSelector).screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'visual-regression', 'prev-after-collapse.png')
                        })];
                case 25:
                    _c.sent();
                    console.log('Prev arrow after collapse screenshot captured');
                    sidebarExpandButton = page.locator('button[aria-label="Expand sidebar"], button[title="Expand sidebar"], button.expandSidebarButton').first();
                    return [4 /*yield*/, sidebarExpandButton.isVisible()];
                case 26:
                    expandButtonExists = _c.sent();
                    if (!!expandButtonExists) return [3 /*break*/, 30];
                    console.log('Sidebar expand button not found, skipping expand test');
                    if (!collapseButtonExists) return [3 /*break*/, 29];
                    return [4 /*yield*/, sidebarCollapseButton.click()];
                case 27:
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(1000)];
                case 28:
                    _c.sent();
                    _c.label = 29;
                case 29: return [3 /*break*/, 33];
                case 30: 
                // Expand the sidebar
                return [4 /*yield*/, sidebarExpandButton.click()];
                case 31:
                    // Expand the sidebar
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(1000)];
                case 32:
                    _c.sent(); // Wait for animation to complete
                    _c.label = 33;
                case 33: 
                // Take screenshots after sidebar expand
                return [4 /*yield*/, page.screenshot({
                        path: path_1.default.join('tests-e2e', 'screenshots', 'visual-regression', 'full-page-after-expand.png')
                    })];
                case 34:
                    // Take screenshots after sidebar expand
                    _c.sent();
                    return [4 /*yield*/, page.locator(carouselSelector).screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'visual-regression', 'carousel-after-expand.png')
                        })];
                case 35:
                    _c.sent();
                    console.log('After sidebar expand screenshots captured');
                    // 5. Final test - click next arrow after expand to verify everything still works
                    return [4 /*yield*/, nextButton.click()];
                case 36:
                    // 5. Final test - click next arrow after expand to verify everything still works
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 37:
                    _c.sent();
                    return [4 /*yield*/, page.locator(carouselSelector).screenshot({
                            path: path_1.default.join('tests-e2e', 'screenshots', 'visual-regression', 'next-after-expand.png')
                        })];
                case 38:
                    _c.sent();
                    console.log('Final screenshot captured');
                    // Test complete - these screenshots can be examined visually to confirm
                    // if the carousel maintained its visual integrity through the sidebar toggle
                    console.log('Test complete, all screenshots captured for visual verification');
                    return [2 /*return*/];
            }
        });
    }); });
});
