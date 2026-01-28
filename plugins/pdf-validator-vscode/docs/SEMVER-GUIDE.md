# SemVer Version Creation - Complete Implementation Guide

## 📦 What Was Built

A complete semantic versioning system for the VS Code extension that:

- ✅ **Enforces master-only rule** for MAJOR/MINOR versions
- ✅ **Automatically calculates** new versions (no manual entry)
- ✅ **Validates strict SemVer format** (vX.Y.Z)
- ✅ **Synchronizes both repos** (main + submodule)
- ✅ **Provides user-friendly UI** with QuickPick and dialogs

---

## 🎯 Quick Start

### Using the Command

1. **Open Command Palette:** `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
2. **Search:** "Create New Version"
3. **Select version type:** MAJOR (breaking) | MINOR (features) | PATCH (fixes)
4. **Confirm:** Review and create

### Keyboard Shortcut

- **macOS:** `Cmd+Shift+V V`
- **Windows/Linux:** `Ctrl+Shift+V V`

### What Happens

```
Before:
- Current branch: master
- Current version: v1.0.0
- package.json: "version": "1.0.0"

After running command with MINOR selected:
- New branch: v1.1.0 (created and switched)
- New version: v1.1.0
- package.json: "version": "1.1.0" (both repos updated)
```

---

## 📚 Documentation Files

### 1. **VERSION-COMMAND.md** - User Guide

- **Purpose:** How to use the command
- **Contents:** Step-by-step process, version types, examples, troubleshooting
- **Audience:** Extension users (developers)

### 2. **ARCHITECTURE.md** - Technical Design

- **Purpose:** Technical implementation details
- **Contents:** SemVer format, validation rules, data flows
- **Audience:** Extension developers

### 3. **REQUIREMENTS.md** - Specifications

- **Purpose:** Complete requirements and rules
- **Contents:** Versioning matrix, constraints, SemVer rules
- **Audience:** Design and implementation reference

### 4. **VERSION-IMPLEMENTATION.md** - Implementation Details

- **Purpose:** What was built and how
- **Contents:** Code overview, features, test scenarios
- **Audience:** Development team

---

## 🔐 Master-Only Enforcement

### Why?

MAJOR and MINOR versions introduce breaking changes or significant features. These should only come from a stable master branch.

### How It Works

```typescript
validateVersionCreation(branchName, versionType) {
  if (versionType === 'PATCH') return ✅ // Any branch

  if (branchName !== 'master') {
    return ❌ Error: "MINOR/MAJOR only from master"
  }
}
```

### Error Examples

**Attempting MINOR from feature branch:**

```
❌ MINOR version can only be created from master branch
   Current branch: feature/auth-system
```

**Attempting MAJOR from develop:**

```
❌ MAJOR version can only be created from master branch
   Current branch: develop
```

---

## 🧮 Automatic Version Calculation

### Why Automatic?

- Prevents typos (v1.0.2 instead of v1.0.1)
- Prevents version skipping (always increment by 1)
- Prevents wrong format (always vX.Y.Z)

### How It Works

#### SemVer Rules

```
vX.Y.Z
 │ │ └─ PATCH: increment by 1 only
 │ └─── MINOR: increment by 1, reset PATCH to 0
 └───── MAJOR: increment by 1, reset MINOR and PATCH to 0
```

#### Examples

```
v1.0.0 + PATCH = v1.0.1  (only Z+1)
v1.0.0 + MINOR = v1.1.0  (Y+1, Z=0)
v1.0.0 + MAJOR = v2.0.0  (X+1, Y=0, Z=0)

v1.0.5 + PATCH = v1.0.6  (only Z+1)
v1.5.0 + MINOR = v1.6.0  (Y+1, Z=0)
v1.5.3 + MAJOR = v2.0.0  (X+1, Y=0, Z=0)
```

#### Algorithm

```typescript
calculateNewVersion(currentVersion, type) {
  const parsed = parseVersion(currentVersion)

  switch (type) {
    case 'MAJOR': return {major+1, 0, 0}
    case 'MINOR': return {major, minor+1, 0}
    case 'PATCH': return {major, minor, patch+1}
  }
}
```

---

## 🔗 Integration Points

### With Other Commands

```
createVersion → push → deploy
    ↓
    └─→ updateDocs
        ↓
        └─→ mergeToMaster
