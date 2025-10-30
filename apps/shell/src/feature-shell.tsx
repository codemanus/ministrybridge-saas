import '@packages/ui-kit';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  initializeFeatureSDK, 
  setSessionData, 
  useFeatureFlag, 
  useFeatures, 
  useFeatureContext 
} from '@packages/feature-sdk';
import axios from 'axios';
import { ThemeProvider, ThemeToggle, Separator } from '@packages/ui-kit';

// Initialize the feature SDK (API has no /api prefix)
initializeFeatureSDK({
  apiUrl: 'http://localhost:4000',
  cacheTTL: 30000, // 30 seconds
});

// Lazy load remote apps
const BaseApp = React.lazy(() => import('ui_base/App'));
const CampusApp = React.lazy(() => import('ui_campus/App'));
const GroupsApp = React.lazy(() => import('ui_groups/App'));
const StudentsApp = React.lazy(() => import('ui_students/App'));
const TechProdApp = React.lazy(() => import('ui_tech_prod/App'));

// Simple redirector component to kick off the auth flow via API
function LoginRedirect() {
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const org = params.get('org') || '';
    const method = params.get('method') || '';
    const API_BASE_URL = (process.env.API_BASE_URL as string) || 'http://localhost:4000';
    const CLIENT_ID = (process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID as string) || '';
    const REDIRECT_URI = (process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI as string) || `${API_BASE_URL}/auth/callback`;

    // Fallback: if client id is not available at build/runtime, use server-initiated login
    if (!CLIENT_ID) {
      const qs = new URLSearchParams();
      if (org) qs.set('org', org);
      if (method) qs.set('method', method);
      window.location.replace(`${API_BASE_URL}/auth/login${qs.toString() ? `?${qs.toString()}` : ''}`);
      return;
    }

    // Construct WorkOS Hosted Auth URL directly (frontend-initiated)
    let target = '';
    if (method === 'password') {
      // AuthKit hosted UI
      const q = new URLSearchParams({
        provider: 'authkit',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
      });
      target = `https://api.workos.com/user_management/authorize?${q.toString()}`;
    } else {
      // Default to SSO flow; requires organization id
      const q = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
      });
      if (org) q.set('organization', org);
      target = `https://api.workos.com/sso/authorize?${q.toString()}`;
    }

    window.location.replace(target);
  }, []);
  return <div className="p-4 text-sm text-muted-foreground">Redirecting to login…</div>;
}

