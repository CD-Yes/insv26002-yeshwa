import { type Env, json, preflight, supabaseUrl } from '../_shared/util';

interface PagesContext {
  env: Env;
}

/**
 * Reports the presence/configuration of connected systems WITHOUT revealing any
 * secret values. The admin System Health page consumes this.
 */
export const onRequestOptions = () => preflight();

export const onRequestGet = ({ env }: PagesContext): Response => {
  return json({
    ok: true,
    supabase: Boolean(supabaseUrl(env) && env.SUPABASE_SERVICE_ROLE_KEY),
    r2: Boolean(env.R2_BUCKET && env.R2_PUBLIC_BASE_URL),
    webhook: Boolean(env.MAKE_OR_N8N_WEBHOOK_URL),
    // booleans only — never echo secret values
  });
};
