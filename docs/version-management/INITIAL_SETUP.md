# 🎯 Початкове налаштування системи версій

## ❗ ВАЖЛИВО: З ЧОГО ПОЧАТИ

### Базова гілка: `master`

**ВСЯ документація та система версій ПОВИННА спочатку бути закомічена в `master`!**

```
master (базова гілка)
  ↓
  ├─ Документація
  ├─ scripts/generate-versions.js
  ├─ GitHub Actions workflows
  └─ VersionSelector компонент (готовий до використання)
     ↓
     З master створюємо гілки версій:
     ├─ v1.0.0 (перша версія)
     ├─ v1.1.0 (наступна версія)
     └─ v2.0.0 (major version)
```

**Чому master?**

- ✅ Центральна точка правди для всіх версій
- ✅ Документація доступна з будь-якої гілки
- ✅ Workflows та скрипти синхронізовані
- ✅ Легше merge нових змін у всі версії

---

## 📋 Рекомендована стратегія версій

### Поточна ситуація

```json
// package.json на develop/v0
{
  "version": "0.2.0" // ← Beta версія
}
```

### Рекомендація: Перейти на v1.0.0

**Замість 0.2.0 → почати з 1.0.0** як першу офіційну версію!

**Чому?**

- ✅ Більш професійно виглядає
- ✅ 1.0.0 = "Готовий до production"
- ✅ 0.x.x зазвичай означає "Beta/Testing"
- ✅ Гарні версії для майбутнього: v1.0.0, v1.1.0, v2.0.0

---

## 🔄 Workflow початкового налаштування

### Крок 0: Підготовка (на develop)

```bash
# Переконайтесь що ви на develop
git checkout develop
git pull origin develop

# Перевірити поточну версію
cat package.json | grep version
# "version": "0.2.0"
```

---

### Крок 1: Оновити версію на 1.0.0

```bash
# На develop гілці
npm version 1.0.0 --no-git-tag-version

# Перевірити
cat package.json | grep version
# "version": "1.0.0"

# Оновити CHANGELOG.md
echo "## [1.0.0] - $(date +%Y-%m-%d)

### Added
- Multi-version deployment system
- VersionSelector component with outdated alerts
- Automatic version synchronization
- Comprehensive documentation

### Changed
- Bumped version from 0.2.0 to 1.0.0 (first stable release)
- Brand migration to Material UI v5
- Centralized color system with CSS variables

### Fixed
- Accessibility improvements (WCAG AA compliant)
- Responsive design for all screen sizes
" >> CHANGELOG.md
```

---

### Крок 2: Merge develop → master

```bash
# Перейти на master
git checkout master
git pull origin master

# Merge develop в master
git merge develop --no-ff -m "chore: prepare for v1.0.0 release

- Bump version to 1.0.0
- Add multi-version deployment system documentation
- Prepare for first stable release
"

# Push master
git push origin master
```

---

### Крок 3: Додати документацію та систему на master

```bash
# Переконатись що на master
git branch --show-current
# master

# Створити всі файли системи версій
# (згідно STEP_BY_STEP_GUIDE.md)

# 1. Створити scripts/generate-versions.js
mkdir -p scripts
# ... створити файл (див. STEP_BY_STEP_GUIDE.md Крок 1)

# 2. Створити VersionSelector компонент
mkdir -p src/components/VersionSelector
# ... створити файли (див. STEP_BY_STEP_GUIDE.md Крок 3)

# 3. Створити GitHub Actions
mkdir -p .github/workflows
# ... створити deploy-master.yml

# 4. Оновити package.json scripts
# Додати: "generate-versions": "node scripts/generate-versions.js"

# Комітити ВСЕ на master
git add scripts/
git add src/components/VersionSelector/
git add .github/workflows/deploy-master.yml
git add package.json
git add docs/version-management/
git add CHANGELOG.md

git commit -m "feat: Add multi-version deployment system

- Add versions.json generation with semantic versioning
- Create VersionSelector component with outdated version alerts
- Add GitHub Actions workflow for master deployment
- Integrate version selector in TopInfo
- Add comprehensive documentation in docs/version-management/
- Support automatic version synchronization across deployments

BREAKING CHANGE: Version bumped to 1.0.0 (first stable release)
"

# Push на master
git push origin master
```

**Результат**: GitHub Actions deploy master на `/` (root)

---

### Крок 4: Створити гілку v1.0.0 (для майбутніх hotfix)

```bash
# З master створити гілку v1.0.0
git checkout -b v1.0.0
git push origin v1.0.0

# Створити workflow для v1.0.0
# .github/workflows/deploy-v1.0.yml

```

