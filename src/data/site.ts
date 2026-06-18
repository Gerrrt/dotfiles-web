// Central site metadata. Edit these and the whole site updates.
export const site = {
  name: 'dotfiles',
  title: 'dotfiles — a nine-repo terminal ecosystem',
  description:
    'A portable, layered dotfiles ecosystem: one vendored Core (zsh, tmux, Neovim, git, starship, mise) shared across every machine, OS-native layers per platform, and an offensive role layer for Kali. Clone-and-go, fully reproducible.',
  owner: 'Gerrrt',
  githubUser: 'Gerrrt',
  githubBase: 'https://github.com/Gerrrt',
  // The ecosystem's canonical hub repo. The global "GitHub" link (header/footer)
  // points here so visitors land on Core, not the user profile.
  coreRepo: 'dotfiles-core',
  tagline: 'One Core. Every machine. Clone-and-go.',
} as const;

// Convenience: full URL to the core repo, used by the top-level GitHub links.
export const coreRepoUrl = `${site.githubBase}/${site.coreRepo}`;

// Release channels surfaced by the docs version-switcher (Get Started page).
// This is the OPERATOR-maintained source of truth, bumped by hand at release
// time alongside `scripts/release.sh` in dotfiles-core — the docs deliberately
// do NOT hit the GitHub API at build time, so every published install command is
// deterministic and an older rebuild can't silently change which versions it
// offers.
//
//   • 'main' is always the rolling channel — clones track the default branch,
//     so no `--branch` flag is emitted.
//   • Each tag (e.g. 'v1.0.0') pins a hermetic release: because Core is vendored
//     via `git subtree --squash`, a tagged OS-repo clone carries the exact Core
//     it was tested with, so the same three-command install works for ANY tag.
//
// When you cut the first release: set `current` to the new tag and prepend it to
// `channels` (newest first). Until then both stay at 'main' (unreleased) and the
// switcher renders a static "rolling" pill instead of a dropdown.
export const release = {
  current: 'main',
  channels: ['main'] as readonly string[],
} as const;

// The clone-ref flag for a channel: '' for the rolling 'main' channel, or
// '--branch <tag> ' for a pinned tag. Used to parameterize the install commands
// (the client-side switcher applies the same transform on selection change).
export function cloneRef(channel: string): string {
  return channel === 'main' ? '' : `--branch ${channel} `;
}

// Primary navigation. `href` values are page paths (base path is applied in the layout).
export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Get Started', href: '/getting-started' },
  { label: 'Architecture', href: '/architecture' },
  { label: 'Repos', href: '/#repos' },
  { label: 'Changelog', href: '/changelog' },
] as const;
