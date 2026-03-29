import AppLayout from '@/components/AppLayout';
import SubscriptionCard from '@/components/SubscriptionCard';
import { SUBSCRIPTION_PLANS, type PlanTier, type BillingCycle } from '@/types/subscription';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserSubscription, useCreateSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  const { data: subscription, isLoading: subscriptionLoading } = useUserSubscription();
  const createSubscription = useCreateSubscription();

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleSubscribe = async () => {
    if (!selectedPlanId) return;

    const { data: session } = await import('@/integrations/supabase/client').then(({ supabase }) => supabase.auth.getSession());
    const userId = session?.data?.session?.user?.id;

    if (!userId) {
      toast.error('Please log in to subscribe');
      navigate('/auth');
      return;
    }

    try {
      const result = await createSubscription.mutateAsync({
        userId,
        planId: selectedPlanId,
        billingCycle,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Subscription created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create subscription');
    }
  };

  const currentPlan = subscription?.data?.tier || 'free';

  return (
    <AppLayout title="Subscription Plans" subtitle="Choose the perfect plan for your business">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-8 w-16 items-center rounded-full bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${billingCycle === 'yearly' ? 'translate-x-9' : 'translate-x-1'}`}
            />
          </button>
          <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Yearly <span className="text-success ml-1 text-xs font-bold">SAVE 20%</span>
          </span>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              selected={selectedPlanId === plan.id}
              billingCycle={billingCycle}
              onSelect={() => handleSelectPlan(plan.id)}
            />
          ))}
        </div>

        {/* Current Plan Info */}
        {currentPlan && currentPlan !== 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Your Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Tier</p>
                    <p className="text-2xl font-display font-bold text-foreground capitalize">{currentPlan}</p>
                  </div>
                  <Button variant="outline" onClick={() => navigate('/settings')}>
                    Manage Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Subscribe Button */}
        {selectedPlanId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <Button
              size="lg"
              className="px-8"
              onClick={handleSubscribe}
              disabled={createSubscription.isPending}
            >
              {createSubscription.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Subscribe Now'
              )}
            </Button>
          </motion.div>
        )}

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Can I upgrade or downgrade my plan?', a: 'Yes, you can upgrade or downgrade your plan at any time. Prorated charges will be applied.' },
              { q: 'What payment methods do you accept?', a: 'We accept credit cards, debit cards, UPI, and net banking through Razorpay, Stripe, and PayU.' },
              { q: 'Is there a free trial?', a: 'Yes, we offer a 14-day free trial on all paid plans. No credit card required.' },
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. You will have access until the end of your billing period.' },
              { q: 'Do you offer custom plans?', a: 'Yes, we offer custom enterprise plans for large organizations. Contact our sales team for more information.' },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SubscriptionPage;
