import { defineMiddleware } from "astro:middleware";
import { createSupabaseClient } from "./lib/supabase";

const PROTECTED = ["/dashboard"];
const GUEST_ONLY = ["/login"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isProtected = PROTECTED.some(r => pathname.startsWith(r));
  const isGuestOnly = GUEST_ONLY.some(r => pathname.startsWith(r));

  if (!isProtected && !isGuestOnly) return next();

  const supabase = createSupabaseClient(context.cookies);
  const { data: { session } } = await supabase.auth.getSession();

  if (isProtected && !session) return context.redirect("/login");
  if (isGuestOnly && session) return context.redirect("/dashboard");

  return next();
});
