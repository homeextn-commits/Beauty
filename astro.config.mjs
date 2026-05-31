import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  base: '/Beauty',
  // If your repo is not at the root of your domain, set base to the repo name.
  // base: '/repository-name',
  routes: [
    {
      pattern: '/auth/callback',
      prerender: false
    },
    {
      pattern: '/auth/logout',
      prerender: false
    }
  ]
});
