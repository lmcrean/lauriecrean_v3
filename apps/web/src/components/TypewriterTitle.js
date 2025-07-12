"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
/**
 * TypewriterTitle Component
 *
 * Renders a heading with typewriter effect and fade-in animation when it scrolls into view
 *
 * @param {TypewriterTitleProps} props - Component props
 * @param {string} props.text - The text to display with typewriter effect
 * @param {string} props.level - Heading level (h1, h2, h3, etc.)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.id - ID for the heading element (for anchor links)
 * @param {number} props.delay - Delay before starting animation (in ms)
 * @param {number} props.speed - Speed of typewriter effect (characters per interval)
 * @returns {JSX.Element} The rendered typewriter title
 */
var TypewriterTitle = function (_a) {
    var text = _a.text, _b = _a.level, level = _b === void 0 ? 'h2' : _b, _c = _a.className, className = _c === void 0 ? '' : _c, id = _a.id, _d = _a.delay, delay = _d === void 0 ? 300 : _d, _e = _a.speed, speed = _e === void 0 ? 100 : _e;
    var elementRef = (0, react_1.useRef)(null);
    var _f = (0, react_1.useState)(false), isVisible = _f[0], setIsVisible = _f[1];
    var _g = (0, react_1.useState)(''), displayText = _g[0], setDisplayText = _g[1];
    var _h = (0, react_1.useState)(0), currentIndex = _h[0], setCurrentIndex = _h[1];
    var _j = (0, react_1.useState)(false), hasStarted = _j[0], setHasStarted = _j[1];
    // Create the heading element
    var HeadingTag = level;
    (0, react_1.useEffect)(function () {
        var observer = new IntersectionObserver(function (_a) {
            var entry = _a[0];
            if (entry.isIntersecting && !hasStarted) {
                setIsVisible(true);
                // Start typewriter effect after delay
                setTimeout(function () {
                    setHasStarted(true);
                }, delay);
            }
        }, {
            threshold: 0.1, // Trigger when 10% of the element is visible
            rootMargin: '-50px 0px' // Start animation slightly before element is fully visible
        });
        if (elementRef.current) {
            observer.observe(elementRef.current);
        }
        return function () {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [delay, hasStarted]);
    (0, react_1.useEffect)(function () {
        if (hasStarted && currentIndex < text.length) {
            var timeout_1 = setTimeout(function () {
                setDisplayText(text.slice(0, currentIndex + 1));
                setCurrentIndex(currentIndex + 1);
            }, speed);
            return function () { return clearTimeout(timeout_1); };
        }
    }, [hasStarted, currentIndex, text, speed]);
    return (<HeadingTag ref={elementRef} id={id} className={"typewriter-title ".concat(isVisible ? 'fade-in' : '', " ").concat(className)} data-full-text={text}>
      {displayText}
      {hasStarted && currentIndex < text.length && (<span className="typewriter-cursor"></span>)}
    </HeadingTag>);
};
exports.default = TypewriterTitle;
