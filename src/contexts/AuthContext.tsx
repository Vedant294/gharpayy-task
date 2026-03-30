import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { AppRole } from '@/types/rbac';

interface DemoUser {
  email: string;
  password: string;
  role: AppRole;
  name: string;
}

const DEMO_USERS: DemoUser[] = [
  { email: 'admin@gharpayy.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { email: 'manager@gharpayy.com', password: 'manager123', role: 'manager', name: 'Manager User' },
  { email: 'agent@gharpayy.com', password: 'agent123', role: 'agent', name: 'Agent User' },
  { email: 'owner@gharpayy.com', password: 'owner123', role: 'owner', name: 'Owner User' },
  { email: 'viewer@gharpayy.com', password: 'viewer123', role: 'viewer', name: 'Viewer User' },
];

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
  demoLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  demoLogout: () => void;
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
  demoLogin: async () => ({ success: false }),
  demoLogout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isDemoUser, setIsDemoUser] = useState(false);

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
    setIsDemoUser(false);
  };

  const demoLogin = async (email: string, password: string) => {
    const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (demoUser) {
      // Create a temporary session for demo user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoUser.email,
        password: demoUser.password,
      });

      if (error) {
        // If user doesn't exist in Supabase, create a mock session
        const mockUser: User = {
          id: `demo-${demoUser.role}`,
          email: demoUser.email,
          email_confirmed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: { name: demoUser.name },
          aud: 'authenticated',
          role: 'authenticated',
        };

        const mockSession: Session = {
          access_token: `demo-token-${Date.now()}`,
          refresh_token: `demo-refresh-${Date.now()}`,
          expires_in: 3600,
          expires_at: Date.now() + 3600000,
          token_type: 'bearer',
          user: mockUser,
        };

        setSession(mockSession);
        setUser(mockUser);
        setRoles([demoUser.role]);
        setIsDemoUser(true);
        
        return { success: true };
      }

      if (data.user) {
        await loadUserRoles(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Invalid credentials' };
    }

    return { success: false, error: 'Invalid credentials' };
  };

  const demoLogout = () => {
    setIsDemoUser(false);
    setRoles([]);
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
        demoLogin,
        demoLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
