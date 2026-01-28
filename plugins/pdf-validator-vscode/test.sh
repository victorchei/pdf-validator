#!/bin/bash

# PDF Validator Extension - Automated Test Runner
set -e

echo "🧪 Running PDF Validator Extension Tests..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Compile TypeScript
echo "🔨 Compiling TypeScript..."
npm run compile

# Run unit tests
echo ""
echo "🧪 Running unit tests..."
npm test 2>&1 | tee test-results.log

# Check test results
if [ "${PIPESTATUS[0]}" -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
    echo ""
    echo "📊 Test Summary:"
    grep -E "(passing|failing)" test-results.log || echo "Tests completed successfully"
    rm -f test-results.log
    exit 0
else
    echo ""
    echo "❌ Some tests failed!"
    echo ""
    echo "📋 Check test-results.log for details"
    exit 1
fi
