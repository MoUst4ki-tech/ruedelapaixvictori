#!/usr/bin/env bash

set -e

echo "Setup Environment Frontend (Node / React / Next) for Mac"

########################################
# Utils
########################################
command_exists () {
  command -v "$1" >/dev/null 2>&1
}

########################################
# Homebrew (Mac Package Manager)
########################################
if ! command_exists brew; then
  echo "Homebrew is not installed. It is recommended for development on Mac."
  echo "Please install it manually from https://brew.sh/ or run:"
  echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
  echo "Continuing without Homebrew check..."
else
  echo "Updating Homebrew..."
  brew update
fi

########################################
# Git
########################################
if ! command_exists git; then
  echo "Installing git..."
  if command_exists brew; then
    brew install git
  else
    echo "Please install Git manually or run 'xcode-select --install'"
    exit 1
  fi
fi

########################################
# NVM + Node
########################################
if [ ! -d "$HOME/.nvm" ]; then
  echo "Installing NVM..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi

export NVM_DIR="$HOME/.nvm"
# Load NVM (try standard locations)
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "Installing Node LTS..."
nvm install --lts
nvm use --lts
nvm alias default 'lts/*'

########################################
# Global tools
########################################
echo "Installing global tools..."

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
echo "Installation complete:"
echo "Node  : $(node -v)"
echo "npm   : $(npm -v)"
echo "pnpm  : $(pnpm -v)"
echo "yarn  : $(yarn -v)"

echo ""
echo "Ready to code! Go to the project folder and run 'npm run dev'"
