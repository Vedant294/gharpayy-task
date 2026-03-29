import { useState } from 'react';
import { paymentService } from '@/lib/paymentService';
import { errorLogger } from '@/lib/errorLogger';
import { toast } from 'sonner';

interface PaymentState {
  isProcessing: boolean;
  paymentId: string | null;
  orderId: string | null;
  amount: number;
  currency: string;
}

interface UsePayment {
  state: PaymentState;
  createPayment: (amount: number, receipt: string) => Promise<void>;
  verifyPayment: (paymentId: string, orderId: string, signature: string) => Promise<boolean>;
  capturePayment: (paymentId: string, amount: number) => Promise<void>;
  createPaymentLink: (amount: number, customer: { name: string; email: string; contact: string }, receipt: string) => Promise<{ id: string; short_url: string }>;
  reset: () => void;
}

export const usePayment = (): UsePayment => {
  const [state, setState] = useState<PaymentState>({
    isProcessing: false,
    paymentId: null,
    orderId: null,
    amount: 0,
    currency: 'INR',
  });

  const createPayment = async (amount: number, receipt: string) => {
    try {
      setState(prev => ({ ...prev, isProcessing: true }));
      
      const order = await paymentService.createOrder(amount, receipt);
      
      setState({
        isProcessing: false,
        paymentId: null,
        orderId: order.id,
        amount: order.amount / 100,
        currency: order.currency,
      });

      // Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: 'Gharpayy',
        description: 'PG Booking Payment',
        order_id: order.id,
        handler: async (response: any) => {
          // Payment successful
          const success = await verifyPayment(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
          if (success) {
            toast.success('Payment verified successfully');
          } else {
            toast.error('Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            setState(prev => ({ ...prev, isProcessing: false }));
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      errorLogger.log(error, { context: 'createPayment' });
      toast.error(error.message || 'Failed to create payment');
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const verifyPayment = async (paymentId: string, orderId: string, signature: string): Promise<boolean> => {
    try {
      const isVerified = await paymentService.verifyPayment(paymentId, orderId, signature);
      if (isVerified) {
        toast.success('Payment verified');
      } else {
        toast.error('Invalid payment signature');
      }
      return isVerified;
    } catch (error: any) {
      errorLogger.log(error, { context: 'verifyPayment' });
      toast.error('Payment verification failed');
      return false;
    }
  };

  const capturePayment = async (paymentId: string, amount: number) => {
    try {
      setState(prev => ({ ...prev, isProcessing: true }));
      await paymentService.capturePayment(paymentId, amount);
      toast.success('Payment captured');
    } catch (error: any) {
      errorLogger.log(error, { context: 'capturePayment' });
      toast.error('Failed to capture payment');
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const createPaymentLink = async (amount: number, customer: { name: string; email: string; contact: string }, receipt: string) => {
    try {
      setState(prev => ({ ...prev, isProcessing: true }));
      const link = await paymentService.createPaymentLink(amount, customer, receipt);
      return link;
    } catch (error: any) {
      errorLogger.log(error, { context: 'createPaymentLink' });
      toast.error('Failed to create payment link');
      throw error;
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const reset = () => {
    setState({
      isProcessing: false,
      paymentId: null,
      orderId: null,
      amount: 0,
      currency: 'INR',
    });
  };

  return {
    state,
    createPayment,
    verifyPayment,
    capturePayment,
    createPaymentLink,
    reset,
  };
};
