# 🏗️ Архітектура VS Code Extension

## Загальна структура

```
┌─────────────────────────────────────────────────────────┐
│           VS Code Extension                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │        Extension (extension.ts)                 │   │
│  │  - Ініціалізація                               │   │
│  │  - Реєстрація команд                           │   │
│  │  - Setup UI панелі                             │   │
│  └────────────────┬────────────────────────────────┘   │
│                   │                                    │
│     ┌─────────────┼─────────────┐                      │
│     ▼             ▼             ▼                      │
│  ┌─────┐  ┌──────────┐  ┌──────────────┐              │
│  │ UI  │  │ Commands │  │ Services     │              │
│  └─────┘  └──────────┘  └──────────────┘              │
│     │         │              │                        │
│     │    ┌────┼──────────┐    │                        │
│     │    │    │          │    │                        │
│     │    ▼    ▼          ▼    ▼                        │
│     │  Create Branch   Git Service                    │
│     │  Deploy          Version Service                │
│     │  Update Docs     Changelog Service              │
│     │  Merge to Master UI Service                      │
│     │  Push                                            │
│     │                                                  │
│     └────► VS Code API ◄─────────────────┘            │
│            & Terminal                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
         │                          │
         ▼                          ▼
    ┌─────────────┐          ┌─────────────┐
    │ Git & Shell │          │ File System │
    │ Commands    │          │ Operations  │
    └─────────────┘          └─────────────┘
```

## Рівні архітектури

### 1. **UI Layer** (Terminal + WebView)

- Левла панель з кнопками
- Вхідні поля для ввода версії
- Логування операцій
- Progress індикатори

### 2. **Command Layer**

- `createBranch.ts` - Створення нової гілки
- `deploy.ts` - Деплой версії
- `updateDocs.ts` - Оновлення документації
- `mergeToMaster.ts` - Merge з CHANGELOG
- `push.ts` - Push змін

### 3. **Service Layer**

- `git.service.ts` - Git операції (clone, checkout, commit, push)
- `version.service.ts` - Управління версіями
- `changelog.service.ts` - Генерація CHANGELOG
- `ui.service.ts` - UI компоненти та діалоги

### 4. **Utils Layer**

- `logger.ts` - Логування з кольорами
- Error handling
- Path utilities

## Data Flow

### Сценарій: Створення нової гілки

```
User clicks "Create Branch"
    │
    ▼
Check: Is current branch MASTER? ✓ (REQUIRED!)
    │
    ├─ NOT master? ❌
    │  └─ Show error: "Can only create version from master"
    │
    ▼
Get current version from package.json (e.g., 1.0.1)
    │
    ▼
Ask user: Select change type
    │
    ├─ MAJOR (1.0.1 → 2.0.0)
    ├─ MINOR (1.0.1 → 1.1.0)
    └─ PATCH (1.0.1 → 1.0.2)
    │
    ▼
Calculate new version
    │
    ├─ MAJOR: X+1, Y=0, Z=0
    ├─ MINOR: Y+1, Z=0
    └─ PATCH: Z+1
    │
    ▼
Show preview: "Create v{NEW_VERSION}?" + Confirm
    │
    ▼
createBranchWithVersion() ← Version Service + Git Service
    │
    ├─ Create branch in main repo
    │   └─ git checkout -b v{NEW_VERSION}
    │
    ├─ Create branch in submodule
    │   └─ cd src/validator && git checkout -b v{NEW_VERSION}
    │
    ├─ Update package.json version (both repos)
    │   └─ 1.0.1 → {NEW_VERSION}
    │
    ├─ Git commit in both repos
    │   └─ "chore: Create v{NEW_VERSION}"
    │
    ▼
UI: Update status "Version v{NEW_VERSION} created successfully"
    │
    ▼
Show available versions for routing
```

**Семантичне версіонування (SemVer):**

- Format: **vX.Y.Z**
  - X = MAJOR (breaking changes)
  - Y = MINOR (new features, backward compatible)
  - Z = PATCH (bug fixes)

### Сценарій: Merge to Master

