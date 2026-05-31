import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import type { AstroCookies } from "astro";

const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithOAuth: async () => ({ data: { url: null }, error: null }),
    exchangeCodeForSession: async () => ({ data: null, error: { message: "Supabase auth disabled in static mode" } }),
    signOut: async () => ({ data: null, error: null }),
  },
};

export function createSupabaseClient(cookies: AstroCookies) {
  return mockSupabase;
  if (!import.meta.env.PUBLIC_SUPABASE_URL || !import.meta.env.PUBLIC_SUPABASE_ANON_KEY) {
    return mockSupabase;
  }

  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(cookies.toString() ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies.set(name, value, options);
          });
        },
        // 👇 ДОБАВЬТЕ ЭТУ СТРОКУ, чтобы отключить WebSocket на сервере
        realtime: { global: false },
      },
    }
  );
}
