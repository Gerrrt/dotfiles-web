// Snapshot of the real CHANGELOG.md files, grouped per repo. This is a curated
// mirror for the website; the canonical changelogs live in each repo. When you
// cut a release, update the matching block here (or wire up automation later).
export interface ChangeGroup {
  category: 'Added' | 'Changed' | 'Fixed' | 'Security';
  items: string[];
}

export interface ChangelogEntry {
  repo: string;
  version: string;
  date?: string;
  summary?: string;
  groups: ChangeGroup[];
}

export const changelog: ChangelogEntry[] = [
  {
    repo: 'dotfiles-core',
    version: 'Unreleased',
    summary:
      'Core is the single source of truth vendored into nine OS repos via git subtree. Every entry is a change those repos receive on their next sync.',
    groups: [
      {
        category: 'Added',
        items: [
          'core-doctor — a scannable report of which modern-CLI tools Core detected and which integrations are live (resolves fd/fdfind, bat/batcat, and the package manager).',
          'core-help (alias cheat) — a grouped, column-aligned cheat sheet of Core’s functions, keybindings, and maintenance verbs; the shell counterpart to which-key.',
          'core.version stamp + core-version verb so you can tell which Core a given OS repo carries from inside it.',
          'zsh/ui.zsh — shared terminal-UX primitives (_core_err/warn/ok/hint/confirm/spin), gum-aware with a plain fallback, adopted across the runtime helpers.',
          'First-party zsh completions for Core’s own verbs (up, extract, mkcd, mkbak, maint-log, openv, fif, fbr, core-version, core-doctor).',
          'command_not_found_handler that suggests the nearest Core verb on a near typo (extarct → extract) or an install line for this box’s package manager.',
          'Hermetic behavioral tests for bin/clip / clip-paste across the WSL → macOS → Wayland → X11 detection ladder, plus a headless Neovim config-load smoke test.',
          'A core/os boundary audit gate: portable zsh modules may carry no OS-absolute paths, mechanically enforcing the “if it changes with the OS it isn’t Core” rule.',
        ],
      },
      {
        category: 'Changed',
        items: [
          'Incremental CI: a changes job classifies the diff and gates the narrow, expensive legs (nvim/luacheck, Alpine, bench). An unresolved diff runs everything.',
          'Startup-perf bench is an enforced regression gate (CORE_BENCH_BUDGET_MS=120 over 50 warmed runs), not report-only.',
          'Defensive confirms on impactful actions: please previews the exact sudo line; up pre-confirms before touching the system; serve warns it binds 0.0.0.0.',
        ],
      },
      {
        category: 'Security',
        items: [
          'Pinned the seven runtime zsh plugins to commit SHAs — the last unpinned link in a toolchain that already pins CI linters, pre-commit hooks, and GitHub Actions.',
        ],
      },
      {
        category: 'Fixed',
        items: [
          'fzf / fzf-tab previews no longer hardcode bat/eza, so preview panes work on Debian/Ubuntu (batcat) and boxes without eza.',
          'diff is only aliased to --color=auto after a feature-probe, fixing BSD/macOS diff.',
          'Restored non-executable mode (100644) on the sourced zsh/*.zsh modules — the exact bug class the audit exists to catch.',
        ],
      },
    ],
  },
  {
    repo: 'dotfiles-Windows',
    version: 'Unreleased',
    summary: 'A structural + terminal-UX pass focused on a world-class bootstrap and shell experience.',
    groups: [
      {
        category: 'Added',
        items: [
          'Hermetic, incremental CI — Actions pinned to commit SHAs; Pester and PSScriptAnalyzer pinned; PSGallery modules cached; docs-only changes skip the Windows jobs.',
          'uninstall.ps1 — reverse the bootstrap; removes only symlinks pointing back into the repo, with -DryRun / -RestoreBackups.',
          'Pre-commit hook wiring (core.hooksPath) and a fragment-load health gate surfaced by dotfiles-doctor.',
          'Coverage gate — Pester enforces ≥85% coverage on the pure-helper library.',
        ],
      },
      {
        category: 'Changed',
        items: [
          'install.ps1 -DryRun previews every change and mutates nothing; -Help prints usage; -NonInteractive / -Yes for unattended runs.',
          'Unified error/warning layout with NO_COLOR + DOTFILES_ASCII fallbacks across every renderer.',
          'Interactive overwrite — confirm before backing up a real user file; stale links are rewired silently.',
          'dotfiles-doctor -Fix opt-in remediation, and dothelp -i fuzzy command picker (fzf) that copies the pick.',
        ],
      },
    ],
  },
];