```
User clicks "Merge to Master"
    │
    ▼
Get current branch version
    │
    ▼
Generate CHANGELOG
    └─ Read commits since master
    └─ Format with version number
    └─ Save to CHANGELOG.md
    │
    ▼
Commit CHANGELOG in current branch
    │
    ▼
Checkout master
    │
    ▼
Merge current branch
    │
    ├─ In main repo
    ├─ In submodule
    │
    ▼
UI: Confirm success
```

## Git Integration

### Операції з Git

```typescript
// Git Service повинен підтримувати:

// 1. Branch operations
checkoutBranch(branch: string)
createBranch(branch: string)
getCurrentBranch(): string
listBranches(): string[]

// 2. Submodule operations
updateSubmodule()
checkoutSubmoduleBranch(branch: string)

// 3. Commit operations
commit(message: string, files?: string[])
getCommitsSince(fromBranch: string): Commit[]

// 4. Push/Pull
push(branch: string)
pull()

// 5. File operations
getModifiedFiles(): string[]
stageFiles(files: string[])
```

## Configuration

Extension читає конфігурацію з `package.json`:

```json
## Semantic Versioning (SemVer) Strategy

### Version Format
```

vX.Y.Z
│ │ └─ PATCH (bug fixes, backward compatible)
│ └─── MINOR (new features, backward compatible)
└───── MAJOR (breaking changes)

````

### Version Creation Rules

| Current | Action | New Version | Allowed From |
|---------|--------|-------------|--------------|
| 1.0.0 | PATCH | 1.0.1 | Any branch ✅ |
| 1.0.0 | MINOR | 1.1.0 | master only ✅ |
| 1.0.0 | MAJOR | 2.0.0 | master only ✅ |

### Version Validation

```typescript
// Version Service должен проверять:

validateNewVersion(newVersion: string, currentVersion: string): {
  isValid: boolean
  error?: string
  incrementType?: 'MAJOR' | 'MINOR' | 'PATCH'
}

// Examples:
// 1.0.0 → 1.0.1 ✅ (PATCH)
// 1.0.0 → 1.1.0 ✅ (MINOR)
// 1.0.0 → 2.0.0 ✅ (MAJOR)
// 1.0.0 → 1.0.2 ❌ (skip 1.0.1)
// 1.0.0 → 1.0.0 ❌ (same version)
// 1.0.0 → 1.2.0 ❌ (must increment Y by 1)
````

### Version Storage

- **Main repo:** `pdf-validator/package.json` version field
- **Submodule:** `src/validator/package.json` version field
- **Both must be synchronized!**

### Version Branching

```
master (v1.0.0)
  │
  ├─ Create MINOR
  │   └─ v1.1.0 branch (both repos)
  │       └─ Features develop
  │           └─ Merge → master (master becomes v1.1.0)
  │
  └─ Create PATCH
      └─ v1.0.1 branch (both repos)
          └─ Hotfixes
              └─ Merge → master (master stays v1.0.0 or updates)
```

## Configuration Structure

```json
{
  "pdf-validator": {
    "mainRepo": "/path/to/pdf-validator",
    "submodule": "src/validator",
    "versions": {
      "format": "v{MAJOR}.{MINOR}.{PATCH}",
      "routing": ["v1.0.0", "v1.0.1", "v1.1.0"],
      "currentMaster": "1.0.0"
    }
  }
}
```

```

## Error Handling

```

Try Operation
│
├─ Success → Show notification
│
└─ Error →
├─ Log error with context
├─ Show error dialog
├─ Suggest fix (if available)
└─ Rollback if necessary

```

## Performance Considerations

1. **Async/Await** - Всі Git операції асинхронні
2. **Caching** - Кешування branch lists
3. **Progress** - Показування ходу довгих операцій
4. **Cancellation** - Можливість скасувати операцію

## Security

1. **SSH Keys** - Використовується як у workflows
2. **No Passwords** - Тільки SSH та GitHub tokens
3. **File Permissions** - Правильні дозволи для скриптів
4. **Input Validation** - Валідація всіх вводів користувача

## Testing

```

tests/
├── unit/
│ ├── version.service.test.ts
│ ├── git.service.test.ts
│ └── changelog.service.test.ts
└── integration/
└── commands.test.ts

```

## Deployment

1. Local test: `npm run test`
2. Compile: `npm run compile`
3. Package: `vsce package`
4. Publish: `vsce publish`

---

**Версія:** 1.0.0
```
