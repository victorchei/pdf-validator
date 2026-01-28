#!/bin/bash

# Quick test script for PDF Validator Extension

echo "🧪 Testing PDF Validator Extension"
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from the extension directory"
    exit 1
fi

echo "📦 Step 1: Install dependencies"
npm install

echo ""
echo "🔨 Step 2: Compile extension"
npm run compile

echo ""
echo "✅ Step 3: Verify dist/extension.js exists"
if [ -f "dist/extension.js" ]; then
    SIZE=$(du -h dist/extension.js | cut -f1)
    echo "   ✓ dist/extension.js exists (${SIZE})"
else
    echo "   ✗ dist/extension.js NOT FOUND"
    exit 1
fi

echo ""
echo "📋 Step 4: Check package.json configuration"
MAIN=$(node -p "require('./package.json').main")
echo "   Main entry: ${MAIN}"

ACTIVATION=$(node -p "require('./package.json').activationEvents.join(', ')")
echo "   Activation: ${ACTIVATION}"

echo ""
echo "🎯 Next steps:"
echo "   1. Open VS Code"
echo "   2. Press Cmd+Shift+P"
echo "   3. Type 'Reload Window' and press Enter"
echo "   4. Check Developer Console (Cmd+Shift+P → 'Developer: Toggle Developer Tools')"
echo "   5. Look for '[createVersionCommand]' logs when clicking the button"
echo ""
echo "💡 To test manually:"
echo "   • Cmd+Shift+P → 'PDF Validator: Create New Version'"
echo "   • Or use shortcut: Cmd+Shift+V V"
echo ""

