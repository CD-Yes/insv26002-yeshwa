import { supabase } from './supabaseClient';

/**
 * Best-effort audit logging. Never throws into the UI — a failed log must not
 * block the action that triggered it.
 */
export async function logAudit(
  userId: string | null,
  action: string,
  entityType?: string,
  entityId?: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      entity_type: entityType ?? null,
      entity_id: entityId ?? null,
      metadata: metadata ?? null,
    });
  } catch {
    // swallow — auditing is non-critical
  }
}
