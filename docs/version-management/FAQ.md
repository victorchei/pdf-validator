# ✅ Відповіді на ваші питання

## 1. Куди комітити документацію?

### ✅ В `master` гілку

**Чому саме master:**

- Це базова гілка для всіх версій
- З неї створюються всі версійні гілки (v1.0.0, v1.1.0, v2.0.0)
- Документація буде доступна з будь-якої гілки після merge
- Легше синхронізувати зміни між версіями

**Workflow:**

```bash
git checkout master
# Додати всю документацію
git add docs/version-management/
git commit -m "docs: Add multi-version deployment documentation"
git push origin master
```

---

## 2. З якої гілки виконувати логіку створення версій?

### ✅ З `master`

**Послідовність:**

```
develop (розробка нових функцій)
   ↓
   merge в master (коли готово до release)
      ↓
      створити гілку версії (v1.0.0, v1.1.0 тощо)
         ↓
         deploy через GitHub Actions
```

**Приклад:**

```bash
# 1. Розробка на develop
git checkout develop
npm version minor  # 1.0.0 → 1.1.0

# 2. Merge в master
git checkout master
git merge develop --no-ff -m "Release v1.1.0"
git push origin master

# 3. Створити гілку версії
git checkout -b v1.1
git push origin v1.1

# 4. Оновити generate-versions.js на master
git checkout master
# ... edit generate-versions.js ...
git commit -m "chore: Add v1.1.0 to version selector"
git push origin master
```

---

## 3. Перейменування 0.2.0 → 1.0.0

### ✅ ТАК, це гарна ідея

**Чому 1.0.0 краще:**

- 🌟 Більш професійно
- 🌟 1.0.0 = "Готово до production"
- 🌟 0.x.x = "Beta/Testing"
- 🌟 Гарні версії для майбутнього: v1.0.0, v1.1.0, v2.0.0

**Як виконати:**

### Крок 1: Оновити package.json

```bash
git checkout develop
npm version 1.0.0 --no-git-tag-version
```

### Крок 2: Оновити CHANGELOG.md

```bash
echo "## [1.0.0] - 2026-01-28

### Added
- Multi-version deployment system
- VersionSelector component
- Automatic version synchronization

### Changed
- Bumped from 0.2.0 to 1.0.0 (first stable release)
- Material UI v5 migration
- Centralized color system

### Fixed
- Accessibility improvements (WCAG AA)
" >> CHANGELOG.md
```

### Крок 3: Merge в master

```bash
git checkout master
git merge develop --no-ff -m "chore: Bump version to 1.0.0"
git push origin master
```

### Крок 4: Оновити generate-versions.js

```javascript
const VERSIONS_CONFIG = [
  {
    id: 'latest',
    version: '1.0.0', // ← Змінено з 0.2.0
    label: 'Поточна версія (1.0.0)',
    path: '/pdf-validator/',
    branch: 'master',
    isLatest: true,
    status: 'stable',
    releaseDate: '2026-01-28',
  },
]
```

---

## 4. Чи зникне версія автоматично при видаленні гілки?

### ❌ НІ, версія НЕ зникне автоматично

**Що відбувається при `git branch -d v1.0.0`:**

- ❌ Git гілка видаляється
- ❌ GitHub Actions більше не запускається
- ✅ Deployment на gh-pages **ЗАЛИШАЄТЬСЯ**
- ✅ Версія в dropdown **ЗАЛИШАЄТЬСЯ**
- ✅ versions.json **НЕ ЗМІНЮЄТЬСЯ**

**Чому так?**

```
gh-pages гілка ≠ Git гілки з кодом

gh-pages містить:
  /v1.0.0/     ← Build результат
  /v1.1.0/     ← Build результат
  versions.json ← Генерується з master
```

**Версія залишиться доступною на:**

- `https://victorchei.github.io/pdf-validator/v1.0.0/` ← Працює!
- Dropdown продовжить показувати v1.0.0
- versions.json матиме цю версію

---

## Як ПРАВИЛЬНО видалити версію?

