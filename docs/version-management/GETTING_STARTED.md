# 📋 План впровадження - Швидкий огляд

## Де ви зараз

```bash
git branch --show-current
# Результат: v0 ✅
```

**Ви на правильній гілці!** Саме звідси починаємо.

---

## 🗂️ Структура файлів (що буде створено)

### 1. Скрипти та конфігурація

```
pdf-validator/
├── scripts/
│   └── generate-versions.js          ← Генерує versions.json
├── package.json                       ← Додати scripts
└── public/
    └── versions.json                 ← Згенерований файл
```

**Комітити на**: `v0` (ваша поточна гілка)

---

### 2. React компоненти

```
src/
└── components/
    ├── VersionSelector/              ← НОВИЙ компонент
    │   ├── index.tsx
    │   └── VersionSelector.module.css
    └── TopInfo/
        ├── index.tsx                 ← Оновити (додати VersionSelector)
        └── TopInfo.module.css        ← Додати .versionWrapper
```

**Комітити на**: `v0`

---

### 3. GitHub Actions

```
.github/
└── workflows/
    ├── deploy-v0.yml                 ← Deploy v0 version
    └── deploy-master.yml             ← Deploy master version
```

**Комітити на**: `v0`

---

### 4. Документація

```
docs/
└── version-management/               ← Вся документація тут
    ├── README.md
    ├── STEP_BY_STEP_GUIDE.md
    ├── MULTI_PAGE_IMPLEMENTATION.md
    ├── AUTO_VERSIONS_UPDATE.md
    ├── QUICK_REFERENCE_MULTIPAGE.md
    └── IMPLEMENTATION_CHECKLIST.md
```

**Комітити на**: `v0` (потім merge в `master`)

---

## 📍 Куди комітити (детально)

### Фаза 1: Розробка на v0

```bash
# ВИ ТУТ ↓
git checkout v0

# Створити всі файли згідно STEP_BY_STEP_GUIDE.md

# Комітити
git add scripts/generate-versions.js
git add src/components/VersionSelector/
git add src/components/TopInfo/
git add .github/workflows/
git add package.json
git add docs/version-management/

git commit -m "feat: Add multi-version deployment system

- Add versions.json generation script with semantic versioning
- Create VersionSelector component with outdated version alert
- Add GitHub Actions workflows for v0 and master
- Integrate version selector in TopInfo
- Add comprehensive documentation in docs/version-management/
"

# Push
git push origin v0
```

**Результат**: GitHub Actions автоматично deploy v0 на `/v0.2.0/`

---

### Фаза 2: Merge в master

```bash
# Після успішного deploy v0:

git checkout master
git pull origin master

# Merge v0 в master
git merge v0 --no-ff -m "Merge multi-version system from v0"

# Push master
git push origin master
```

**Результат**: GitHub Actions автоматично deploy master на `/` (root)

---

### Фаза 3: Sync develop

```bash
# Оновити develop гілку

git checkout develop
git pull origin develop

# Merge master в develop
git merge master --no-ff -m "Sync multi-version system from master"

# Push develop
git push origin develop
```

---

## 🧪 Тестування (по порядку)

### 1️⃣ Локальне тестування (на v0)

```bash
# Переконайтесь що на v0
git branch --show-current

# Генерувати versions.json
npm run generate-versions

# Перевірити
cat public/versions.json

# Build
npm run build

# Запустити локально
npx serve -s build -p 5000

# Відкрити http://localhost:5000
# Має бути:
# ✅ VersionSelector після заголовку
# ✅ Dropdown з версіями
# ⚠️ Alert про застарілу версію (якщо не на latest)
```

---

### 2️⃣ GitHub Actions (на v0)

```bash
# Push на v0
git push origin v0

# Перевірити GitHub Actions
open https://github.com/victorchei/pdf-validator/actions

# Чекати ~2 хв

# Перевірити deployment
curl -I https://victorchei.github.io/pdf-validator/v0/

# Має повернути: HTTP/1.1 200 OK

# Відкрити в браузері
open https://victorchei.github.io/pdf-validator/v0/

# Має бути:
# ⚠️ Alert "Ви переглядаєте застарілу версію. Доступна нова версія 1.0.0"
# Dropdown з версіями
```

---

### 3️⃣ Master deployment