**deploy-v1.0.yml:**

```yaml
name: Deploy v1.0

on:
  push:
    branches: [v1.0.0]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Generate versions.json
        run: npm run generate-versions

      - name: Build
        run: npm run build
        env:
          PUBLIC_URL: /pdf-validator/v1.0.0

      - name: Deploy to GitHub Pages (v1.0.0 folder)
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
          destination_dir: v1.0.0
          keep_files: true

      - name: Success message
        run: |
          echo "✅ v1.0.0 deployed successfully!"
          echo "📍 URL: https://victorchei.github.io/pdf-validator/v1.0.0/"
```

```bash
# Комітити workflow
git add .github/workflows/deploy-v1.0.0.yml
git commit -m "ci: Add deployment workflow for v1.0.0"
git push origin v1.0.0

# Повернутись на master
git checkout master
```

---

### Крок 5: Оновити generate-versions.js на master

**scripts/generate-versions.js:**

```javascript
const VERSIONS_CONFIG = [
  {
    id: 'latest',
    version: '1.0.0',
    label: 'Поточна версія (1.0.0)',
    path: '/pdf-validator/',
    branch: 'master',
    isLatest: true,
    status: 'stable',
    releaseDate: '2026-01-28',
  },
  {
    id: 'v1.0.0',
    version: '1.0.0',
    label: 'Версія 1.0.0',
    path: '/pdf-validator/v1.0.0/',
    branch: 'v1.0.0',
    isLatest: false,
    status: 'stable',
    releaseDate: '2026-01-28',
  },
]
```

**ВАЖЛИВО**: Спочатку тільки master (latest), інші версії додамо пізніше!

---

## 🗑️ ВИДАЛЕННЯ ВЕРСІЙ

### ❗ ВАЖЛИВО: Версії НЕ зникають автоматично

```

Видалення Git гілки ≠ Видалення версії з селекта
```

**Що відбувається при видаленні гілки:**

1. ❌ Git гілка видаляється
2. ❌ GitHub Actions більше не запускається для цієї гілки
3. ✅ Deployment на gh-pages **ЗАЛИШАЄТЬСЯ**
4. ✅ Версія в селекті **ЗАЛИШАЄТЬСЯ**
5. ✅ versions.json **НЕ ЗМІНЮЄТЬСЯ**

### Правильний спосіб видалення версії

#### Крок 1: Видалити з generate-versions.js

**На гілці master:**

```javascript
// scripts/generate-versions.js

// БУЛО:
const VERSIONS_CONFIG = [
  { id: 'latest', version: '1.0.0', ... },
  { id: 'v1.0.0', version: '1.0.0', ... },
  { id: 'v0.9.0', version: '0.9.0', ... },  // ← Видалити цей
]

// СТАЛО:
const VERSIONS_CONFIG = [
  { id: 'latest', version: '1.0.0', ... },
  { id: 'v1.0.0', version: '1.0.0', ... },
  // v0.9.0 видалено
]
```

```bash
git add scripts/generate-versions.js
git commit -m "chore: Remove deprecated version v0.9.0 from selector"
git push origin master
```

**Результат**: Після deployment master → versions.json оновиться → версія зникне з селекта на ВСІХ версіях сайту!

---

#### Крок 2: Видалити Git гілку (опціонально)

```bash
# Локально
git branch -d v0.9

# Remote
git push origin --delete v0.9
```

---

#### Крок 3: Видалити deployment з gh-pages

```bash
# Перейти на gh-pages гілку
git checkout gh-pages

# Видалити папку версії
rm -rf v0.9.0/

# Commit
git add .
git commit -m "chore: Remove deprecated v0.9.0 deployment"

# Push
git push origin gh-pages

# Повернутись на master
git checkout master
```

---

#### Крок 4: Видалити workflow (опціонально)

```bash
git checkout master

# Видалити workflow
rm .github/workflows/deploy-v0.9.yml

git add .github/workflows/
git commit -m "ci: Remove v0.9 deployment workflow"
git push origin master
```

---

### Швидка команда для повного видалення

```bash
# Скрипт для видалення версії v0.9.0

#!/bin/bash
VERSION="0.9.0"
VERSION_ID="v0.9.0"
BRANCH="v0.9"

echo "🗑️  Видалення версії $VERSION..."

# 1. Оновити generate-versions.js на master
git checkout master
# Вручну видалити версію з VERSIONS_CONFIG
git add scripts/generate-versions.js
git commit -m "chore: Remove version $VERSION from selector"
git push origin master

# 2. Видалити гілку
git branch -d $BRANCH
git push origin --delete $BRANCH

# 3. Видалити deployment
git checkout gh-pages
rm -rf $VERSION_ID/
git add .
git commit -m "chore: Remove $VERSION_ID deployment"
git push origin gh-pages

# 4. Видалити workflow
git checkout master
rm .github/workflows/deploy-$BRANCH.yml
git add .github/workflows/
git commit -m "ci: Remove $BRANCH workflow"
git push origin master

echo "✅ Версія $VERSION повністю видалена!"
```

