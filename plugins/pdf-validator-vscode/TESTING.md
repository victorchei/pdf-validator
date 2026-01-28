# PDF Validator Extension - Testing & Automation

## ✅ Automated Testing Suite

### Test Coverage

1. **Unit Tests** (`version.service.test.ts`)
   - ✅ Version parsing (with/without 'v' prefix)
   - ✅ Version formatting
   - ✅ Version calculation (MAJOR/MINOR/PATCH)
   - ✅ Version format validation
   - ✅ Master-only enforcement
   - ✅ Version comparison

2. **Integration Tests** (`integration.test.ts`)
   - ✅ Extension activation
   - ✅ Command registration
   - ✅ Tree view registration
   - ✅ Status bar creation

3. **Scenario Tests** (`scenarios.test.ts`)
   - ✅ PATCH from feature branch
   - ✅ MINOR from master only
   - ✅ MAJOR from master only
   - ✅ Prevention of MINOR/MAJOR from non-master
   - ✅ Version increment sequences
   - ✅ Version format validation
   - ✅ Version comparison

### Running Tests

#### Automated Test Script

```bash
./test.sh
```

This will:

1. Install dependencies (if needed)
2. Compile TypeScript
3. Run all tests
4. Show summary

#### Manual Testing

**Run all tests:**

```bash
npm test
```

**Run unit tests only:**

```bash
npm run test:unit
```

**Watch mode:**

```bash
npm run test:watch
```

**Debug in VS Code:**

- Press F5
- Select "Extension Tests"

### Test Results

Expected output:

```
🧪 Running PDF Validator Extension Tests...

✅ Version parsing tests (6/6)
✅ Version calculation tests (5/5)
✅ Master-only validation tests (4/4)
✅ Scenario tests (8/8)
✅ Integration tests (5/5)

✅ All 28 tests passed!
```

## 🔄 Continuous Integration

### GitHub Actions (Future)

```yaml
# .github/workflows/test.yml
name: Test Extension
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
```

## 🐛 Debug Configuration

Launch configurations in `.vscode/launch.json`:

1. **Run Extension** - Launch extension in development mode
2. **Extension Tests** - Run tests with debugger

## 📊 Test Scenarios

### Scenario 1: PATCH from any branch ✅

```
Current: v1.0.0
Branch: feature/fix-bug
Action: Create PATCH
Result: v1.0.1 ✅
```

### Scenario 2: MINOR from master ✅

```
Current: v1.0.0
Branch: master
Action: Create MINOR
Result: v1.1.0 ✅
```

### Scenario 3: MAJOR from master ✅

```
Current: v1.0.0
Branch: master
Action: Create MAJOR
Result: v2.0.0 ✅
```

### Scenario 4: MINOR from feature branch ❌

```
Current: v1.0.0
Branch: feature/new-feature
Action: Create MINOR
Result: Error - "MINOR version can only be created from master branch"
```

### Scenario 5: Version sequences ✅

```
v1.0.0 → PATCH → v1.0.1
v1.0.1 → PATCH → v1.0.2
v1.0.2 → MINOR → v1.1.0
v1.1.0 → PATCH → v1.1.1
v1.1.1 → MAJOR → v2.0.0
```

## 🎯 Validation Matrix

| Test               | Expected | Status |
| ------------------ | -------- | ------ |
| Parse "v1.2.3"     | {1,2,3}  | ✅     |
| Parse "1.2.3"      | {1,2,3}  | ✅     |
| Parse "invalid"    | null     | ✅     |
| v1.0.0 + PATCH     | v1.0.1   | ✅     |
| v1.0.0 + MINOR     | v1.1.0   | ✅     |
| v1.0.0 + MAJOR     | v2.0.0   | ✅     |
| PATCH from feature | allowed  | ✅     |
| MINOR from master  | allowed  | ✅     |
| MINOR from feature | blocked  | ✅     |
| MAJOR from master  | allowed  | ✅     |
| MAJOR from develop | blocked  | ✅     |

## 📝 Adding New Tests

1. Create test file in `src/test/`
2. Use Mocha `suite` and `test` structure
3. Import assertions: `import * as assert from 'assert'`
4. Run tests: `npm test`

Example:

```typescript
import * as assert from 'assert'

suite('My Test Suite', () => {
  test('should do something', () => {
    assert.strictEqual(1 + 1, 2)
  })
})
```

## 🚀 Pre-Release Checklist

- [ ] Run `./test.sh` - all tests pass
- [ ] Run `npm run compile` - no errors
- [ ] Run extension in VS Code (F5) - activates correctly
- [ ] Test command: Create New Version
- [ ] Test status bar - shows version
- [ ] Test tree view - shows in sidebar
- [ ] Check keyboard shortcut: Cmd+Shift+V V

## 🔍 Troubleshooting

### Tests not running

```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run compile
npm test
```

### Extension not loading in tests

```bash
# Check extension ID in package.json
# Should match: victorchei.pdf-validator-helper
```

### Timeout errors

```bash
# Increase timeout in test files
mocha.timeout(10000) // 10 seconds
```
