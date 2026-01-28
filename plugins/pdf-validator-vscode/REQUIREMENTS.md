# 📋 Вимоги до VS Code Extension

## Функціональні вимоги

### 1. Управління гілками

#### 1.1 Створення нової версії

- ✅ **ДОЗВОЛЕНО:** Створювати нову версію тільки з **master гілки**
- ✅ **Запит типу змін:**
  - `MAJOR` - Велика зміна (1.0.0 → 2.0.0)
  - `MINOR` - Нова функціональність (1.0.0 → 1.1.0)
  - `PATCH` - Виправлення багів (1.0.0 → 1.0.1)

#### 1.2 Процес створення версії

```
User: "Create Version"
  ├─ Check: Are we on master? ✓
  ├─ Get current version from package.json (e.g., 1.0.1)
  ├─ Ask: Select change type
  │   ├─ MAJOR? → 2.0.0
  │   ├─ MINOR? → 1.1.0
  │   └─ PATCH? → 1.0.2
  ├─ Show new version for confirmation
  ├─ Create branch v{NEW_VERSION} in pdf-validator ✓
  └─ Create branch v{NEW_VERSION} in validator submodule ✓
```

**Семантичне версіонування (SemVer):**

- **vX.Y.Z**
  - X = MAJOR (breaking changes)
  - Y = MINOR (new features, backward compatible)
  - Z = PATCH (bug fixes)

### 2. Деплой

- ✅ Деплоїти поточну гілку на GitHub Pages
- ✅ Генерувати versions.json при деплої
- ✅ Показувати статус деплою в UI

### 3. Оновлення документації

- ✅ Оновити всю документацію проекту (docs/)
- ✅ Оновити документацію submodule (src/validator/docs)
- ✅ Генерувати CHANGELOG автоматично

### 4. Merge до Master з CHANGELOG

- ✅ Перед merge:
  - Генерувати CHANGELOG для поточної версії
  - Добавити записи у CHANGELOG.md (main repo)
  - Добавити записи у CHANGELOG.md (submodule)
- ✅ Commit CHANGELOG у обидва репозиторії
- ✅ Merge гілки в master
- ✅ Синхронізувати submodule версію

### 5. Push операції

- ✅ Push поточної гілки в origin
- ✅ Push змін в submodule
- ✅ Показувати прогрес

---

## Нефункціональні вимоги

### Безпека

- ✅ Запитувати підтвердження перед деструктивними операціями
- ✅ Перевіряти статус git перед операціями
- ✅ Не допускати operations з брудним git tree (наявні незакомічені файли)

### Користувацький досвід

- ✅ Показувати прогрес операцій
- ✅ログування всіх операцій
- ✅ Понятні повідомлення помилок
- ✅ Швидкі дії (<5 секунд для most операцій)

### Продуктивність

- ✅ Асинхронне виконання операцій
- ✅ Не блокувати UI під час git операцій
- ✅ Кешування версій та branch інформації

---

## Обмеження та умови

### Версіонування

#### ✅ Дозволено:

- Створювати PATCH версію з будь-якої гілки (v1.0.1 → v1.0.2)
- Створювати MINOR версію з master (v1.0.0 → v1.1.0)
- Створювати MAJOR версію з master (v1.0.0 → 2.0.0)

#### ❌ НЕ дозволено:

- Створювати MINOR/MAJOR версію з feature гілки
- Пропускати версії (v1.0.0 → v1.0.3, якщо v1.0.2 існує)
- Змінювати версію вручну (лише через "Create Version" команду)

### Git операції

#### Обов'язкові умови:

- ✅ Clean working tree (без незакомічених змін)
- ✅ Актуальна інформація від origin (no local-only commits)
- ✅ Синхронізований submodule

#### Після операцій:

- ✅ Автоматично fetch від origin
- ✅ Автоматично синхронізувати submodule
- ✅ Оновити UI з актуальною інформацією

---

## Матриця версій

| Операція        | master | feature | v*.*.\* |
| --------------- | ------ | ------- | ------- |
| Create MAJOR    | ✅     | ❌      | ❌      |
| Create MINOR    | ✅     | ❌      | ❌      |
| Create PATCH    | ✅     | ✅      | ✅      |
| Deploy          | ✅     | ❌      | ✅      |
| Merge to master | ❌     | ✅      | ✅      |
| Update docs     | ✅     | ✅      | ✅      |
| Push            | ✅     | ✅      | ✅      |

---

## Структура команд

```
pdf-validator-vscode
├── Create Branch
│   └─ Ask: MAJOR/MINOR/PATCH
├── Deploy Current Branch
│   └─ GitHub Actions workflow
├── Update Documentation
│   └─ Generate + Commit
├── Merge to Master
│   └─ Generate CHANGELOG + Commit + Merge
└── Push
    └─ Push all changes
```

---

## Вимоги до проекту

### package.json must have:

```json
{
  "version": "1.0.0",
  "engines": {
    "vscode": "^1.84.0"
  }
}
```

### Git setup:

```bash
# Submodule must be initialized
git submodule update --init --recursive

# Both repos must have proper branches
git branch -a
# Should show: v1.0.0, v1.0.1, etc.
```

### Файлова структура:

```
pdf-validator/
├── CHANGELOG.md (required)
├── package.json (required - has version)
├── docs/ (required)
└── src/validator/ (submodule)
    ├── CHANGELOG.md (required)
    └── package.json (required - has version)
```

---

## Приклади сценаріїв

### Сценарій 1: Створення patch версії

```
Current: master (v1.0.0)
Action: "Create Branch" → Select "PATCH"
Result:
  - New branch: v1.0.1
  - Both repos updated
  - Ready for hotfixes
```

### Сценарій 2: Створення нової minor версії

```
Current: master (v1.0.0)
Action: "Create Branch" → Select "MINOR"
Result:
  - New branch: v1.1.0
  - Both repos updated
  - Ready for new features
```

### Сценарій 3: Merge з CHANGELOG

```
Current: v1.1.0 (with changes)
Action: "Merge to Master"
Process:
  1. Generate CHANGELOG for v1.1.0
  2. Commit CHANGELOG in v1.1.0 branch (both repos)
  3. Merge v1.1.0 → master (both repos)
  4. Update package.json version in master
  5. Push to origin
Result:
  - master now v1.1.0
  - CHANGELOG updated
  - Ready for next version
```

---

**Дата:** 28 січня 2026  
**Версія:** 1.0.0
