#!/usr/bin/env bash

set -e

echo "Setup environnement Frontend (Node / React / Next)"

########################################
# Utils
########################################
command_exists () {
  command -v "$1" >/dev/null 2>&1
}

########################################
# Git
########################################
if ! command_exists git; then
  echo "Installation git..."

  if command_exists pacman; then
    sudo pacman -Sy git --noconfirm
  elif command_exists apt; then
    sudo apt update && sudo apt install -y git
  fi
fi

########################################
# NVM + Node
########################################
if [ ! -d "$HOME/.nvm" ]; then
  echo "Installation NVM..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

echo "Installation Node LTS..."
nvm install --lts
nvm use --lts
nvm alias default 'lts/*'

########################################
# Global tools
########################################
echo "Installation outils globaux..."

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
echo "Installation terminée :"
echo "Node  : $(node -v)"
echo "npm   : $(npm -v)"
echo "pnpm  : $(pnpm -v)"
echo "yarn  : $(yarn -v)"

echo ""
echo " Ready to code ! Go in the project folder and run 'npm run dev'"
