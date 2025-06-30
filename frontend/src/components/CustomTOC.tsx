import React, { useState, useEffect } from 'react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

const tocItems: TOCItem[] = [
  { id: 'dottie', title: 'Dottie', level: 2 },
  { id: 'odyssey', title: 'Odyssey', level: 2 },
  { id: 'coach-matrix', title: 'Coach Matrix', level: 2 },
  { id: 'steam-report', title: 'Steam Report', level: 2 },
  { id: 'laurie-crean', title: 'Laurie Crean', level: 2 },
  { id: 'hoverboard', title: 'Hoverboard', level: 2 },
  { id: 'crocodile-kingdom', title: 'Crocodile Kingdom', level: 2 },
  { id: 'retrolympic-rush', title: 'Retrolympic Rush', level: 2 },
  { id: 'wealth-quest', title: 'Wealth Quest', level: 2 },
];

/**
 * Custom Table of Contents Component
 * 
 * Provides navigation for all projects including those using TypewriterTitle components
 */
const CustomTOC: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('');

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - 40; // 40px offset to ensure heading is visible
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveItem(id);
    }
  };

  // Track which section is currently in view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveItem(entry.target.id);
        }
      });
    }, observerOptions);

    // Function to observe elements, with retry for TypewriterTitle components
    const observeElements = () => {
      tocItems.forEach(item => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.observe(element);
        }
      });
    };

    // Initial observation
    observeElements();

    // Retry after a delay to catch TypewriterTitle components that render later
    const retryTimeout = setTimeout(observeElements, 1000);
    const retryTimeout2 = setTimeout(observeElements, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(retryTimeout);
      clearTimeout(retryTimeout2);
    };
  }, []);

  return (
    <div className="table-of-contents">
      <div className="table-of-contents__title">On this page</div>
      <ul className="table-of-contents__list">
        {tocItems.map((item) => (
          <li key={item.id} className="table-of-contents__item">
            <a
              href={`#${item.id}`}
              className={`table-of-contents__link ${
                activeItem === item.id ? 'table-of-contents__link--active' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                scrollToElement(item.id);
              }}
              data-level={item.level}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomTOC; 