```bash
# Після merge в master і push
git checkout master
git push origin master

# Чекати GitHub Actions ~2 хв

# Відкрити master версію
open https://victorchei.github.io/pdf-validator/

# Має бути:
# ✅ БЕЗ alert (це остання версія)
# ✅ Dropdown працює
# ✅ Можна вибрати v0 і перейти
```

---

### 4️⃣ Перевірка синхронізації

```bash
# Перевірити що versions.json доступний
curl https://victorchei.github.io/pdf-validator/versions.json | jq '.'

# Має показати:
# {
#   "versions": [
#     {"id": "latest", "version": "1.0.0", ...},
#     {"id": "v0.2.0", "version": "0.2.0", ...}
#   ],
#   "latestVersion": "1.0.0",
#   ...
# }

# Відкрити обидві версії і перевірити dropdown:

# Master:
open https://victorchei.github.io/pdf-validator/
# Dropdown має показувати: Поточна версія (1.0.0) 🌟, Версія 0.2.0 (Тестова/Бета)

# v0.2.0:
open https://victorchei.github.io/pdf-validator/v0.2.0/
# Dropdown має показувати ті ж 2 версії
# Alert має бути: "Ви переглядаєте застарілу версію..."
```

---

## ✅ Критерії успіху

### Локально

- [x] `npm run generate-versions` створює `public/versions.json`
- [x] `npm run build` копіює versions.json в build/
- [x] `npx serve -s build` показує VersionSelector
- [x] Dropdown працює
- [x] Alert показується (якщо не на latest)

### GitHub (v0)

- [x] Push на v0 → GitHub Actions запускається
- [x] Workflow "Deploy v0" успішний (зелений ✓)
- [x] `https://victorchei.github.io/pdf-validator/v0.2.0/` доступний
- [x] Alert "застаріла версія" показується
- [x] Dropdown працює

### GitHub (master)

- [x] Push на master → GitHub Actions запускається
- [x] Workflow "Deploy Master" успішний
- [x] `https://victorchei.github.io/pdf-validator/` доступний
- [x] Alert НЕ показується (це latest)
- [x] Dropdown працює

### Синхронізація

- [x] `versions.json` доступний в корені gh-pages
- [x] Обидві версії (master і v0) бачать однаковий список версій
- [x] Переходи між версіями працюють

---

## 🚨 Troubleshooting

### Проблема: npm run generate-versions fails

```bash
# Перевірити Node версію
node --version
# Має бути >= 18

# Перевірити що файл існує
ls -la scripts/generate-versions.js

# Запустити вручну
node scripts/generate-versions.js
```

---

### Проблема: GitHub Actions fails

```bash
# Перевірити logs
open https://github.com/victorchei/pdf-validator/actions

# Типові помилки:
# - npm ci fails → видалити node_modules, regenerate package-lock
# - Build fails → перевірити PUBLIC_URL в workflow
# - Deploy fails → перевірити GITHUB_TOKEN permissions в Settings
```

---

### Проблема: versions.json 404

```bash
# Перевірити що файл в build
ls -la build/versions.json

# Перевірити gh-pages
git checkout gh-pages
ls -la versions.json
git checkout -

# Якщо немає - перевірити prebuild hook
npm run generate-versions
npm run build
```

---

## 📚 Документація

Вся документація знаходиться в:

```
docs/version-management/
├── README.md                         ← Огляд системи
├── STEP_BY_STEP_GUIDE.md            ← Детальна інструкція (почніть тут!)
├── MULTI_PAGE_IMPLEMENTATION.md      ← Архітектура
├── AUTO_VERSIONS_UPDATE.md           ← Синхронізація
├── QUICK_REFERENCE_MULTIPAGE.md      ← Швидка довідка
└── IMPLEMENTATION_CHECKLIST.md       ← Чек-лист
```

**Почніть з**: [STEP_BY_STEP_GUIDE.md](version-management/STEP_BY_STEP_GUIDE.md)

---

## 📞 Наступні кроки

1. ✅ Прочитати STEP_BY_STEP_GUIDE.md
2. ✅ Створити файли згідно гайду
3. ✅ Протестувати локально
4. ✅ Закомітити на v0
5. ✅ Push і перевірити GitHub Actions
6. ✅ Merge в master
7. ✅ Перевірити production deployment
8. 🎉 Система працює!

---

**Готові почати?** → [STEP_BY_STEP_GUIDE.md](version-management/STEP_BY_STEP_GUIDE.md) 🚀
