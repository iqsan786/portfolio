import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { inquirySchema } from './inquiry-schema';
import type { Database } from '@/integrations/supabase/types';

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createAnonFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }
    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

export const submitInquiry = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => inquirySchema.parse(input))
  .handler(async ({ data }) => {
    const SUPABASE_URL = process.env['SUPABASE_URL'] ?? process.env['VITE_SUPABASE_URL'] ?? '';
    const SUPABASE_KEY =
      process.env['SUPABASE_SERVICE_ROLE_KEY'] ??
      process.env['SUPABASE_PUBLISHABLE_KEY'] ??
      process.env['VITE_SUPABASE_PUBLISHABLE_KEY'] ??
      '';

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error('Supabase is not configured. Please check environment variables.');
    }

    const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
      global: { fetch: createAnonFetch(SUPABASE_KEY) },
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });

    const { website: _honeypot, ...inquiry } = data;
    const { error } = await supabase.from('portfolio_inquiries').insert(inquiry);
    if (error) {
      console.error('[Inquiry] Supabase insert error:', error);
      throw new Error('Your inquiry could not be saved. Please try again.');
    }
    return { success: true };
  });