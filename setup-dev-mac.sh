#!/usr/bin/env bash

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Setup Environment Frontend (Node / React / Next) for Mac ===${NC}"

########################################
# Utils
########################################
command_exists () {
  command -v "$1" >/dev/null 2>&1
}

log_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

########################################
# Homebrew (Mac Package Manager)
########################################
if ! command_exists brew; then
  log_info "Homebrew is not installed. Installing..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  
  # Add Homebrew to PATH for immediate use
  if [[ -f "/opt/homebrew/bin/brew" ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [[ -f "/usr/local/bin/brew" ]]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
else
  log_info "Updating Homebrew..."
  brew update
fi

########################################
# Git
########################################
if ! command_exists git; then
  log_info "Installing git..."
  brew install git
else
  log_info "Git is already installed."
fi

########################################
# NVM + Node
########################################
export NVM_DIR="$HOME/.nvm"

if [ ! -d "$NVM_DIR" ]; then
  log_info "Installing NVM..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
else
  log_info "NVM is already installed."
fi

# Load NVM
if [ -s "$NVM_DIR/nvm.sh" ]; then
  source "$NVM_DIR/nvm.sh"
else
  # Fallback for new installation if not sourced yet
  if [[ -f "/opt/homebrew/opt/nvm/nvm.sh" ]]; then
      source "/opt/homebrew/opt/nvm/nvm.sh"
  elif [[ -f "/usr/local/opt/nvm/nvm.sh" ]]; then
      source "/usr/local/opt/nvm/nvm.sh"
  fi
fi

if ! command_exists nvm; then
    log_info "Attempting to install NVM via Homebrew as fallback..."
    brew install nvm
    mkdir -p ~/.nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$(brew --prefix)/opt/nvm/nvm.sh" ] && \. "$(brew --prefix)/opt/nvm/nvm.sh"
fi

log_info "Installing Node LTS..."
nvm install --lts
nvm use --lts
nvm alias default 'lts/*'

########################################
# Global tools
########################################
log_info "Installing global tools (pnpm, yarn, dev tools)..."

npm install -g \
  pnpm \
  yarn \
  create-next-app \
  create-react-app \
  typescript \
  eslint \
  prettier

########################################
# Check
########################################
echo ""
echo -e "${GREEN}=== Installation Complete ===${NC}"
echo "Node  : $(node -v)"
echo "npm   : $(npm -v)"
echo "pnpm  : $(pnpm -v)"
echo "yarn  : $(yarn -v)"

echo ""
echo -e "${BLUE}Ready to code! Go into the 'jam-game' folder and run 'npm run dev'${NC}"
