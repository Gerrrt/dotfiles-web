// Source of truth for the "Custom builder" on the Get Started page.
//
// Each module is a toggle in the builder UI AND an allowlisted token the served
// install scripts (src/lib/install-scripts.ts) accept on the command line. Keeping
// both sides driven by this one list is deliberate: the builder can never offer a
// token the script would reject, and the script can never accept a token the UI
// can't show. (This repo's whole hazard is docs drifting from reality — so the
// command and the script are generated from the same array, never hand-synced.)
//
// IMPORTANT: a module `id` is the ONLY thing that ever reaches a shell. Tokens are
// matched against this allowlist character-for-character and never eval'd, so the
// id must stay shell-safe — lowercase letters and digits only.
export type BuildPlatform = 'unix' | 'windows';

export interface BuildModule {
  /** Command-line token + script allowlist key. Lowercase [a-z0-9] only. */
  id: string;
  /** Checkbox label in the builder. */
  label: string;
  /** One-line description shown under the label. */
  blurb: string;
  /** Which generated one-liner(s) this module belongs to. */
  platforms: BuildPlatform[];
  /** Pre-checked in the builder. */
  defaultOn: boolean;
  /** Canonical repo that actually ships this (slug under the owner), for the script's guidance. */
  repo: string;
  /** A `tone-*` accent class from global.css. */
  tone: 'green' | 'cyan' | 'purple' | 'red';
}

// Guard: ids must be shell-safe, since they are interpolated into the validation
// table baked into the install scripts. Fail the build loudly on a bad id rather
// than ship a script with a surprising token.
const ID_PATTERN = /^[a-z0-9]+$/;

export const modules: BuildModule[] = [
  {
    id: 'zsh',
    label: 'Zsh Core config',
    blurb: 'The vendored Core shell — module chain, prompt, theme. Unix only.',
    platforms: ['unix'],
    defaultOn: true,
    repo: 'dotfiles-core',
    tone: 'green',
  },
  {
    id: 'nvim',
    label: 'Neovim Core setup',
    blurb: 'The shared lazy.nvim tree from Core. Works on Unix and Windows.',
    platforms: ['unix', 'windows'],
    defaultOn: true,
    repo: 'dotfiles-core',
    tone: 'cyan',
  },
  {
    id: 'security',
    label: 'OpSec & Red/Blue toolchain',
    blurb: 'The offensive role layer — aliases & functions for authorized engagements.',
    platforms: ['unix'],
    defaultOn: false,
    repo: 'dotfiles-Kali',
    tone: 'red',
  },
  {
    id: 'ps',
    label: 'Windows / PowerShell host',
    blurb: 'The native Windows host layer: pwsh profile, Terminal, the WSL bridge.',
    platforms: ['windows'],
    defaultOn: false,
    repo: 'dotfiles-Windows',
    tone: 'purple',
  },
];

for (const m of modules) {
  if (!ID_PATTERN.test(m.id)) {
    throw new Error(
      `src/data/modules.ts: module id "${m.id}" is not shell-safe ` +
        `(allowed: lowercase letters and digits). Fix it before it reaches the install script.`,
    );
  }
}

/** Modules that apply to a given platform, in declared order. */
export function modulesFor(platform: BuildPlatform): BuildModule[] {
  return modules.filter((m) => m.platforms.includes(platform));
}

/** The comma-joined default token string for a platform's one-liner. */
export function defaultTokens(platform: BuildPlatform): string {
  return modulesFor(platform)
    .filter((m) => m.defaultOn)
    .map((m) => m.id)
    .join(',');
}
