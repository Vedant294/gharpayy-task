import AppLayout from '@/components/AppLayout';
import SubscriptionCard from '@/components/SubscriptionCard';
import { SUBSCRIPTION_PLANS, type BillingCycle } from '@/types/subscription';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserSubscription, useCreateSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';
import { Loader2, Check, Star, Zap, Shield, Users } from 'lucide-react';

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

  const features = {
    free: ['50 leads/month', '3 agents', 'Basic analytics', '1 zone'],
    starter: ['500 leads/month', '10 agents', 'Advanced analytics', '5 zones', 'WhatsApp integration', 'Priority support'],
    professional: ['Unlimited leads', '50 agents', 'Full analytics suite', 'Unlimited zones', 'WhatsApp + SMS', 'REST API', 'Custom reporting', 'Dedicated support'],
    enterprise: ['Everything in Professional', 'Unlimited everything', 'White-label solution', 'Custom development', 'SLA guarantees', 'On-premise deployment', 'Training & onboarding'],
  };

  return (
    <AppLayout title="Subscription Plans" subtitle="Choose the perfect plan for your business">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Simple, transparent <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">pricing</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your business. No hidden fees, no surprises. Upgrade or downgrade anytime.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-6">
          <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-8 w-16 items-center rounded-full bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${billingCycle === 'yearly' ? 'translate-x-9' : 'translate-x-1'}`}
            />
          </button>
          <span className="flex items-center gap-2">
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-success/20 to-emerald-500/20 text-success text-xs font-bold">
              SAVE 20%
            </span>
          </span>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${selectedPlanId === plan.id ? 'ring-2 ring-indigo-500 shadow-2xl shadow-indigo-500/20' : 'hover:shadow-xl hover:shadow-indigo-500/10'}`}>
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-500 to-purple-600 text-white px-3 py-1 text-xs font-bold rounded-bl-xl z-10">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">₹{billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly}</span>
                      <span className="text-muted-foreground">/{billingCycle}</span>
                    </div>
                    {billingCycle === 'yearly' && plan.priceMonthly > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Billed ₹{plan.priceMonthly * 12} yearly
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25"
                    size="lg"
                    variant={selectedPlanId === plan.id ? 'default' : 'outline'}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {selectedPlanId === plan.id ? 'Current Plan' : 'Choose Plan'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Current Plan Info */}
        {currentPlan && currentPlan !== 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
              <CardHeader>
                <CardTitle className="text-xl">Your Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Tier</p>
                    <p className="text-2xl font-bold text-foreground capitalize">{currentPlan}</p>
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
              className="px-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
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

        {/* Feature Comparison */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Compare features</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 font-semibold text-foreground">Feature</th>
                  <th className="p-4 font-semibold text-foreground">Free</th>
                  <th className="p-4 font-semibold text-foreground">Starter</th>
                  <th className="p-4 font-semibold text-foreground">Professional</th>
                  <th className="p-4 font-semibold text-foreground">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Leads per month', free: '50', starter: '500', professional: 'Unlimited', enterprise: 'Unlimited' },
                  { label: 'Agents', free: '3', starter: '10', professional: '50', enterprise: 'Unlimited' },
                  { label: 'Zones', free: '1', starter: '5', professional: 'Unlimited', enterprise: 'Unlimited' },
                  { label: 'Properties', free: '10', starter: '50', professional: 'Unlimited', enterprise: 'Unlimited' },
                  { label: 'WhatsApp', free: '❌', starter: '✅', professional: '✅', enterprise: '✅' },
                  { label: 'SMS', free: '❌', starter: '❌', professional: '✅', enterprise: '✅' },
                  { label: 'API Access', free: '❌', starter: '❌', professional: '✅', enterprise: '✅' },
                  { label: 'White-label', free: '❌', starter: '❌', professional: '❌', enterprise: '✅' },
                  { label: 'Priority Support', free: '❌', starter: '✅', professional: '✅', enterprise: '✅' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="p-4 text-sm font-medium text-foreground">{row.label}</td>
                    <td className="p-4 text-sm text-muted-foreground">{row.free}</td>
                    <td className="p-4 text-sm text-foreground">{row.starter}</td>
                    <td className="p-4 text-sm text-foreground">{row.professional}</td>
                    <td className="p-4 text-sm text-foreground">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Can I upgrade or downgrade my plan?', a: 'Yes, you can upgrade or downgrade your plan at any time. Prorated charges will be applied.' },
              { q: 'What payment methods do you accept?', a: 'We accept credit cards, debit cards, UPI, and net banking through Razorpay, Stripe, and PayU.' },
              { q: 'Is there a free trial?', a: 'Yes, we offer a 14-day free trial on all paid plans. No credit card required.' },
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. You will have access until the end of your billing period.' },
              { q: 'Do you offer custom plans?', a: 'Yes, we offer custom enterprise plans for large organizations. Contact our sales team for more information.' },
            ].map((faq, index) => (
              <Card key={index} className="hover:border-indigo-500/30 transition-colors">
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