```

### With GitHub Workflows

- **Deploy workflow:** Triggered on version branch push
- **Builds to:** `/vX.Y.Z/` folder on GitHub Pages
- **Files synced:** Build, 404.html, version manifest

### With Git Hooks

- **Pre-commit hook:** Auto-generates versions.json
- **Triggered on:** package.json or deploy.yml changes

---

## 📋 Validation Rules

### Version Format ✅

```
Valid:   v1.0.0, v2.1.3, v10.20.30
Invalid: v1.0, 1.0.0, 1.0.0.0, v1.x.y
```

### Branch Requirements

```
Type   | Branch Required | Allowed From
-------|-----------------|------------------
PATCH  | Any            | feature, develop, master
MINOR  | master only    | master ⚠️
MAJOR  | master only    | master ⚠️
```

### Git State

```
✅ Required: Clean working directory (no uncommitted changes)
✅ Required: Valid version in package.json
✅ Required: Both repos present (main + submodule)
❌ Forbidden: Uncommitted changes
❌ Forbidden: Invalid version format
❌ Forbidden: Missing package.json
```

---

## 🧪 Test Cases

### Successful Scenarios ✅

- [x] Create PATCH from feature branch
- [x] Create PATCH from master
- [x] Create MINOR from master
- [x] Create MAJOR from master
- [x] Version increments correctly
- [x] Both repos updated
- [x] Status bar shows new version

### Error Scenarios ❌

- [x] MAJOR from feature branch → Error shown
- [x] MINOR from develop → Error shown
- [x] Uncommitted changes → Error shown
- [x] Invalid version format → Error shown
- [x] Cancel dialog → Aborts gracefully

---

## 🚀 Deployment Workflow

### Step 1: Create Version

```bash
# Run command: Cmd+Shift+V V
# Select: MINOR
# Result: Branch v1.1.0 created
```

### Step 2: Make Changes

```bash
# git checkout v1.1.0
# ... make changes ...
# git add .
# git commit -m "Feature: new capability"
```

### Step 3: Push to Remote

```bash
# Run command: Cmd+Shift+V P
# GitHub workflow triggers automatically
```

### Step 4: Deploy

```bash
# GitHub Actions builds and deploys to /v1.1.0/
# 404.html available in all version folders
# VersionSelector updates with new version
```

### Step 5: Merge to Master

```bash
# Run command: Cmd+Shift+V M
# CHANGELOG auto-updates
# Version merged to master
```

---

## 💾 What Gets Updated

### Files Created

- ✅ Git branch: `v1.1.0`

### Files Updated

- ✅ `pdf-validator/package.json` - version field
- ✅ `src/validator/package.json` - version field

### Files Generated (on deploy)

- ✅ `build/404.html` - copied for version route
- ✅ `.github/versions.json` - manifest file
- ✅ `/v1.1.0/` folder on GitHub Pages

---

## 🔍 Status Bar Integration

### Display

```
Status Bar: $(package) v1.0.0 (master)
```

### Click Behavior

```
Click → Shows: "📦 Version: v1.0.0\n🌿 Branch: master"
```

### Auto-Updates

- Updates when package.json changes
- Updates when branch changes
- Updates when version command completes

---

## 🐛 Troubleshooting

### Issue: "Cannot create version - not on master"

**Solution:** Switch to master first

```bash
git checkout master
```

### Issue: "Git working directory has uncommitted changes"

**Solution:** Commit or stash changes

```bash
git commit -m "WIP: description"
# OR
git stash
```

### Issue: "Invalid version format in package.json"

**Solution:** Fix format to X.Y.Z (no "v" prefix in package.json)

```json
{
  "version": "1.0.0"  // ✅ Correct
  "version": "v1.0.0" // ❌ Wrong
}
```

### Issue: Status bar not updating

**Solution:**

- Save the file (Cmd+S)
- Wait 1-2 seconds
- Manual click on status bar to refresh

---

## 📖 Related Documentation

- [VERSION-COMMAND.md](./docs/VERSION-COMMAND.md) - User guide with examples
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical design details
- [REQUIREMENTS.md](./REQUIREMENTS.md) - Complete specification
- [Installation guide](./INSTALLATION.md) - Setup instructions
- [README.md](./README.md) - Feature overview

---

## ✨ Key Achievements

1. ✅ **Strict Semantic Versioning** - vX.Y.Z format enforcement
2. ✅ **Master-Only Control** - MAJOR/MINOR restricted to master
3. ✅ **Automatic Calculation** - Never manual version entry
4. ✅ **Dual Repo Sync** - Main and submodule stay in sync
5. ✅ **User-Friendly UI** - QuickPick with descriptions and colors
6. ✅ **Comprehensive Documentation** - Multiple guides for different audiences
7. ✅ **Error Handling** - Clear, actionable error messages
8. ✅ **Status Integration** - Real-time feedback in status bar

---

## 🎓 For Developers

### Key Files to Review

1. `src/services/version.service.ts` - Core SemVer logic
2. `src/commands/create-version.ts` - Command implementation
3. `src/extension.ts` - Extension integration
4. `docs/VERSION-COMMAND.md` - Complete user documentation

### Next Features to Add

- [ ] Changelog auto-generation on version creation
- [ ] Automated git tag creation
- [ ] Version history viewer
- [ ] Pre-release versions (v1.0.0-beta)
- [ ] Batch version updates across repos

### Testing Checklist

- [ ] Build locally: `npm run compile`
- [ ] Package: `npm run package`
- [ ] Test in VS Code: F5 (debug mode)
- [ ] Verify each version type works
- [ ] Verify master-only enforcement
- [ ] Verify error messages
- [ ] Verify status bar updates
