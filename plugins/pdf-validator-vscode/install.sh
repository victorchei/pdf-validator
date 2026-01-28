#!/bin/bash

# PDF Validator VS Code Extension - Installation Script
# This script installs the extension in development mode

set -e

echo "🚀 Installing PDF Validator VS Code Extension..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the extension directory"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    echo "Please install Node.js and npm first"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Compile TypeScript
echo "🔨 Compiling TypeScript..."
echo "   This creates dist/extension.js from src/extension.ts"
echo "   Required to fix 'n.apply is not a function' error"
npm run compile

if [ ! -f "dist/extension.js" ]; then
    echo "❌ Error: Compilation failed - dist/extension.js not created"
    exit 1
fi

echo "   ✅ Compiled: dist/extension.js ($(du -h dist/extension.js | cut -f1))"

# Create symlink to VS Code extensions folder
EXTENSION_DIR="$HOME/.vscode/extensions/pdf-validator-helper"

echo "🔗 Creating symlink to VS Code extensions folder..."

# Remove existing symlink if it exists
if [ -L "$EXTENSION_DIR" ]; then
    echo "   Removing existing symlink..."
    rm "$EXTENSION_DIR"
fi

# Create new symlink
ln -s "$(pwd)" "$EXTENSION_DIR"

echo ""
echo "✅ Installation complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Reload VS Code (Cmd+Shift+P → 'Reload Window')"
echo "   2. Check extension is loaded: Cmd+Shift+P → 'Extensions'"
echo "   3. Try the command: Cmd+Shift+P → 'Create New Version'"
echo ""
echo "⌨️  Keyboard shortcuts:"
echo "   • Create Version:     Cmd+Shift+V V"
echo "   • Deploy:            Cmd+Shift+V D"
echo "   • Push:              Cmd+Shift+V P"
echo "   • Merge to Master:   Cmd+Shift+V M"
echo ""
echo "📚 Documentation: docs/VERSION-COMMAND.md"
echo ""