### Метод 1: Видалити з селекта (але залишити deployment)

```bash
# 1. Видалити з generate-versions.js на master
git checkout master

# Відкрити scripts/generate-versions.js
# Видалити об'єкт версії з VERSIONS_CONFIG

git add scripts/generate-versions.js
git commit -m "chore: Remove v1.0.0 from version selector"
git push origin master

# Після deploy master → versions.json оновиться
# Версія зникне з dropdown на ВСІХ версіях!
# Але сайт v1.0.0 залишиться доступним за URL
```

---

### Метод 2: Повне видалення (з deployment)

```bash
# 1. Видалити з generate-versions.js (master)
git checkout master
# ... edit generate-versions.js ...
git add scripts/generate-versions.js
git commit -m "chore: Remove deprecated v1.0.0"
git push origin master

# 2. Видалити Git гілку
git branch -d v1.0.0
git push origin --delete v1.0.0

# 3. Видалити deployment з gh-pages
git checkout gh-pages
rm -rf v1.0.0/
git add .
git commit -m "chore: Remove v1.0.0 deployment"
git push origin gh-pages

# 4. Видалити workflow (опціонально)
git checkout master
rm .github/workflows/deploy-v1.0.0.yml
git add .github/workflows/
git commit -m "ci: Remove v1.0.0 workflow"
git push origin master

# 5. Повернутись на develop
git checkout develop

# ✅ Версія ПОВНІСТЮ видалена!
# - Немає в dropdown
# - Немає на gh-pages
# - URL 404
```

---

## Автоматичний скрипт видалення

```bash
#!/bin/bash
# remove-version.sh

VERSION="1.0.0"
VERSION_ID="v1.0.0"
BRANCH="v1.0.0"

echo "🗑️  Повне видалення версії $VERSION..."

# 1. Update generate-versions.js на master
git checkout master
git pull origin master

# Вручну видалити з VERSIONS_CONFIG
echo "⚠️  Відкрийте scripts/generate-versions.js та видаліть версію $VERSION"
read -p "Натисніть Enter коли готово..."

git add scripts/generate-versions.js
git commit -m "chore: Remove $VERSION from selector"
git push origin master

# 2. Видалити Git гілку
git branch -D $BRANCH 2>/dev/null
git push origin --delete $BRANCH 2>/dev/null

# 3. Видалити deployment
git checkout gh-pages
git pull origin gh-pages
rm -rf $VERSION_ID/
git add .
git commit -m "chore: Remove $VERSION_ID deployment"
git push origin gh-pages

# 4. Видалити workflow
git checkout master
rm .github/workflows/deploy-$BRANCH.yml 2>/dev/null
git add .github/workflows/
git commit -m "ci: Remove $BRANCH workflow" 2>/dev/null
git push origin master 2>/dev/null

git checkout develop

echo "✅ Версія $VERSION повністю видалена!"
```

**Використання:**

```bash
chmod +x remove-version.sh
./remove-version.sh
```

---

## Підсумок

| Питання                                    | Відповідь                                                         |
| ------------------------------------------ | ----------------------------------------------------------------- |
| Куди комітити документацію?                | ✅ В `master`                                                     |
| З якої гілки створювати версії?            | ✅ З `master` (після merge з develop)                             |
| Перейменувати 0.2.0 → 1.0.0?               | ✅ ТАК, рекомендовано                                             |
| Чи зникне версія при видаленні гілки?      | ❌ НІ, потрібно видаляти вручну                                   |
| Що потрібно видалити для повного очищення? | 📝 4 кроки (generate-versions.js, git branch, gh-pages, workflow) |

---

## Де читати детальніше?

📄 [INITIAL_SETUP.md](INITIAL_SETUP.md) - Повний гайд початкового налаштування

**Секції:**

- ✅ Workflow з master гілки
- ✅ Bump version 0.2.0 → 1.0.0
- ✅ Видалення версій (детально з прикладами)
- ✅ Чек-лист початкового setup

---

**Готові почати?** → [INITIAL_SETUP.md](INITIAL_SETUP.md) Крок 0! 🚀
