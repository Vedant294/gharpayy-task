// White-Label Service for Gharpayy Commercialization
// Manages custom branding and white-label configurations

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type WhiteLabelConfig = Database['public']['Tables']['white_label_configs']['Row'];

interface WhiteLabelConfigInput {
  brandName: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  faviconUrl?: string;
  customDomain?: string;
  footerText?: string;
}

class WhiteLabelService {
  public async getConfig(userId: string): Promise<WhiteLabelConfig | null> {
    const { data, error } = await supabase
      .from('white_label_configs')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error getting white-label config:', error);
      return null;
    }

    return data;
  }

  public async createOrUpdateConfig(
    userId: string,
    config: WhiteLabelConfigInput
  ): Promise<{ data: WhiteLabelConfig | null; error: string | null }> {
    const { data: existingConfig } = await supabase
      .from('white_label_configs')
      .select('id')
      .eq('user_id', userId)
      .single();

    const configData = {
      brand_name: config.brandName,
      logo_url: config.logoUrl,
      primary_color: config.primaryColor || '#6366f1',
      secondary_color: config.secondaryColor || '#8b5cf6',
      favicon_url: config.faviconUrl,
      custom_domain: config.customDomain,
      footer_text: config.footerText,
      is_custom_domain_verified: false,
    };

    if (existingConfig) {
      const { data, error } = await supabase
        .from('white_label_configs')
        .update(configData)
        .eq('id', existingConfig.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating white-label config:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } else {
      const { data, error } = await supabase
        .from('white_label_configs')
        .insert({
          user_id: userId,
          ...configData,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating white-label config:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    }
  }

  public async updateDomainVerification(userId: string, isVerified: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('white_label_configs')
      .update({ is_custom_domain_verified: isVerified })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating domain verification:', error);
      return false;
    }

    return true;
  }

  public async deleteConfig(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('white_label_configs')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting white-label config:', error);
      return false;
    }

    return true;
  }

  public async getBrandingData(userId: string) {
    const config = await this.getConfig(userId);
    
    if (!config) {
      return {
        brandName: 'Gharpayy',
        logoUrl: '/logo.svg',
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        faviconUrl: '/favicon.ico',
        customDomain: null,
        footerText: '© 2024 Gharpayy. All rights reserved.',
        isCustomDomainVerified: false,
      };
    }

    return {
      brandName: config.brand_name,
      logoUrl: config.logo_url || '/logo.svg',
      primaryColor: config.primary_color || '#6366f1',
      secondaryColor: config.secondary_color || '#8b5cf6',
      faviconUrl: config.favicon_url || '/favicon.ico',
      customDomain: config.custom_domain,
      footerText: config.footer_text || '© 2024 Gharpayy. All rights reserved.',
      isCustomDomainVerified: config.is_custom_domain_verified,
    };
  }

  public applyBrandingToDocument(branding: {
    brandName: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    faviconUrl: string;
    footerText: string;
  }) {
    // Update favicon
    const faviconLink = document.querySelector('link[rel="icon"]');
    if (faviconLink && branding.faviconUrl) {
      faviconLink.setAttribute('href', branding.faviconUrl);
    }

    // Update meta title
    document.title = `${branding.brandName} - PG Management CRM`;

    // Update CSS variables for colors
    document.documentElement.style.setProperty('--primary', branding.primaryColor);
    document.documentElement.style.setProperty('--secondary', branding.secondaryColor);
    document.documentElement.style.setProperty('--accent', branding.secondaryColor);

    // Update footer if element exists
    const footer = document.querySelector('footer');
    if (footer && branding.footerText) {
      footer.innerHTML = `<div class="text-center text-sm text-muted-foreground">${branding.footerText}</div>`;
    }
  }
}

export const whiteLabelService = new WhiteLabelService();
