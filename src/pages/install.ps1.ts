// Static endpoint → /install.ps1  (the Windows one-liner target). Built once at
// deploy time; serves a fixed PowerShell script. Modules are passed by the CLIENT
// as a script argument, never read from the request. See src/lib/install-scripts.ts.
import type { APIRoute } from 'astro';
import { ps1Script } from '../lib/install-scripts';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = new URL(import.meta.env.BASE_URL, site ?? 'https://gerrrt.github.io').href;
  return new Response(ps1Script(base), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
    },
  });
};
