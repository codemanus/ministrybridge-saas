import React, { useEffect, useRef, useState } from 'react';

type PermissionsResponse = { permissions: string[] };

let cached: { at: number; set: Set<string> } | null = null;
const TTL_MS = 30_000;

async function fetchEffectivePermissions(): Promise<Set<string>> {
  const now = Date.now();
  if (cached && now - cached.at < TTL_MS) return cached.set;

  const res = await fetch('/api/rbac/effective', { credentials: 'include' });
  if (!res.ok) return new Set();
  const data: PermissionsResponse = await res.json();
  const set = new Set(data.permissions || []);
  cached = { at: now, set };
  return set;
}

export function useCanAccess(permission: string): boolean | undefined {
  const [allowed, setAllowed] = useState<boolean | undefined>(undefined);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    fetchEffectivePermissions().then((set) => {
      if (mounted.current) setAllowed(set.has(permission));
    });
    return () => {
      mounted.current = false;
    };
  }, [permission]);

  return allowed;
}

export function withPermission(permission: string) {
  return function <P>(Component: React.ComponentType<P>) {
    return function Wrapper(props: P) {
      const allowed = useCanAccess(permission);
      if (allowed === undefined) return null;
      return allowed ? <Component {...props} /> : null;
    };
  };
}


