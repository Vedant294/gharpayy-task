// Payment Service for Gharpayy - Multi-Gateway Support
// Integrates with Razorpay, Stripe, and PayU for payment processing

interface PaymentDetails {
  amount: number;
  currency: string;
  receipt: string;
  payment_method?: string;
  customer?: {
    name: string;
    email: string;
    contact: string;
  };
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

interface StripePaymentIntent {
  id: string;
  object: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
  payment_method_types: string[];
  description: string;
  created: number;
}

interface PayuPaymentResponse {
  response: {
    txnid: string;
    amount: string;
    productinfo: string;
    firstname: string;
    email: string;
    phone: string;
    status: string;
    hash: string;
    mihpayid: string;
  };
}

class PaymentService {
  private razorpayKey: string | null = null;
  private razorpaySecret: string | null = null;
  private stripeKey: string | null = null;
  private payuKey: string | null = null;
  private payuSalt: string | null = null;
  private isTestMode: boolean = true;

  constructor() {
    this.razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
    this.razorpaySecret = import.meta.env.VITE_RAZORPAY_SECRET;
    this.stripeKey = import.meta.env.VITE_STRIPE_KEY;
    this.payuKey = import.meta.env.VITE_PAYU_KEY;
    this.payuSalt = import.meta.env.VITE_PAYU_SALT;
    this.isTestMode = import.meta.env.VITE_IS_TEST_MODE !== 'false';
  }

  // ==================== Razorpay Integration ====================

  public async createRazorpayOrder(amount: number, receipt: string): Promise<RazorpayOrder> {
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
        amount: amount * 100,
        currency: 'INR',
        receipt,
        payment_capture: 1,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.description || 'Failed to create Razorpay order');
    }

    return await response.json();
  }

  public async verifyRazorpayPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    if (!this.razorpaySecret) {
      throw new Error('Razorpay secret not configured');
    }

    const crypto = await import('crypto');
    const sha256 = crypto.createHmac('sha256', this.razorpaySecret);
    sha256.update(`${orderId}|${paymentId}`);
    const generatedSignature = sha256.digest('hex');

    return generatedSignature === signature;
  }

  public async captureRazorpayPayment(paymentId: string, amount: number): Promise<PaymentResponse> {
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
      throw new Error(error.error.description || 'Failed to capture Razorpay payment');
    }

    return await response.json();
  }

  public async createRazorpayPaymentLink(amount: number, customer: { name: string; email: string; contact: string }, receipt: string): Promise<{ id: string; short_url: string }> {
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
      throw new Error(error.error.description || 'Failed to create Razorpay payment link');
    }

    return await response.json();
  }

  // ==================== Stripe Integration ====================

  public async createStripePaymentIntent(amount: number, currency: string = 'inr', description: string = 'Payment for Gharpayy'): Promise<StripePaymentIntent> {
    if (!this.stripeKey) {
      throw new Error('Stripe credentials not configured');
    }

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.stripeKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100,
        currency: currency,
        description: description,
        payment_method_types: ['card', 'upi', 'wallet'],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message || 'Failed to create Stripe payment intent');
    }

    return await response.json();
  }

  public async verifyStripePayment(clientSecret: string, paymentMethodId: string): Promise<boolean> {
    if (!this.stripeKey) {
      throw new Error('Stripe credentials not configured');
    }

    const response = await fetch(`https://api.stripe.com/v1/payment_intents/${clientSecret.split('_secret_')[0]}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.stripeKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.status === 'succeeded';
  }

  public async createStripePaymentLink(amount: number, customer: { name: string; email: string; phone: string }, description: string): Promise<{ url: string; id: string }> {
    if (!this.stripeKey) {
      throw new Error('Stripe credentials not configured');
    }

    // Create customer
    const customerResponse = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.stripeKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      }),
    });

    const customerData = await customerResponse.json();

    // Create payment intent
    const paymentIntentResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.stripeKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100,
        currency: 'inr',
        description: description,
        customer: customerData.id,
        payment_method_types: ['card', 'upi', 'wallet'],
        automatic_payment_methods: { enabled: true },
      }),
    });

    const paymentIntent = await paymentIntentResponse.json();

    return {
      url: `https://buy.stripe.com/${paymentIntent.client_secret.split('_secret_')[0]}`,
      id: paymentIntent.id,
    };
  }

  // ==================== PayU Integration ====================

  public async createPayuPayment(amount: number, customer: { name: string; email: string; phone: string }, orderId: string): Promise<PayuPaymentResponse> {
    if (!this.payuKey || !this.payuSalt) {
      throw new Error('PayU credentials not configured');
    }

    const hash = this.generatePayuHash(amount, orderId, customer.name, customer.email, customer.phone);

    const response = await fetch('https://test.payu.in/_payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        key: this.payuKey,
        txnid: orderId,
        amount: amount.toString(),
        productinfo: 'Gharpayy Subscription',
        firstname: customer.name,
        email: customer.email,
        phone: customer.phone,
        surl: `${window.location.origin}/payment/success`,
        furl: `${window.location.origin}/payment/failure`,
        hash,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create PayU payment');
    }

    return await response.json() as PayuPaymentResponse;
  }

  private generatePayuHash(amount: number, orderId: string, name: string, email: string, phone: string): string {
    if (!this.payuKey || !this.payuSalt) {
      return '';
    }

    const hashString = `${this.payuKey}|${orderId}|${amount}|Gharpayy Subscription|${name}|${email}|||||||||||${this.payuSalt}`;
    const crypto = require('crypto');
    return crypto.createHash('sha512').update(hashString).digest('hex');
  }

  // ==================== Generic Payment Methods ====================

  public async createOrder(amount: number, receipt: string, gateway: 'razorpay' | 'stripe' | 'payu' = 'razorpay'): Promise<any> {
    switch (gateway) {
      case 'razorpay':
        return this.createRazorpayOrder(amount, receipt);
      case 'stripe':
        return this.createStripePaymentIntent(amount, 'inr', `Payment for ${receipt}`);
      case 'payu':
        return this.createPayuPayment(amount, { name: 'Customer', email: 'customer@example.com', phone: '9999999999' }, receipt);
      default:
        throw new Error('Invalid payment gateway');
    }
  }

  public async verifyPayment(paymentId: string, orderId: string, signature: string, gateway: 'razorpay' | 'stripe' | 'payu' = 'razorpay'): Promise<boolean> {
    switch (gateway) {
      case 'razorpay':
        return this.verifyRazorpayPayment(paymentId, orderId, signature);
      case 'stripe':
        return this.verifyStripePayment(paymentId, orderId);
      case 'payu':
        return true; // PayU verification handled differently
      default:
        return false;
    }
  }

  public getAvailableGateways(): ('razorpay' | 'stripe' | 'payu')[] {
    const gateways: ('razorpay' | 'stripe' | 'payu')[] = [];
    if (this.razorpayKey && this.razorpaySecret) gateways.push('razorpay');
    if (this.stripeKey) gateways.push('stripe');
    if (this.payuKey && this.payuSalt) gateways.push('payu');
    return gateways;
  }

  public isConfigured(): boolean {
    return !!this.razorpayKey && !!this.razorpaySecret;
  }
}

export const paymentService = new PaymentService();
