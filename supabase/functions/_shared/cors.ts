const ALLOWED_ORIGINS = [
  'https://klkiznwtbeiqezhfbpzf.supabase.co',
  'http://localhost:5173',
  'http://localhost:3000',
];

export function getCorsHeaders(origin?: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  };
}

// 向后兼容
export const corsHeaders = getCorsHeaders();
