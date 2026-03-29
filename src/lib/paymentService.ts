// Payment Service for Gharpayy
// Integrates with Razorpay for payment processing

interface PaymentDetails {
  amount: number;
  currency: string;
  receipt: string;
  payment_method?: string;
}

interface PaymentResponse {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  invoice_id: string;
  international: boolean;
  method: string;
  description: string;
  nonce: boolean;
  created_at: number;
}

interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

class PaymentService {
  private razorpayKey: string | null = null;
  private razorpaySecret: string | null = null;
  private isTestMode: boolean = true;

  constructor() {
    this.razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
    this.razorpaySecret = import.meta.env.VITE_RAZORPAY_SECRET;
    this.isTestMode = import.meta.env.VITE_IS_TEST_MODE !== 'false';
  }

  public async createOrder(amount: number, receipt: string): Promise<RazorpayOrder> {
    if (!this.razorpayKey || !this.razorpaySecret) {
      throw new Error('Razorpay credentials not configured');
    }

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.razorpayKey}:${this.razorpaySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt,
        payment_capture: 1,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.description || 'Failed to create order');
    }

    return await response.json();
  }

  public async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    if (!this.razorpaySecret) {
      throw new Error('Razorpay secret not configured');
    }

    const crypto = await import('crypto');
    const sha256 = crypto.createHmac('sha256', this.razorpaySecret);
    sha256.update(`${orderId}|${paymentId}`);
    const generatedSignature = sha256.digest('hex');

    return generatedSignature === signature;
  }

  public async capturePayment(paymentId: string, amount: number): Promise<PaymentResponse> {
    if (!this.razorpayKey || !this.razorpaySecret) {
      throw new Error('Razorpay credentials not configured');
    }

    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.razorpayKey}:${this.razorpaySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.description || 'Failed to capture payment');
    }

    return await response.json();
  }

  public async createPaymentLink(amount: number, customer: { name: string; email: string; contact: string }, receipt: string): Promise<{ id: string; short_url: string }> {
    if (!this.razorpayKey || !this.razorpaySecret) {
      throw new Error('Razorpay credentials not configured');
    }

    const response = await fetch('https://api.razorpay.com/v1/payment_links', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.razorpayKey}:${this.razorpaySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100,
        currency: 'INR',
        customer: {
          name: customer.name,
          email: customer.email,
          contact: customer.contact,
        },
        receipt,
        notify: {
          email: true,
          sms: true,
        },
        callback_url: `${window.location.origin}/payment/callback`,
        callback_method: 'get',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.description || 'Failed to create payment link');
    }

    return await response.json();
  }

  public async getPayment(paymentId: string): Promise<PaymentResponse> {
    if (!this.razorpayKey || !this.razorpaySecret) {
      throw new Error('Razorpay credentials not configured');
    }

    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${this.razorpayKey}:${this.razorpaySecret}`)}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.description || 'Failed to get payment');
    }

    return await response.json();
  }

  public async refundPayment(paymentId: string, amount?: number): Promise<{ id: string; amount: number }> {
    if (!this.razorpayKey || !this.razorpaySecret) {
      throw new Error('Razorpay credentials not configured');
    }

    const body: { amount?: number } = {};
    if (amount) {
      body.amount = amount * 100;
    }

    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.razorpayKey}:${this.razorpaySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.description || 'Failed to refund payment');
    }

    return await response.json();
  }

  public getRazorpayScript(): string {
    return 'https://checkout.razorpay.com/v1/checkout.js';
  }

  public isConfigured(): boolean {
    return !!this.razorpayKey && !!this.razorpaySecret;
  }
}

export const paymentService = new PaymentService();