---

## 📊 Структура після налаштування

### Git гілки

```
master (1.0.0)           ← Базова гілка, latest version

  ├─ v1.0.0 (1.0.0)        ← Для hotfix v1.0.x
  ├─ v1.1.0 (1.1.0)        ← Наступна minor версія (майбутня)
  └─ develop (1.1.0-dev) ← Активна розробка
```

### Deployment URLs

```
/                        ← master (latest 1.0.0)
/v1.0.0/                 ← v1.0.0 branch (stable 1.0.0)
/v1.1.0/                 ← v1.1.0 branch (коли буде створена)
```

### versions.json (після master deploy)

```json
{
  "versions": [
    {
      "id": "latest",
      "version": "1.0.0",
      "path": "/pdf-validator/",
      "isLatest": true,
      "status": "stable"
    },
    {
      "id": "v1.0.0",
      "version": "1.0.0",
      "path": "/pdf-validator/v1.0.0/",
      "isLatest": false,
      "status": "stable"
    }
  ],
  "latestVersion": "1.0.0"
}
```

---

## ✅ Чек-лист початкового налаштування

### На develop

- [ ] `npm version 1.0.0` (замість 0.2.0)
- [ ] Оновити CHANGELOG.md
- [ ] Commit змін

### На master

- [ ] `git merge develop` (отримати v1.0.0)
- [ ] Створити `scripts/generate-versions.js`
- [ ] Створити `src/components/VersionSelector/`
- [ ] Створити `.github/workflows/deploy-master.yml`
- [ ] Оновити `package.json` (додати scripts)
- [ ] Commit всієї системи версій
- [ ] Push на master

- [ ] Перевірити GitHub Actions (deploy на `/`)

### Створення v1.0.0 гілки

- [ ] `git checkout -b v1.0.0` (з master)
- [ ] Створити `.github/workflows/deploy-v1.0.0.yml`
- [ ] Commit workflow
- [ ] Push на v1.0.0
- [ ] Перевірити deployment на `/v1.0.0/`

### Merge в develop

- [ ] `git checkout develop`
- [ ] `git merge master` (синхронізувати систему версій)
- [ ] Push на develop

---

## 🎯 Результат

Після виконання всіх кроків:

1. ✅ **master** - базова гілка з версією 1.0.0
2. ✅ **v1.0.0** - гілка для hotfix v1.0.x
3. ✅ **develop** - синхронізована з master
4. ✅ Документація на master (доступна з усіх гілок)
5. ✅ GitHub Actions налаштовані
6. ✅ VersionSelector працює
7. ✅ versions.json генерується автоматично

**Тепер можна створювати нові версії з master!**

---

## 🔄 Створення наступних версій (з master)

### Версія 1.1.0 (feature release)

```bash
# Розробка на develop
git checkout develop
git pull origin develop

# ... робота над features ...

# Bump version
npm version minor  # 1.0.0 → 1.1.0

# Merge в master
git checkout master
git merge develop --no-ff -m "Release v1.1.0"

# Створити гілку v1.1
git checkout -b v1.1
git push origin v1.1

# Оновити generate-versions.js на master
# Додати нову версію до VERSIONS_CONFIG

git checkout master
# ... edit generate-versions.js ...
git add scripts/generate-versions.js

git commit -m "chore: Add version 1.1.0 to selector"
git push origin master


# Створити workflow deploy-v1.1.yml
# ... create and commit workflow ...
```

---

## 📌 Підсумок відповідей на питання

### 1. Куди комітити документацію?

**→ В `master`** (базова гілка)

### 2. З якої гілки створювати нові версії?

**→ З `master`** (після merge з develop)

### 3. Змінити 0.2.0 на 1.0.0?

**→ ТАК! Рекомендовано** (перша стабільна версія)

### 4. Чи зникне версія автоматично при видаленні гілки?

**→ НІ!** Потрібно:

- Видалити з `generate-versions.js` (на master)
- Видалити папку з `gh-pages` гілки
- Видалити workflow (опціонально)
- Видалити Git гілку (опціонально)

---

**Готові почати?** → Слідуйте цьому файлу крок за кроком! 🚀
