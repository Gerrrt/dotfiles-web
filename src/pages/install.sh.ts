// Static endpoint → /install.sh  (friendly alias of /install, identical content,
// for users who expect a .sh extension). Same safety model as install.ts.
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
