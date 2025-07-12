"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TOC;
var react_1 = require("react");
var CustomTOC_1 = require("@site/src/components/CustomTOC");
/**
 * Custom TOC Theme Component
 *
 * This overrides Docusaurus's default TOC behavior
 */
function TOC() {
    // Always use our custom TOC
    return <CustomTOC_1.default />;
}
