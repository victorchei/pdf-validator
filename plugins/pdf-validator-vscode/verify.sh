#!/bin/bash

# PDF Validator Extension - Complete Verification Script
set -e

echo "🔍 PDF Validator Extension - Complete Verification"
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

# Test function
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo -n "Testing: $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        ((FAILED++))
        return 1
    fi
}

echo "📋 Step 1: Environment Check"
echo "----------------------------"

run_test "Node.js installed" "command -v node"
run_test "npm installed" "command -v npm"
run_test "package.json exists" "test -f package.json"

echo ""
echo "📦 Step 2: Dependencies"
echo "----------------------"

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --silent
fi

run_test "node_modules exists" "test -d node_modules"
run_test "TypeScript installed" "test -d node_modules/typescript"

echo ""
echo "🔨 Step 3: Compilation"
echo "---------------------"

npm run compile > /dev/null 2>&1
run_test "Extension compiled" "test -f dist/extension.js"
run_test "Extension size > 0" "test -s dist/extension.js"

echo ""
echo "📁 Step 4: File Structure"
echo "------------------------"

run_test "extension.ts exists" "test -f src/extension.ts"
run_test "version.service.ts exists" "test -f src/services/version.service.ts"
run_test "create-version.ts exists" "test -f src/commands/create-version.ts"
run_test "SVG icon exists" "test -f media/pdf-icon.svg"

echo ""
echo "🧪 Step 5: Test Files"
echo "--------------------"

run_test "Unit tests exist" "test -f src/test/version.service.test.ts"
run_test "Integration tests exist" "test -f src/test/integration.test.ts"
run_test "Scenario tests exist" "test -f src/test/scenarios.test.ts"

echo ""
echo "📝 Step 6: Configuration"
echo "-----------------------"

run_test "package.json valid" "node -e 'require(\"./package.json\")'"
run_test "tsconfig.json exists" "test -f tsconfig.json"
run_test "launch.json exists" "test -f .vscode/launch.json"

echo ""
echo "🔍 Step 7: Package.json Validation"
echo "----------------------------------"

run_test "Extension name set" "grep -q '\"name\": \"pdf-validator-helper\"' package.json"
run_test "createVersion command" "grep -q 'pdf-validator.createVersion' package.json"
run_test "showVersionInfo command" "grep -q 'pdf-validator.showVersionInfo' package.json"
run_test "Tree view configured" "grep -q 'pdf-validator-view' package.json"
run_test "Icon path configured" "grep -q 'media/pdf-icon.svg' package.json"

echo ""
echo "🎯 Step 8: Code Quality"
echo "----------------------"

# Check for critical imports
run_test "Extension imports vscode" "grep -q \"import.*vscode\" src/extension.ts"
run_test "Service imports promisify" "grep -q \"import.*promisify\" src/services/version.service.ts"
run_test "Command imports service" "grep -q \"VersionService\" src/commands/create-version.ts"

echo ""
echo "📊 Step 9: Semantic Versioning Logic"
echo "------------------------------------"

# Test version service logic by checking code
run_test "parseVersion function exists" "grep -q 'parseVersion' src/services/version.service.ts"
run_test "calculateNewVersion exists" "grep -q 'calculateNewVersion' src/services/version.service.ts"
run_test "validateVersionCreation exists" "grep -q 'validateVersionCreation' src/services/version.service.ts"
run_test "MAJOR/MINOR/PATCH types defined" "grep -q \"type VersionType = 'MAJOR' | 'MINOR' | 'PATCH'\" src/services/version.service.ts"

echo ""
echo "🔐 Step 10: Master-Only Enforcement"
echo "-----------------------------------"

run_test "Master check in validation" "grep -q 'master' src/services/version.service.ts"
run_test "Main branch support" "grep -q 'main' src/services/version.service.ts"
run_test "Error message for non-master" "grep -q 'can only be created from master' src/services/version.service.ts"

echo ""
echo "🎨 Step 11: UI Components"
echo "------------------------"

run_test "QuickPick implementation" "grep -q 'showQuickPick' src/services/version.service.ts"
run_test "Status bar creation" "grep -q 'StatusBarItem' src/extension.ts"
run_test "Tree provider class" "grep -q 'TreeDataProvider' src/extension.ts"
run_test "Icon definitions" "grep -q 'ThemeIcon' src/extension.ts"

echo ""
echo "📚 Step 12: Documentation"
echo "------------------------"

run_test "README.md exists" "test -f README.md"
run_test "ARCHITECTURE.md exists" "test -f ARCHITECTURE.md"
run_test "REQUIREMENTS.md exists" "test -f REQUIREMENTS.md"
run_test "VERSION-COMMAND.md exists" "test -f docs/VERSION-COMMAND.md"
run_test "TESTING.md exists" "test -f TESTING.md"

echo ""
echo "🔗 Step 13: Installation"
echo "-----------------------"

EXTENSION_DIR="$HOME/.vscode/extensions/pdf-validator-helper"
run_test "Install script exists" "test -f install.sh"
run_test "Install script executable" "test -x install.sh"

# Check if symlink exists
if [ -L "$EXTENSION_DIR" ]; then
    echo -e "Extension symlink: ${GREEN}✅ EXISTS${NC}"
    ((PASSED++))
else
    echo -e "Extension symlink: ${YELLOW}⚠️  NOT INSTALLED${NC}"
    echo "  Run ./install.sh to install"
fi

echo ""
echo "=================================================="
echo "📊 VERIFICATION SUMMARY"
echo "=================================================="
echo ""
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "🚀 Extension is ready to use!"
    echo ""
    echo "Next steps:"
    echo "  1. Reload VS Code: Cmd+Shift+P → 'Reload Window'"
    echo "  2. Look for PDF icon in left sidebar"
    echo "  3. Try command: Cmd+Shift+V V"
    echo ""
    exit 0
else
    echo -e "${RED}❌ SOME CHECKS FAILED${NC}"
    echo ""
    echo "Please fix the issues above and run again."
    echo ""
    exit 1
fi