// Session management hook
function useSession() {
  const [sessionData, setSessionData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('http://localhost:4000/session', { withCredentials: true });
        const data = response.data;
        
        // Set session data in the feature SDK
        setSessionData(data);
        
        console.log('Session loaded:', data);
      } catch (err: any) {
        console.error('Failed to load session:', err);
        setError(err.message || 'Failed to load session');
        
        // Set fallback session data
        const fallbackData = {
          tenantId: 'fallback-org',
          userId: 'fallback-user',
          roles: ['user'],
          features: {
            'ui-base': true,
            'ui-campus': false,
            'ui-groups': false,
            'ui-students': false,
            'ui-tech-prod': false,
          },
        };
        setSessionData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return { sessionData, loading, error };
}

// Feature-aware navigation component
function Navigation({ adminOverride = false }: { adminOverride?: boolean }) {
  const features = useFeatures();
  const context = useFeatureContext();

  const navItems = [
    { path: '/', label: 'Home', alwaysShow: true },
    { path: '/base', label: 'Base Module', feature: 'ui-base' },
    { path: '/campus', label: 'Campus', feature: 'ui-campus' },
    { path: '/groups', label: 'Groups', feature: 'ui-groups' },
    { path: '/students', label: 'Students', feature: 'ui-students' },
    { path: '/tech', label: 'Tech & Production', feature: 'ui-tech-prod' },
  ];

  return (
    <nav className="flex gap-3 mb-4">
      {navItems.map((item) => {
        // Always show home, check feature flag for others (admin sees all)
        const shouldShow = adminOverride || item.alwaysShow || features[item.feature!];
        
        if (!shouldShow) return null;
        
        return (
          <Link 
            key={item.path}
            to={item.path} 
            className="text-blue-600 hover:underline"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

// Feature-protected route component
function FeatureRoute({ 
  feature, 
  children, 
  fallback = <Navigate to="/" replace /> 
}: { 
  feature: string; 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
  adminOverride?: boolean;
}) {
  const isEnabled = useFeatureFlag(feature);
  const props = arguments[0] as any;
  if (props?.adminOverride) {
    return <>{children}</>;
  }
  
  if (!isEnabled) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Home component with session info
function Home() {
  const { sessionData, loading, error } = useSession();
  const features = useFeatures();
  const context = useFeatureContext();
  // Values provided via DefinePlugin
  const API_BASE_URL = (process.env.API_BASE_URL as string) || 'http://localhost:4000';
  const ORG_ID = (process.env.NEXT_PUBLIC_WORKOS_ORGANIZATION_ID as string) || '';

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">MinistryBridge SaaS (Shell)</h1>
        <div className="text-gray-600">Loading session data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">MinistryBridge SaaS (Shell)</h1>
        <div className="text-red-600 mb-4">Error loading session: {error}</div>
        <Navigation />
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <a className="text-blue-600 hover:underline" href={`${API_BASE_URL}/auth/login?org=${encodeURIComponent(ORG_ID)}`}>Login with SSO</a>
          <a className="text-blue-600 hover:underline" href={`${API_BASE_URL}/auth/login?method=password`}>Login with Email+Password</a>
          <a className="text-blue-600 hover:underline" href={`${API_BASE_URL}/auth/logout`}>Logout</a>
          <span className="text-sm text-muted-foreground">Status: Not authenticated</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">MinistryBridge SaaS (Shell)</h1>
      
      {/* Session Info */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Session Information</h2>
        <div className="text-sm">
          <div><strong>Tenant ID:</strong> {sessionData?.user?.tenantId || 'N/A'}</div>
          <div><strong>User ID:</strong> {sessionData?.user?.id || 'N/A'}</div>
          <div><strong>Roles:</strong> {sessionData?.user?.roles?.join(', ') || 'N/A'}</div>
        </div>
      </div>

      {/* Feature Flags */}
      <div className="mb-6 p-4 bg-blue-50 rounded">
        <h2 className="text-lg font-semibold mb-2">Feature Flags</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(features).map(([feature, enabled]) => (
            <div key={feature} className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-2 ${enabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="font-mono">{feature}:</span>
              <span className="ml-1">{enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          ))}
        </div>
      </div>

      <Navigation />
      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <a className="text-blue-600 hover:underline" href={`${API_BASE_URL}/auth/login?org=${encodeURIComponent(ORG_ID)}`}>Login with SSO</a>
        <a className="text-blue-600 hover:underline" href={`${API_BASE_URL}/auth/login?method=password`}>Login with Email+Password</a>
        <a className="text-blue-600 hover:underline" href={`${API_BASE_URL}/auth/logout`}>Logout</a>
        <span className="text-sm text-muted-foreground">
          Status: {sessionData?.user?.id ? 'Authenticated' : 'Not authenticated'}
        </span>
      </div>
      
      {/* Feature SDK Integration Test placeholder */}
    </div>
  );
}

// Main App component with feature-aware routing
function App() {
  const { loading } = useSession();
  const session = useSession();
  const adminOverride = !!session?.sessionData?.user?.roles?.includes('Admin') || !!session?.sessionData?.user?.roles?.includes('admin');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">MinistryBridge SaaS</div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" color="orange">
      <BrowserRouter>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="hidden md:flex w-64 flex-col border-r bg-background p-4">
            <div className="mb-4 text-xl font-semibold">MinistryBridge</div>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-foreground hover:underline">Home</Link>
              <Link to="/base" className="text-sm text-foreground hover:underline">Base Module</Link>
              <Link to="/campus" className="text-sm text-foreground hover:underline">Campus</Link>
              <Link to="/groups" className="text-sm text-foreground hover:underline">Groups</Link>
              <Link to="/students" className="text-sm text-foreground hover:underline">Students</Link>
              <Link to="/tech" className="text-sm text-foreground hover:underline">Tech & Production</Link>
            </nav>
          </aside>
          {/* Main */}
          <div className="flex flex-1 flex-col">
            <header className="flex h-14 items-center gap-2 border-b px-4">
              <ThemeToggle />
              <Separator orientation="vertical" className="h-6" />
              <div className="text-sm text-muted-foreground">Feature-aware Shell</div>
            </header>
            <main className="flex-1 p-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginRedirect />} />
        
        {/* Base Module - Always enabled */}
        <Route 
          path="/base/*" 
          element={
            <React.Suspense fallback="Loading Base Module...">
              <BaseApp />
            </React.Suspense>
          } 
        />
        
        {/* Campus Module - Feature protected */}
        <Route 
          path="/campus/*" 
          element={
            <FeatureRoute feature="ui-campus" adminOverride={adminOverride}>
              <React.Suspense fallback="Loading Campus Module...">
                <CampusApp />
              </React.Suspense>
            </FeatureRoute>
          } 
        />
        
        {/* Groups Module - Feature protected */}
        <Route 
          path="/groups/*" 
          element={
            <FeatureRoute feature="ui-groups" adminOverride={adminOverride}>
              <React.Suspense fallback="Loading Groups Module...">
                <GroupsApp />
              </React.Suspense>
            </FeatureRoute>
          } 
        />
        
        {/* Students Module - Feature protected */}
        <Route 
          path="/students/*" 
          element={
            <FeatureRoute feature="ui-students" adminOverride={adminOverride}>
              <React.Suspense fallback="Loading Students Module...">
                <StudentsApp />
              </React.Suspense>
            </FeatureRoute>
          } 
        />
        
        {/* Tech & Production Module - Feature protected */}
        <Route 
          path="/tech/*" 
          element={
            <FeatureRoute feature="ui-tech-prod" adminOverride={adminOverride}>
              <React.Suspense fallback="Loading Tech & Production Module...">
                <TechProdApp />
              </React.Suspense>
            </FeatureRoute>
          } 
        />
        
                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
