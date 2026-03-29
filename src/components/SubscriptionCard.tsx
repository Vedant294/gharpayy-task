import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type { SubscriptionPlan } from '@/types/subscription';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  selected: boolean;
  billingCycle: 'monthly' | 'yearly';
  onSelect: () => void;
}

const SubscriptionCard = ({ plan, selected, billingCycle, onSelect }: SubscriptionCardProps) => {
  const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
  const savings = billingCycle === 'yearly' ? Math.round(((plan.priceMonthly * 12 - plan.priceYearly) / (plan.priceMonthly * 12)) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`relative overflow-hidden transition-all duration-300 ${selected ? 'ring-2 ring-accent shadow-xl' : 'hover:shadow-lg'}`}>
        {plan.isPopular && (
          <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-3 py-1 text-xs font-bold rounded-bl-xl z-10">
            MOST POPULAR
          </div>
        )}

        {savings > 0 && (
          <div className="absolute top-0 left-0 bg-success text-success-foreground px-3 py-1 text-xs font-bold rounded-tr-xl z-10">
            SAVE {savings}%
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-2xl font-display font-bold text-foreground">{plan.name}</CardTitle>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-4xl font-display font-bold text-foreground">₹{price}</span>
            <span className="text-muted-foreground">/{billingCycle}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Limits</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Leads</span>
                <span className="font-medium text-foreground">{plan.limits.maxLeads === -1 ? 'Unlimited' : plan.limits.maxLeads}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Agents</span>
                <span className="font-medium text-foreground">{plan.limits.maxAgents === -1 ? 'Unlimited' : plan.limits.maxAgents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Zones</span>
                <span className="font-medium text-foreground">{plan.limits.maxZones === -1 ? 'Unlimited' : plan.limits.maxZones}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Properties</span>
                <span className="font-medium text-foreground">{plan.limits.maxProperties === -1 ? 'Unlimited' : plan.limits.maxProperties}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            variant={selected ? 'default' : 'outline'}
            size="lg"
            onClick={onSelect}
          >
            {selected ? 'Current Plan' : 'Choose Plan'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SubscriptionCard;
