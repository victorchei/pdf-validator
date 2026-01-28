#!/bin/bash

# Setup script to install git hooks
# Run this once after cloning the repository

echo "🔧 Setting up Git hooks..."

# Configure git to use custom hooks directory
git config core.hooksPath .githooks

echo "✅ Git hooks installed successfully!"
echo ""
echo "Pre-commit hook will now automatically generate versions.json"
echo "when you commit changes to package.json or generate-versions.js"
