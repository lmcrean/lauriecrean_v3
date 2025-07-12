// Locked Button Hover Interaction
(function(): void {
  'use strict';
  
  console.log('[locked-button.js] Initializing locked button interactions');
  
  // Function to initialize locked button hover effects
  function initializeLockedButtons(): void {
    // Find all buttons that contain icons with 'locked' class
    const lockedButtons: NodeListOf<Element> = document.querySelectorAll('button i.locked');
    
    if (lockedButtons.length === 0) {
      console.log('[locked-button.js] No locked buttons found');
      return;
    }
    
    console.log(`[locked-button.js] Found ${lockedButtons.length} locked button(s)`);
    
    lockedButtons.forEach(function(icon: Element, index: number): void {
      const button = icon.closest('button') as HTMLButtonElement;
      if (!button) return;
      
      console.log(`[locked-button.js] Setting up hover for locked button #${index}`);
      
      // Store original button content
      const originalContent: string = button.innerHTML;
      
      // Mouse enter event - change to lock icon and text
      button.addEventListener('mouseenter', function(): void {
        // Change to lock icon and text
        button.innerHTML = `<i class="fa-solid fa-lock locked"></i> not currently available`;
        
        console.log(`[locked-button.js] Hover in - changed to lock icon and text`);
      });
      
      // Mouse leave event - change back to original
      button.addEventListener('mouseleave', function(): void {
        button.innerHTML = originalContent;
        console.log(`[locked-button.js] Hover out - restored original content`);
      });
    });
  }
  
  // Initialize when DOM is ready
  function initialize(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeLockedButtons);
    } else {
      initializeLockedButtons();
    }
    
    // Set up mutation observer for dynamically added content
    setupMutationObserver();
  }
  
  // Set up mutation observer to detect when new locked buttons are added
  function setupMutationObserver(): void {
    const observer: MutationObserver = new MutationObserver(function(mutations: MutationRecord[]): void {
      let hasNewLockedButtons: boolean = false;
      
      mutations.forEach(function(mutation: MutationRecord): void {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(function(node: Node): void {
            if (node.nodeType === 1) { // Element node
              const element = node as Element;
              // Check if the node itself or its children contain locked buttons
              if ((element.classList && element.classList.contains('locked')) ||
                  (element.querySelector && element.querySelector('i.locked'))) {
                hasNewLockedButtons = true;
              }
            }
          });
        }
      });
      
      if (hasNewLockedButtons) {
        console.log('[locked-button.js] New locked buttons detected, reinitializing');
        initializeLockedButtons();
      }
    });
    
    // Start observing
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
  
  // Initialize the script
  initialize();
  
})(); 