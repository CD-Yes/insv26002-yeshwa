import { type Env, supabaseUrl } from './util';

interface AuthedUser {
  id: string;
  email: string;
  role: 'admin' | 'editor' | null;
}

/**
 * Verify a request's Bearer token against Supabase and confirm the user is staff
 * (admin/editor). Returns null when unauthenticated/unauthorised.
 *
 * Uses the service role key to read the profile role (bypasses RLS safely on the
 * server). The token itself is validated by Supabase's /auth/v1/user endpoint.
 */
export async function getStaffUser(request: Request, env: Env): Promise<AuthedUser | null> {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const base = supabaseUrl(env);
  const anon = env.VITE_SUPABASE_ANON_KEY;
  if (!token || !base || !anon) return null;

  // 1) Validate the JWT → get user.
  const userRes = await fetch(`${base}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: anon },
  });
  if (!userRes.ok) return null;
  const user = (await userRes.json()) as { id?: string; email?: string };
  if (!user.id) return null;

  // 2) Read role from profiles using the service role key.
  const svc = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!svc) return null;
  const profRes = await fetch(
    `${base}/rest/v1/profiles?id=eq.${user.id}&select=role`,
    { headers: { apikey: svc, Authorization: `Bearer ${svc}` } },
  );
  if (!profRes.ok) return null;
  const profiles = (await profRes.json()) as Array<{ role?: 'admin' | 'editor' }>;
  const role = profiles[0]?.role ?? null;
  if (role !== 'admin' && role !== 'editor') return null;

  return { id: user.id, email: user.email ?? '', role };
}
