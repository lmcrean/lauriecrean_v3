import React from 'react';
import { PullRequestFeedDetailCardProps } from '@shared/types/pull-requests';
import ModalWrapper from './ModalWrapper';
import ModalHeader from './ModalHeader';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import MainContent from './MainContent';

export const PullRequestFeedDetailCard: React.FC<PullRequestFeedDetailCardProps> = ({
  pullRequest,
  isOpen,
  onClose,
  loading = false,
  error
}) => {
  // Early return if modal isn't open
  if (!isOpen) return null;

  // Show loading state if data is not yet available
  if (!pullRequest && !loading && !error) {
    return null;
  }

  // Determine content based on state
  const getContent = () => {
    if (loading) {
      return <LoadingState />;
    }
    
    if (error) {
      return <ErrorState error={error} />;
    }
    
    if (!pullRequest) {
      return null;
    }
    
    return <MainContent pullRequest={pullRequest} />;
  };

  return (
    <ModalWrapper 
      isOpen={isOpen} 
      onClose={onClose}
      ariaLabelledBy="pr-modal-title"
    >
      <ModalHeader onClose={onClose} />
      {getContent()}
    </ModalWrapper>
  );
};

export default PullRequestFeedDetailCard; 