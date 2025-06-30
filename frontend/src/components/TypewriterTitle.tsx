import React, { useEffect, useRef, useState } from 'react';

interface TypewriterTitleProps {
  text: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  delay?: number;
  speed?: number;
}

/**
 * TypewriterTitle Component
 * 
 * Renders a heading with typewriter effect and fade-in animation when it scrolls into view
 * 
 * @param {TypewriterTitleProps} props - Component props
 * @param {string} props.text - The text to display with typewriter effect
 * @param {string} props.level - Heading level (h1, h2, h3, etc.)
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.delay - Delay before starting animation (in ms)
 * @param {number} props.speed - Speed of typewriter effect (characters per interval)
 * @returns {JSX.Element} The rendered typewriter title
 */
const TypewriterTitle: React.FC<TypewriterTitleProps> = ({ 
  text, 
  level = 'h2', 
  className = '', 
  delay = 300, 
  speed = 100 
}) => {
  const elementRef = useRef<HTMLHeadingElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Create the heading element
  const HeadingTag = level;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting && !hasStarted) {
          setIsVisible(true);
          // Start typewriter effect after delay
          setTimeout(() => {
            setHasStarted(true);
          }, delay);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '-50px 0px' // Start animation slightly before element is fully visible
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, hasStarted]);

  useEffect(() => {
    if (hasStarted && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [hasStarted, currentIndex, text, speed]);

  return (
    <HeadingTag
      ref={elementRef}
      className={`typewriter-title ${isVisible ? 'fade-in' : ''} ${className}`}
      data-full-text={text}
    >
      {displayText}
      {hasStarted && currentIndex < text.length && (
        <span className="typewriter-cursor">|</span>
      )}
    </HeadingTag>
  );
};

export default TypewriterTitle; 