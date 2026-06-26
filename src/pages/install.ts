import type { APIRoute } from 'astro';

// Build-time static endpoint. Astro pre-renders this to `/install`, so the site
// serves a real `curl https://gerrrt.github.io/dotfiles-web/install | bash`
// one-liner. Modules are passed as the first positional arg, e.g.
// `… | bash -s -- core,zsh,nvim`.
//
// ESCAPING CONTRACT (see point 3 of the task): the installer body lives in a JS
// template literal, so the build would happily expand `${…}` and evaluate any
// backtick before writing the file. Every shell `$` is therefore written as
// `\$` and every literal backslash as `\\`, so bash variables survive verbatim
// into the client's terminal instead of being resolved here at build time.
export const prerender = true;

const script = `#!/usr/bin/env bash
set -euo pipefail

# 1. Parse modules passed down from the website (first positional arg).
MODULES="\${1:-core,zsh,nvim}"
echo "🚀 Initializing Terminal Environment..."
echo "Selected Modules: \$MODULES"

# --- Dependency Checker Engine ---
declare -a DEPS=("zsh" "nvim" "tmux" "fzf" "git" "ripgrep" "bat")
MISSING_DEPS=()

echo "🔍 Auditing target system dependencies..."

for cmd in "\${DEPS[@]}"; do
    if ! command -v "\$cmd" &> /dev/null; then
        # Map raw binary names to friendly installation alerts if needed
        MISSING_DEPS+=("\$cmd")
    fi
done

if [ \${#MISSING_DEPS[@]} -ne 0 ]; then
    echo "⚠️  Missing Core Binaries Detected: [ \${MISSING_DEPS[*]} ]"
    echo "--------------------------------------------------------"
    echo "Would you like this installer to attempt automated package setup?"
    echo "Choose: [Y]es (via Homebrew/APT/Pacman) or [N]on-destructive skip"
    read -r -p "[y/N]: " response

    if [[ "\$response" =~ ^([yY][eE][sS]|[yY])\$ ]]; then
        # Detect package manager and install dependencies
        if command -v brew &> /dev/null; then
            echo "🍺 Homebrew detected. Installing missing tools..."
            brew install "\${MISSING_DEPS[@]}"
        elif command -v apt-get &> /dev/null; then
            echo "📦 APT detected. Updating and installing missing tools..."
            sudo apt-get update && sudo apt-get install -y "\${MISSING_DEPS[@]}"
        elif command -v pacman &> /dev/null; then
            echo "🏹 Pacman detected. Installing missing tools..."
            sudo pacman -S --noconfirm "\${MISSING_DEPS[@]}"
        else
            echo "❌ No supported package manager found. Please install manually."
            exit 1
        fi
    else
        echo "⏭️  Skipping installation. Note: Some dotfile features may break."
    fi
fi

# 2. Modular installation based on the selected flags.
if [[ "\$MODULES" == *"zsh"* ]]; then
    echo "📦 Configuring Zsh environment..."
    # Clone safely without destroying an existing setup.
    if [ ! -d "\$HOME/.config/zsh" ]; then
        git clone --depth 1 https://github.com/Gerrrt/dotfiles-core "\$HOME/.config/zsh"
    fi
fi

if [[ "\$MODULES" == *"nvim"* ]]; then
    echo "⚡ Deploying Neovim (with core git-subtree configuration)..."
    if [ ! -d "\$HOME/.config/nvim" ]; then
        git clone --depth 1 https://github.com/Gerrrt/dotfiles-core "\$HOME/.config/nvim"
    fi
fi

echo "✅ Unix environment bootstrapper complete!"
`;

export const GET: APIRoute = () =>
  new Response(script, {
    headers: { 'Content-Type': 'text/x-shellscript; charset=utf-8' },
  });
