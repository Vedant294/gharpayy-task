import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { whiteLabelService } from '@/lib/whiteLabelService';

export const useWhiteLabelConfig = () => {
  return useQuery({
    queryKey: ['white-label-config'],
    queryFn: async () => {
      const { data: session } = await import('@/integrations/supabase/client').then(({ supabase }) => supabase.auth.getSession());
      const userId = session?.data?.session?.user?.id;
      if (!userId) return null;
      return whiteLabelService.getConfig(userId);
    },
    enabled: false,
  });
};

export const useCreateOrUpdateWhiteLabelConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: {
      brandName: string;
      logoUrl?: string;
      primaryColor?: string;
      secondaryColor?: string;
      faviconUrl?: string;
      customDomain?: string;
      footerText?: string;
    }) => {
      const { data: session } = await import('@/integrations/supabase/client').then(({ supabase }) => supabase.auth.getSession());
      const userId = session?.data?.session?.user?.id;
      if (!userId) throw new Error('User not authenticated');
      return whiteLabelService.createOrUpdateConfig(userId, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['white-label-config'] });
    },
  });
};

export const useUpdateDomainVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isVerified: boolean) => {
      const { data: session } = await import('@/integrations/supabase/client').then(({ supabase }) => supabase.auth.getSession());
      const userId = session?.data?.session?.user?.id;
      if (!userId) throw new Error('User not authenticated');
      return whiteLabelService.updateDomainVerification(userId, isVerified);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['white-label-config'] });
    },
  });
};

export const useDeleteWhiteLabelConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data: session } = await import('@/integrations/supabase/client').then(({ supabase }) => supabase.auth.getSession());
      const userId = session?.data?.session?.user?.id;
      if (!userId) throw new Error('User not authenticated');
      return whiteLabelService.deleteConfig(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['white-label-config'] });
    },
  });
};
