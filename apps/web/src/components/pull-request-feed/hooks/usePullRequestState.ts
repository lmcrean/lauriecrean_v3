import { useState, useCallback } from 'react';
import {
  PullRequestListData,
  DetailedPullRequestData,
  PaginationMeta
} from '@shared/types/pull-requests';

export const usePullRequestState = () => {
  // SSR-safe hydration check
  const [isClient, setIsClient] = useState(false);
  
  // List state
  const [pullRequests, setPullRequests] = useState<PullRequestListData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal state
  const [selectedPR, setSelectedPR] = useState<DetailedPullRequestData | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handlers for list operations
  const handleListSuccess = useCallback((data: PullRequestListData[], paginationData: PaginationMeta) => {
    setPullRequests(data);
    setPagination(paginationData);
    setCurrentPage(paginationData.page);
  }, []);

  const handleListError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  // Handlers for detail operations
  const handleDetailSuccess = useCallback((data: DetailedPullRequestData) => {
    setSelectedPR(data);
    setIsModalOpen(true);
  }, []);

  const handleDetailError = useCallback((errorMessage: string) => {
    setModalError(errorMessage);
    setIsModalOpen(true);
  }, []);

  // Modal management
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPR(null);
    setModalError(null);
    setModalLoading(false);
  }, []);

  // Pagination
  const handlePageChange = useCallback((newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.total_pages) {
      return newPage;
    }
    return null;
  }, [pagination]);

  // Retry function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isClient,
    pullRequests,
    loading,
    error,
    pagination,
    currentPage,
    selectedPR,
    modalLoading,
    modalError,
    isModalOpen,

    // Setters
    setIsClient,
    setLoading,
    setModalLoading,

    // Handlers
    handleListSuccess,
    handleListError,
    handleDetailSuccess,
    handleDetailError,
    handleModalClose,
    handlePageChange,
    clearError
  };
}; 