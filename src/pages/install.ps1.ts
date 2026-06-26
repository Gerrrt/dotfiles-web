import type { APIRoute } from 'astro';

// Build-time static endpoint. Astro pre-renders this to `/install.ps1`, so the
// site serves a real `irm https://gerrrt.github.io/dotfiles-web/install.ps1 | iex`
// one-liner. Modules are passed via -Modules, e.g. `& { … } -Modules core,nvim`.
//
// ESCAPING CONTRACT (see point 3 of the task): the installer body lives in a JS
// template literal. PowerShell leans on `$` for every variable and uses the
// backtick as its own escape char, so the build would otherwise expand `${…}`
// and consume backticks before writing the file. Every PowerShell `$` is
// written as `\$`, every literal backslash as `\\`, and any literal backtick as
// `` \` `` — so the script reaches the client's shell verbatim.
export const prerender = true;

const script = `# install.ps1
param([string]\$Modules = "core,powershell,nvim")

Write-Host "🚀 Initializing Windows Terminal Environment..." -ForegroundColor Cyan
Write-Host "Selected Modules: \$Modules"

# --- PowerShell Dependency Checker Engine ---
# Probe only tools we can actually auto-install via WinGet below. PowerShell
# itself is omitted: this script is *running* in it, and there is no meaningful
# WinGet id to fall back to.
\$RequiredTools = @("git", "nvim", "fzf")
\$MissingTools = @()

Write-Host "🔍 Auditing Windows system environment..." -ForegroundColor Cyan

foreach (\$tool in \$RequiredTools) {
    if (-not (Get-Command \$tool -ErrorAction SilentlyContinue)) {
        \$MissingTools += \$tool
    }
}

if (\$MissingTools.Count -gt 0) {
    \$toolsString = \$MissingTools -join ", "
    Write-Host "⚠️  Missing Core Binaries Detected: [ \$toolsString ]" -ForegroundColor Yellow

    \$Confirmation = Read-Host "Would you like to auto-install via WinGet? (Y/N)"
    if (\$Confirmation -match '^[yY]') {
        if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
            Write-Error "WinGet is not available on this system. Please install missing tools manually."
            exit 1
        }

        foreach (\$missing in \$MissingTools) {
            Write-Host "📦 Installing \$missing via WinGet..." -ForegroundColor Green
            # Maps generic tool names to official WinGet app IDs. Pin with --id -e
            # and pre-accept agreements so the install never blocks on a prompt in
            # a non-interactive irm-piped-to-iex run.
            switch (\$missing) {
                "nvim" { winget install --id Neovim.Neovim -e --accept-package-agreements --accept-source-agreements --silent }
                "git"  { winget install --id Git.Git -e --accept-package-agreements --accept-source-agreements --silent }
                "fzf"  { winget install --id junegunn.fzf -e --accept-package-agreements --accept-source-agreements --silent }
            }
        }
    } else {
        Write-Host "⏭️  Skipping auto-install. Moving forward with configuration deployment..." -ForegroundColor Yellow
    }
}

# Module configuration.
if (\$Modules -like "*powershell*") {
    Write-Host "📦 Configuring PowerShell profile..." -ForegroundColor Green
    \$ProfilePath = Split-Path \$PROFILE
    if (-not (Test-Path \$ProfilePath)) { New-Item -ItemType Directory -Path \$ProfilePath -Force | Out-Null }
}

if (\$Modules -like "*nvim*") {
    Write-Host "⚡ Configuring Neovim for Windows..." -ForegroundColor Green
    \$NvimPath = "\$HOME\\AppData\\Local\\nvim"
    if (-not (Test-Path \$NvimPath)) {
        git clone --depth 1 https://github.com/Gerrrt/dotfiles-Windows \$NvimPath
        if (\$LASTEXITCODE -ne 0) {
            Write-Error "git clone failed (exit \$LASTEXITCODE). Aborting before declaring success."
            exit 1
        }
    }
}

Write-Host "✅ Windows deployment complete!" -ForegroundColor Cyan
`;

export const GET: APIRoute = () =>
  new Response(script, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
