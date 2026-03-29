import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { AppRole } from '@/types/rbac';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  roles: AppRole[];
  hasRole: (role: AppRole) => boolean;
  isAdmin: boolean;
  isManager: boolean;
  isAgent: boolean;
  isOwner: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  session: null, 
  loading: true, 
  signOut: async () => {},
  roles: [],
  hasRole: () => false,
  isAdmin: false,
  isManager: false,
  isAgent: false,
  isOwner: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Load user roles
      if (session?.user) {
        loadUserRoles(session.user.id);
      }
    });
  }, []);

  const loadUserRoles = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) {
      console.error('Error loading roles:', error);
      setRoles(['viewer']);
    } else {
      setRoles(data.map(r => r.role as AppRole));
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const hasRole = (role: AppRole) => roles.includes(role);

  const isAdmin = hasRole('admin');
  const isManager = hasRole('manager');
  const isAgent = hasRole('agent');
  const isOwner = hasRole('owner');

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signOut,
        roles,
        hasRole,
        isAdmin,
        isManager,
        isAgent,
        isOwner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
