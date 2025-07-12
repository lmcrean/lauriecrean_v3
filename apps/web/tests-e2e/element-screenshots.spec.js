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
(0, test_1.test)('capture element screenshots', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var sidebarElement, boundingBox;
    var page = _b.page;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: 
            // Navigate to the projects page
            return [4 /*yield*/, page.goto('http://localhost:3000/projects')];
            case 1:
                // Navigate to the projects page
                _c.sent();
                return [4 /*yield*/, page.waitForLoadState('networkidle')];
            case 2:
                _c.sent();
                // Wait for key elements to be visible
                return [4 /*yield*/, page.waitForSelector('.theme-doc-sidebar-container')];
            case 3:
                // Wait for key elements to be visible
                _c.sent();
                return [4 /*yield*/, page.waitForSelector('.table-of-contents')];
            case 4:
                _c.sent();
                return [4 /*yield*/, page.waitForSelector('h1')];
            case 5:
                _c.sent();
                return [4 /*yield*/, page.locator('.theme-doc-sidebar-container')];
            case 6:
                sidebarElement = _c.sent();
                return [4 /*yield*/, sidebarElement.boundingBox()];
            case 7:
                boundingBox = _c.sent();
                // Take a screenshot of the viewport around the sidebar
                return [4 /*yield*/, page.screenshot({
                        path: path_1.default.join('tests-e2e', 'screenshots', 'components', 'sidebar-element.png'),
                        clip: {
                            x: boundingBox.x,
                            y: boundingBox.y,
                            width: boundingBox.width,
                            height: Math.min(boundingBox.height, 600) // Limit height to 600px
                        }
                    })];
            case 8:
                // Take a screenshot of the viewport around the sidebar
                _c.sent();
                // Capture right sidebar (table of contents)
                return [4 /*yield*/, page.locator('.table-of-contents').screenshot({
                        path: path_1.default.join('tests-e2e', 'screenshots', 'components', 'toc-element.png')
                    })];
            case 9:
                // Capture right sidebar (table of contents)
                _c.sent();
                // Capture h1 element
                return [4 /*yield*/, page.locator('h1').first().screenshot({
                        path: path_1.default.join('tests-e2e', 'screenshots', 'elements', 'h1-element.png')
                    })];
            case 10:
                // Capture h1 element
                _c.sent();
                // Capture first paragraph
                return [4 /*yield*/, page.locator('p').first().screenshot({
                        path: path_1.default.join('tests-e2e', 'screenshots', 'elements', 'p-element.png')
                    })];
            case 11:
                // Capture first paragraph
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
// Capture the Odyssey project section with minimum height of 700px
(0, test_1.test)('capture project screenshot element', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var odysseyHeading, headingBox, finalHeadingBox, odysseySection, boundingBox, captureHeight;
    var page = _b.page;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: 
            // Navigate to the projects page
            return [4 /*yield*/, page.goto('http://localhost:3000/projects')];
            case 1:
                // Navigate to the projects page
                _c.sent();
                return [4 /*yield*/, page.waitForLoadState('networkidle')];
            case 2:
                _c.sent();
                return [4 /*yield*/, page.waitForSelector('h2:has-text("Odyssey")', { timeout: 60000 })];
            case 3:
                odysseyHeading = _c.sent();
                // Scroll the Odyssey heading to the top of the viewport
                return [4 /*yield*/, odysseyHeading.scrollIntoViewIfNeeded()];
            case 4:
                // Scroll the Odyssey heading to the top of the viewport
                _c.sent();
                return [4 /*yield*/, odysseyHeading.boundingBox()];
            case 5:
                headingBox = _c.sent();
                return [4 /*yield*/, page.evaluate(function (y) { return window.scrollTo(0, y); }, headingBox.y)];
            case 6:
                _c.sent();
                return [4 /*yield*/, odysseyHeading.boundingBox()];
            case 7:
                finalHeadingBox = _c.sent();
                // Small pause to ensure scrolling is complete
                return [4 /*yield*/, page.waitForTimeout(500)];
            case 8:
                // Small pause to ensure scrolling is complete
                _c.sent();
                return [4 /*yield*/, page.$('h2:has-text("Odyssey")').then(function (h2) {
                        return h2.evaluateHandle(function (node) {
                            // Find the closest div with the screenshot-project-element class
                            var current = node;
                            while (current && current.parentElement) {
                                if (current.classList && current.classList.contains('screenshot-project-element')) {
                                    return current;
                                }
                                // If we can't find the specific class, go up to the parent div
                                if (current.tagName === 'DIV') {
                                    return current;
                                }
                                current = current.parentElement;
                            }
                            return node.closest('div');
                        });
                    })];
            case 9:
                odysseySection = _c.sent();
                return [4 /*yield*/, odysseySection.boundingBox()];
            case 10:
                boundingBox = _c.sent();
                captureHeight = 1400;
                // Take screenshot starting from the heading position
                return [4 /*yield*/, page.screenshot({
                        path: path_1.default.join('tests-e2e', 'screenshots', 'components', 'project-section.png'),
                        clip: {
                            x: boundingBox.x,
                            y: finalHeadingBox.y, // Start exactly at the heading position
                            width: boundingBox.width,
                            height: captureHeight // Ensure at least 700px height from the heading
                        }
                    })];
            case 11:
                // Take screenshot starting from the heading position
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
// Capture the navbar with icons
(0, test_1.test)('capture navbar screenshot element', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var navbar, boundingBox;
    var page = _b.page;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: 
            // Navigate to the projects page
            return [4 /*yield*/, page.goto('http://localhost:3000/projects')];
            case 1:
                // Navigate to the projects page
                _c.sent();
                return [4 /*yield*/, page.waitForLoadState('networkidle')];
            case 2:
                _c.sent();
                return [4 /*yield*/, page.waitForSelector('.navbar', { timeout: 60000 })];
            case 3:
                navbar = _c.sent();
                // Ensure the navbar is fully visible
                return [4 /*yield*/, navbar.scrollIntoViewIfNeeded()];
            case 4:
                // Ensure the navbar is fully visible
                _c.sent();
                // Small pause to ensure any animations are complete
                return [4 /*yield*/, page.waitForTimeout(500)];
            case 5:
                // Small pause to ensure any animations are complete
                _c.sent();
                return [4 /*yield*/, navbar.boundingBox()];
            case 6:
                boundingBox = _c.sent();
                // Take screenshot of the navbar
                return [4 /*yield*/, page.screenshot({
                        path: path_1.default.join('tests-e2e', 'screenshots', 'components', 'navbar.png'),
                        clip: {
                            x: boundingBox.x,
                            y: boundingBox.y,
                            width: boundingBox.width,
                            height: boundingBox.height
                        }
                    })];
            case 7:
                // Take screenshot of the navbar
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
