import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockProperties, mockLandmarks } from '@/data/mockData';

export interface PropertyFilters {
  city?: string;
  area?: string;
  budgetMin?: number;
  budgetMax?: number;
  roomType?: string;
  gender?: string;
  amenity?: string;
  sharingTypes?: string[];
  nearLandmark?: string;
  page?: number;
  limit?: number;
}

export function usePublicProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ['public-properties', filters],
    queryFn: async () => {
      // Use mock data for demo purposes
      let results = [...mockProperties];
      
      // Apply filters
      if (filters.city) {
        results = results.filter(p => p.city?.toLowerCase().includes(filters.city!.toLowerCase()));
      }
      if (filters.area) {
        results = results.filter(p => p.area?.toLowerCase().includes(filters.area!.toLowerCase()));
      }
      if (filters.gender && filters.gender !== 'any') {
        results = results.filter(p => p.gender_allowed === filters.gender || p.gender_allowed === 'any');
      }
      if (filters.budgetMax) {
        results = results.filter(p => {
          const rents = (p.rooms || []).map((r: any) => r.rent_per_bed || r.expected_rent).filter(Boolean);
          if (!rents.length) return true;
          return Math.min(...rents) <= filters.budgetMax!;
        });
      }
      if (filters.sharingTypes?.length) {
        const sharingMap: Record<string, number> = { 'Private': 1, '2 Sharing': 2, '3 Sharing': 3, '4 Sharing': 4 };
        const bedCounts = filters.sharingTypes.map(s => sharingMap[s]).filter(Boolean);
        results = results.filter(p =>
          (p.rooms || []).some((r: any) => bedCounts.includes(r.bed_count))
        );
      }
      
      return results;
    },
  });
}

export function usePublicProperty(propertyId: string | undefined) {
  return useQuery({
    queryKey: ['public-property', propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      // Use mock data for demo purposes
      const property = mockProperties.find(p => p.id === propertyId);
      if (property) return property;
      
      // Fallback to Supabase if not found in mock
      const { data, error } = await supabase
        .from('properties')
        .select('*, owners:owner_id(name, phone), rooms(*, beds(*))')
        .eq('id', propertyId!)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useSimilarProperties(area?: string | null, city?: string | null, excludeId?: string) {
  return useQuery({
    queryKey: ['similar-properties', area, city, excludeId],
    enabled: !!(area || city),
    queryFn: async () => {
      let results = [...mockProperties];
      
      if (area) {
        results = results.filter(p => p.area?.toLowerCase().includes(area.toLowerCase()));
      } else if (city) {
        results = results.filter(p => p.city?.toLowerCase().includes(city.toLowerCase()));
      }
      
      if (excludeId) {
        results = results.filter(p => p.id !== excludeId);
      }
      
      return results.slice(0, 6);
    },
  });
}

export function useAvailableCities() {
  return useQuery({
    queryKey: ['available-cities'],
    queryFn: async () => {
      const cities = [...new Set(mockProperties.map(p => p.city).filter(Boolean))];
      return cities;
    },
  });
}

export function useAvailableAreas(city?: string) {
  return useQuery({
    queryKey: ['available-areas', city],
    queryFn: async () => {
      let areas = mockProperties.map(p => p.area).filter(Boolean);
      if (city) {
        areas = mockProperties
          .filter(p => p.city?.toLowerCase().includes(city.toLowerCase()))
          .map(p => p.area)
          .filter(Boolean);
      }
      return [...new Set(areas)] as string[];
    },
  });
}

export function useLandmarks(city?: string) {
  return useQuery({
    queryKey: ['landmarks', city],
    queryFn: async () => {
      let landmarks = [...mockLandmarks];
      if (city) {
        landmarks = landmarks.filter(l => l.city?.toLowerCase().includes(city.toLowerCase()));
      }
      return landmarks;
    },
  });
}

export function useCreateReservation() {
  return useMutation({
    mutationFn: async (params: {
      property_id: string; bed_id: string; room_id: string;
      customer_name: string; customer_phone: string; customer_email?: string;
      move_in_date?: string; room_type?: string; monthly_rent?: number;
    }) => {
      const { data, error } = await supabase.rpc('create_reservation_lock', {
        p_property_id: params.property_id,
        p_bed_id: params.bed_id,
        p_room_id: params.room_id,
        p_customer_name: params.customer_name,
        p_customer_phone: params.customer_phone,
        p_customer_email: params.customer_email || null,
        p_move_in_date: params.move_in_date || null,
        p_room_type: params.room_type || null,
        p_monthly_rent: params.monthly_rent || null,
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      return data;
    },
  });
}

export function useConfirmReservation() {
  return useMutation({
    mutationFn: async (params: { reservation_id: string; payment_reference: string }) => {
      const { data, error } = await supabase.rpc('confirm_reservation', {
        p_reservation_id: params.reservation_id,
        p_payment_reference: params.payment_reference,
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      return data;
    },
  });
}
