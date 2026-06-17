// Per-platform install guides. Each platform has ordered steps; each step has a
// short title, optional prose, and a code block (lang drives the prompt glyph).
export interface InstallStep {
  title: string;
  body?: string;
  code?: string;
  lang?: 'bash' | 'powershell';
}

export interface Platform {
  id: string;
  label: string;
  repo: string; // repo slug under the owner
  available: boolean; // false -> show "coming soon" note
  intro: string;
  steps: InstallStep[];
}

export const platforms: Platform[] = [
  {
    id: 'macos',
    label: 'macOS',
    repo: 'dotfiles-MacBook',
    available: true,
    intro: 'Apple Silicon or Intel. Homebrew does the heavy lifting; Core is vendored, so a clone is ready to go.',
    steps: [
      {
        title: 'Clone the repo',
        body: 'The Core layer is already vendored under core/ — no submodule flags.',
        code: 'git clone https://github.com/Gerrrt/dotfiles-MacBook ~/dotfiles-MacBook\ncd ~/dotfiles-MacBook',
      },
      {
        title: 'Preview the plan (optional)',
        body: 'A dry run prints every symlink it would create and changes nothing.',
        code: './bootstrap.sh --links-only --dry-run',
      },
      {
        title: 'Provision + wire',
        body: 'Homebrew, brew bundle, then symlinks. Idempotent — re-run any time.',
        code: './bootstrap.sh\nexec zsh',
      },
      {
        title: 'Optional system prefs',
        body: 'Apply the opt-in macOS defaults (may require a logout).',
        code: './bootstrap.sh --macos-defaults',
      },
    ],
  },
  {
    id: 'windows',
    label: 'Windows',
    repo: 'dotfiles-Windows',
    available: true,
    intro: 'PowerShell 7 + Developer Mode (or run elevated) so symlinks work. The host layer only — WSL distros configure themselves.',
    steps: [
      {
        title: 'One-line bootstrap',
        body: 'Clones the repo and runs the installer. Needs git and pwsh 7+.',
        code: 'irm https://raw.githubusercontent.com/Gerrrt/dotfiles-Windows/main/bootstrap.ps1 | iex',
        lang: 'powershell',
      },
      {
        title: 'Or install manually',
        body: 'Clone, then run the installer. -DryRun previews everything; -SkipPackages only re-wires links.',
        code: 'git clone https://github.com/Gerrrt/dotfiles-Windows.git\ncd dotfiles-Windows\n.\\install.ps1',
        lang: 'powershell',
      },
      {
        title: 'Finish up',
        body: 'Open a new PowerShell window, set git identity, and apply mirrored WSL networking.',
        code: '# set name/email in ~/.gitconfig.local, then:\nwsl --shutdown',
        lang: 'powershell',
      },
    ],
  },
  {
    id: 'kali',
    label: 'Kali (WSL2)',
    repo: 'dotfiles-Kali',
    available: true,
    intro: 'Three layers: Core + apt OS layer + the offensive role layer. Built for Kali on WSL2. Engagement data never lives in the repo.',
    steps: [
      {
        title: 'Clone the repo',
        code: 'git clone https://github.com/Gerrrt/dotfiles-Kali ~/dotfiles-Kali\ncd ~/dotfiles-Kali',
      },
      {
        title: 'Provision + wire',
        body: 'Full run installs apt base + offensive tools + symlinks. Add --no-offensive to skip the heavy tools.',
        code: './bootstrap.sh',
      },
      {
        title: 'Apply WSL networking',
        body: 'WSL2 is NAT’d — a listener isn’t reachable from your LAN until you enable mirrored networking on the Windows side.',
        code: '# drop windows.wslconfig.example at %UserProfile%\\.wslconfig, then from Windows:\nwsl.exe --shutdown',
      },
    ],
  },
  {
    id: 'linux',
    label: 'Linux distros',
    repo: 'dotfiles-core',
    available: false,
    intro:
      'Fedora is the template the other distro repos (Arch, openSUSE, Alpine, Gentoo, Debian) are stamped from — same structure every time, only the package manager and distro quirks change. These are being rolled out.',
    steps: [
      {
        title: 'Coming soon',
        body: 'The distro repos are in progress. The pattern is identical to macOS: clone, dry-run, ./bootstrap.sh. Watch dotfiles-core for the rollout.',
      },
    ],
  },
];
