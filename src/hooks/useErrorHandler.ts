import { useCallback } from 'react';
import { errorLogger } from '@/lib/errorLogger';
import { toast } from 'sonner';

interface UseErrorHandler {
  handle: (error: unknown, context?: Record<string, unknown>) => void;
  handleApiError: (error: Error, context?: Record<string, unknown>) => void;
  handleNetworkError: (error: Error) => void;
}

export const useErrorHandler = (): UseErrorHandler => {
  const handle = useCallback((error: unknown, context?: Record<string, unknown>) => {
    if (error instanceof Error) {
      errorLogger.log(error, context);
      toast.error(error.message || 'An error occurred');
    } else if (typeof error === 'string') {
      errorLogger.log(new Error(error), context);
      toast.error(error);
    } else {
      errorLogger.log(new Error('Unknown error'), context);
      toast.error('An unexpected error occurred');
    }
  }, []);

  const handleApiError = useCallback((error: Error, context?: Record<string, unknown>) => {
    errorLogger.log(error, context);
    
    if (error.message.includes('401') || error.message.includes('403')) {
      toast.error('Please log in again');
    } else if (error.message.includes('404')) {
      toast.error('Resource not found');
    } else if (error.message.includes('500')) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(error.message || 'API error occurred');
    }
  }, []);

  const handleNetworkError = useCallback((error: Error) => {
    errorLogger.log(error, { type: 'network' });
    toast.error('No internet connection. Please check your connection.');
  }, []);

  return {
    handle,
    handleApiError,
    handleNetworkError,
  };
};
