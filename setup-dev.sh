#!/usr/bin/env bash

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Setup Environment Frontend (Node / React / Next) ===${NC}"

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
# Git
########################################
if ! command_exists git; then
  log_info "Installing git..."
  
  if command_exists pacman; then
    sudo pacman -Sy git --noconfirm
  elif command_exists apt; then
    sudo apt update && sudo apt install -y git
  elif command_exists dnf; then
    sudo dnf install -y git
  else
    log_error "Could not detect package manager. Please install git manually."
    exit 1
  fi
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
  log_error "Could not find nvm.sh. Please restart your terminal and try again."
  exit 1
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
