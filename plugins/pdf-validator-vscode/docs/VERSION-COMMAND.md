# Version Creation Command

## Overview

The `pdf-validator.createVersion` command provides semantic versioning (SemVer) automation for version creation with strict validation rules and automatic version calculation.

## Command: Create New Version (SemVer)

**ID:** `pdf-validator.createVersion`  
**Keyboard Shortcut:** `Cmd+Shift+V V` (macOS) | `Ctrl+Shift+V V` (Windows/Linux)

## How It Works

### Step-by-Step Process

1. **Git Health Check** ✓
   - Verifies no uncommitted changes in working directory
   - Prevents version creation with dirty state
   - Error: "Git working directory has uncommitted changes"

2. **Branch Detection** ✓
   - Gets current branch name
   - Validates against version creation rules

3. **Version Reading** ✓
   - Reads current version from `package.json`
   - Verifies format is vX.Y.Z

4. **Version Type Selection** ✓
   - User selects: MAJOR (breaking) | MINOR (features) | PATCH (fixes)
   - QuickPick UI with descriptions
   - Color-coded for clarity

5. **Branch Validation** ✓
   - MAJOR/MINOR: Only from master branch ⚠️
   - PATCH: From any branch ✓
   - Shows error if attempting from wrong branch

6. **Version Calculation** ✓
   - Automatic SemVer increment based on type
   - Never manual entry - prevents errors
   - Examples:
     - v1.0.0 + MAJOR = v2.0.0
     - v1.0.0 + MINOR = v1.1.0
     - v1.0.0 + PATCH = v1.0.1

7. **Confirmation Dialog** ✓
   - Shows: `Create new PATCH version? v1.0.0 → v1.0.1`
   - User can confirm or cancel

8. **Branch Creation** ✓
   - Creates new git branch with version name (e.g., `v1.0.1`)
   - Updates both repos:
     - Main: `pdf-validator/package.json`
     - Submodule: `src/validator/package.json`

## Version Type Rules

### PATCH (🔵 Bug Fixes)

- **When to use:** Hotfixes, bug fixes, patches
- **Allowed from:** Any branch
- **Increment:** v1.0.0 → v1.0.1
- **Master requirement:** ❌ No

### MINOR (🟢 New Features)

- **When to use:** New features, backward compatible
- **Allowed from:** master branch only ⚠️
- **Increment:** v1.0.0 → v1.1.0
- **Master requirement:** ✅ Yes

### MAJOR (🔴 Breaking Changes)

- **When to use:** Breaking changes, major upgrades
- **Allowed from:** master branch only ⚠️
- **Increment:** v1.0.0 → v2.0.0
- **Master requirement:** ✅ Yes

## SemVer Format

```
vX.Y.Z
 │ │ └─ PATCH (incremented for bug fixes)
 │ └─── MINOR (incremented for new features, PATCH resets to 0)
 └───── MAJOR (incremented for breaking changes, MINOR and PATCH reset to 0)
```

### Examples

| From   | Type  | To     | Valid |
| ------ | ----- | ------ | ----- |
| v1.0.0 | PATCH | v1.0.1 | ✓     |
| v1.0.0 | MINOR | v1.1.0 | ✓     |
| v1.0.0 | MAJOR | v2.0.0 | ✓     |
| v1.0.1 | PATCH | v1.0.2 | ✓     |
| v1.1.0 | PATCH | v1.1.1 | ✓     |
| v1.1.0 | MINOR | v1.2.0 | ✓     |
| v2.0.0 | MAJOR | v3.0.0 | ✓     |

## Error Handling

### Common Errors

#### ❌ Not on master for MAJOR/MINOR

```
Error: MINOR version can only be created from master branch.
Current branch: feature/user-auth
```

**Solution:** Switch to master branch first

```bash
git checkout master
```

#### ❌ Uncommitted changes

```
Error: Git working directory has uncommitted changes.
Please commit or stash them first.
```

**Solution:** Commit or stash changes

```bash
git add .
git commit -m "WIP: feature description"
# OR
git stash
```

#### ❌ Invalid version format

```
Error: Invalid version format in package.json
```

**Solution:** Ensure package.json has valid version: `"version": "1.0.0"`

## Status Bar Integration

The extension shows current version in status bar:

- **Display:** `$(package) v1.0.0 (master)`
- **Click to show:** Full version and branch info
- **Auto-updates:** When package.json changes

## Workflow Examples

### Creating a Hotfix (PATCH)

```bash
# Any branch
$ git checkout hotfix/security-issue

# Run command: Cmd+Shift+V V
# Select: 🔵 PATCH
# Confirm: v1.0.0 → v1.0.1

# Result: new branch 'v1.0.1' with updated package.json
$ git checkout v1.0.1
$ git log --oneline -1
# ab12345 Version bump: v1.0.1
```

### Creating a Feature Release (MINOR)

```bash
# Master only
$ git checkout master

# Run command: Cmd+Shift+V V
# Select: 🟢 MINOR
# Confirm: v1.0.1 → v1.1.0

# Result: new branch 'v1.1.0' with updated package.json
$ git checkout v1.1.0
```

### Creating a Major Release (MAJOR)

```bash
# Master only
$ git checkout master

# Run command: Cmd+Shift+V V
# Select: 🔴 MAJOR
# Confirm: v1.1.0 → v2.0.0

# Result: new branch 'v2.0.0' with updated package.json
$ git checkout v2.0.0
```

## Integration with Other Commands

After creating a version, you can:

1. **Push to remote:**
   - Run: `pdf-validator.push` (Cmd+Shift+V P)
   - Pushes new version branch

2. **Deploy:**
   - Run: `pdf-validator.deploy` (Cmd+Shift+V D)
   - GitHub Actions workflow builds and deploys to `/vX.Y.Z/`

3. **Update Docs:**
   - Run: `pdf-validator.updateDocs` (Cmd+Shift+V U)
   - Syncs documentation for version

4. **Merge to Master:**
   - Run: `pdf-validator.mergeToMaster` (Cmd+Shift+V M)
   - Merges version back to master with CHANGELOG update

## Configuration

The version service uses:

- **Main repo version:** `package.json` in workspace root
- **Submodule version:** `src/validator/package.json`
- **Both must be synchronized**

## Best Practices

### ✓ Do

- Always create versions from clean git state
- Use MAJOR for breaking changes only
- Use MINOR for new features
- Use PATCH for bug fixes
- Create MAJOR/MINOR from master branch only
- Test version before pushing to remote

### ✗ Don't

- Manually edit version numbers - use this command
- Skip the version type selection
- Create MAJOR/MINOR from feature branches
- Mix manual and automatic versioning
- Leave uncommitted changes when creating versions

## Troubleshooting

### Version not updating in status bar

- Save `package.json` file
- Status bar should update within 1-2 seconds
- Manual refresh: Click status bar item

### Error: "No workspace folder found"

- Ensure workspace is open in VS Code
- File → Open Folder → Select pdf-validator root

### Error: "Failed to get current version"

- Check `package.json` exists in workspace root
- Verify version field format: `"version": "1.0.0"`
- No "v" prefix in package.json (only in branch names)

## Related Documentation

- [Architecture](./ARCHITECTURE.md) - Technical design
- [Requirements](./REQUIREMENTS.md) - Complete versioning requirements
- [Installation](./INSTALLATION.md) - Setup instructions
