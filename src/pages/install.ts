// Static endpoint → /install  (the Unix one-liner target: `curl … | bash -s -- …`).
// Built once at deploy time; serves a fixed bash script. Modules are passed by the
// CLIENT as a `bash -s --` argument, never read from the request here — GitHub Pages
// is static and has no request context, and reflecting a query into a piped-to-shell
// payload would be unsafe regardless. See src/lib/install-scripts.ts.
import type { APIRoute } from 'astro';
import { bashScript } from '../lib/install-scripts';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = new URL(import.meta.env.BASE_URL, site ?? 'https://gerrrt.github.io').href;
  return new Response(bashScript(base), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
    },
  });
};
