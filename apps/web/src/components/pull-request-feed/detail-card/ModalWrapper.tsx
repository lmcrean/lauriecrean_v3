import React, { useEffect } from 'react';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabelledBy?: string;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  children,
  ariaLabelledBy = "modal-title"
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const backdropClasses = "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center";
  const containerClasses = "w-full max-w-full sm:max-w-2xl bg-white dark:bg-gray-800 rounded-t-lg sm:rounded-lg shadow-xl transform transition-all duration-300 ease-out max-h-full overflow-hidden";

  return (
    <div 
      className={backdropClasses}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      data-testid="pull-request-modal"
    >
      <div 
        className={containerClasses} 
        onClick={(e) => e.stopPropagation()} 
        data-testid="pull-request-detail"
      >
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper; 