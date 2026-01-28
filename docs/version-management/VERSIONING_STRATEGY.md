# 🏷️ Стратегія версіонування

## Семантичне версіонування (Semantic Versioning)

Проект використовує **семантичне версіонування** формату **vX.Y.Z**

```
v1.2.3
│ │ │
│ │ └─ PATCH - Виправлення багів (backward compatible)
│ └─── MINOR - Нова функціональність (backward compatible)
└───── MAJOR - Зміни що ламають сумісність (breaking changes)
```

---

## Відповідність версій

### package.json ↔️ Git гілки ↔️ Deployment URL

| Git гілка | package.json | Deployment URL | Статус    | Опис             |
| --------- | ------------ | -------------- | --------- | ---------------- |
| `master`  | `1.0.0`      | `/` (root)     | 🌟 Latest | Стабільна версія |
| `v0`      | `0.2.0`      | `/v0.2.0/`     | 🧪 Beta   | Тестова версія   |
| `v1.1.0`  | `1.1.0`      | `/v1.1.0/`     | 📦 Stable | Попередній реліз |

**ВАЖЛИВО**: Версія в `package.json` **ЗАВЖДИ** має відповідати:

1. Назві гілки (без префікса `v` для повних версій)
2. URL deployment
3. Конфігурації в `scripts/generate-versions.js`

---

## Поточний стан проекту

### Версія 0.2.0 (Гілка v0)

**package.json:**

```json
{
  "version": "0.2.0"
}
```

**Git гілка:** `v0`

**Deployment:** `https://victorchei.github.io/pdf-validator/v0.2.0/`

**Статус:** Beta/Testing - використовується для тестування нових функцій

**Особливості:**

- Material UI v5 з брендовою темою
- Централізована система кольорів (CSS variables)
- Responsive дизайн (320px → 1440px+)
- WCAG AA compliant

---

### Версія 1.0.0 (Майбутній реліз)

**Планується на:** `master` гілка

**package.json (майбутній):**

```json
{
  "version": "1.0.0"
}
```

**Deployment (майбутній):** `https://victorchei.github.io/pdf-validator/`

**Статус:** Stable - перший офіційний реліз

**Що буде включено:**

- Всі зміни з v0.2.0
- Мультиверсійна система deployment
- VersionSelector компонент
- Автоматична синхронізація версій
- Застарілість версії alerts

---

## Структура versions.json

**Актуальна конфігурація** (з `scripts/generate-versions.js`):

```javascript
const VERSIONS_CONFIG = [
  {
    id: 'latest', // Ідентифікатор для коду
    version: '1.0.0', // ← З package.json master гілки
    label: 'Поточна версія (1.0.0)',
    path: '/pdf-validator/',
    branch: 'master',
    isLatest: true,
    status: 'stable',
    releaseDate: '2026-02-15',
  },
  {
    id: 'v0.2.0', // ← Відповідає URL path
    version: '0.2.0', // ← З package.json v0 гілки
    label: 'Версія 0.2.0 (Тестова)',
    path: '/pdf-validator/v0.2.0/',
    branch: 'v0',
    isLatest: false,
    status: 'beta',
    releaseDate: '2026-01-28',
  },
]
```

**Генерується в:** `public/versions.json`

**Доступний на:** `https://victorchei.github.io/pdf-validator/versions.json`

---

## Правила роботи з версіями

### 1. Створення нової версії

```bash
# 1. Створити нову гілку з відповідною версією
git checkout -b v1.1
# або для patch версій
git checkout -b v1.0.1

# 2. Оновити package.json
npm version 1.1.0 --no-git-tag-version
# або
npm version 1.0.1 --no-git-tag-version

# 3. Додати версію в scripts/generate-versions.js
# Редагувати VERSIONS_CONFIG масив

# 4. Створити GitHub Actions workflow
# Скопіювати .github/workflows/deploy-v0.yml
# Змінити назву на deploy-v1.1.0.yml
# Оновити branch: [v1.1.0] і destination_dir: v1.1.0

# 5. Commit і push
git add package.json scripts/generate-versions.js .github/workflows/
git commit -m "chore: bump version to 1.1.0"
git push origin v1.1.0
```

---

### 2. Оновлення існуючої версії (PATCH)

```bash
# На існуючій гілці
git checkout v0

# Patch версія (0.2.0 → 0.2.1)
npm version patch

# Оновити generate-versions.js
# Змінити version: '0.2.0' → version: '0.2.1'

git add package.json scripts/generate-versions.js
git commit -m "chore: bump version to 0.2.1"
git push origin v0
```

---

### 3. Major version (Breaking changes)

```bash
# 0.2.0 → 1.0.0
git checkout master
npm version major  # → 1.0.0

# Оновити generate-versions.js
# Змінити isLatest: true на нову версію

git add package.json scripts/generate-versions.js
git commit -m "chore: release v1.0.0"
git push origin master
```

---

## Workflow версіонування

### Сценарій 1: Розробка нової функції

```
develop (0.3.0-dev)
   ↓
   └─ feature/new-feature
        ↓
        merge → v0 (0.2.0 → 0.3.0)
          ↓
          test на /v0.3.0/
            ↓
            merge → master (1.0.0 → 1.1.0)
              ↓
              deploy на / (root)
```

---

### Сценарій 2: Hotfix для production

```
master (1.0.0)
   ↓
   └─ hotfix/critical-bug
        ↓
        npm version patch → 1.0.1
          ↓
          merge → master
            ↓
            deploy /
```

---

### Сценарій 3: Експериментальна версія

```
v0 (0.2.0)
   ↓
   └─ experiment/ai-features
        ↓
        npm version preminor → 0.3.0-alpha.1
          ↓
          deploy /v0.3.0-alpha/
            ↓
            збір фідбеку
              ↓
              npm version minor → 0.3.0
                ↓
                deploy /v0.3.0/
```

---

## Детектування версії в коді

### VersionSelector компонент

```typescript
const detectCurrentVersion = (pathname: string): string => {
  // Підтримка повного семантичного версіонування
  // Приклади:
  // /pdf-validator/v0.2.0/ → v0.2.0
  // /pdf-validator/v1.0.0/ → v1.0.0
  // /pdf-validator/v1.1.5/ → v1.1.5
  // /pdf-validator/ → latest

  const match = pathname.match(/\/pdf-validator\/(v\d+\.\d+\.\d+)/)
  return match ? match[1] : 'latest'
}
```

**Regex пояснення:**

- `v` - обов'язковий префікс
- `\d+` - MAJOR (одна або більше цифр)
- `\.` - крапка (escaped)
- `\d+` - MINOR
- `\.` - крапка
- `\d+` - PATCH

**Приклади що спрацюють:**

- ✅ `/pdf-validator/v0.2.0/`
- ✅ `/pdf-validator/v1.0.0/`
- ✅ `/pdf-validator/v10.25.3/`

**Приклади що НЕ спрацюють:**

- ❌ `/pdf-validator/v0/` (немає MINOR.PATCH)
- ❌ `/pdf-validator/v1.0/` (немає PATCH)
- ❌ `/pdf-validator/0.2.0/` (немає префікса v)

---

## Тестування версій

### Локально

```bash
# Симуляція різних версій на localhost
# Змінити в generate-versions.js для тестування:

// Для тестування v0.2.0
{
  id: 'v0.2.0',
  path: '/',  // Тимчасово змінити на root
  isLatest: false,  // Перевірить Alert
}

npm run build
npx serve -s build
# Має показати Alert про застарілість
```

---

### На GitHub

```bash
# Перевірити всі версії
curl -s https://victorchei.github.io/pdf-validator/versions.json | jq '.versions[] | {version, status, isLatest}'

# Expected:
# {
#   "version": "1.0.0",
#   "status": "stable",
#   "isLatest": true
# }
# {
#   "version": "0.2.0",
#   "status": "beta",
#   "isLatest": false
# }
```

---

## Naming conventions

### Git гілки

| Формат                     | Приклад             | Використання                 |
| -------------------------- | ------------------- | ---------------------------- |
| `master`                   | `master`            | Поточна stable версія        |
| `develop`                  | `develop`           | Активна розробка             |
| `v{major}`                 | `v0`, `v1`, `v2`    | Major версії (legacy формат) |
| `v{major}.{minor}.{patch}` | `v1.0.0`, `v1.1.0`  | Minor/Patch релізи           |
| `feature/*`                | `feature/dark-mode` | Feature branches             |

---

### GitHub Actions workflows

| Файл                | Deployment | Гілка    |
| ------------------- | ---------- | -------- |
| `deploy-master.yml` | `/` (root) | `master` |
| `deploy-v0.yml`     | `/v0.2.0/` | `v0`     |
| `deploy-v1.1.0.yml` | `/v1.1.0/` | `v1.1.0` |

**Формат назви:** `deploy-{branch}.yml`

---

### Deployment folders (gh-pages)

```
gh-pages/
├── index.html              ← master (1.0.0)
├── versions.json           ← Централізований список
├── v0.2.0/
│   └── index.html         ← v0 branch (0.2.0)
├── v1.1.0/
│   └── index.html         ← v1.1.0 branch (1.1.0)
└── v1.0.1/
    └── index.html         ← hotfix (1.0.1)
```

**Формат папки:** `v{version}/` (повна семантична версія)

---

## Приклад повного циклу

### Випуск версії 1.1.0

#### Крок 1: Створення гілки

```bash
git checkout master
git pull origin master
git checkout -b v1.1
```

#### Крок 2: Оновлення версії

```bash
# package.json
npm version 1.1.0 --no-git-tag-version
```

#### Крок 3: Оновлення versions.json генератора

**scripts/generate-versions.js:**

```javascript
const VERSIONS_CONFIG = [
  {
    id: 'latest',
    version: '1.1.0', // ← ОНОВЛЕНО
    label: 'Поточна версія (1.1.0)',
    // ... інші поля
    isLatest: true,
  },
  {
    id: 'v1.0.0', // ← ДОДАНО (попередній latest)
    version: '1.0.0',
    label: 'Версія 1.0.0',
    path: '/pdf-validator/v1.0.0/',
    branch: 'v1.0.0',
    isLatest: false, // ← ОНОВЛЕНО
    status: 'stable',
    releaseDate: '2026-02-15',
  },
  {
    id: 'v0.2.0',
    version: '0.2.0',
    // ... без змін
  },
]
```

#### Крок 4: Створення workflow

**.github/workflows/deploy-v1.1.0.yml:**

```yaml
name: Deploy v1.1.0

on:
  push:
    branches: [v1.1.0]

# ... решта конфігурації
```

#### Крок 5: Commit і Deploy

```bash
git add package.json scripts/generate-versions.js .github/workflows/deploy-v1.1.0.yml
git commit -m "chore: release v1.1.0"
git push origin v1.1.0

# GitHub Actions автоматично deploy на /v1.1.0/
```

#### Крок 6: Merge в master

```bash
git checkout master
git merge v1.1.0 --no-ff -m "Release v1.1.0"
git push origin master

# GitHub Actions deploy на / (root)
```

#### Крок 7: Перевірка

```bash
# Перевірити versions.json
curl https://victorchei.github.io/pdf-validator/versions.json | jq '.latestVersion'
# Expected: "1.1.0"

# Перевірити що v1.1.0 доступний
curl -I https://victorchei.github.io/pdf-validator/v1.1.0/
# Expected: 200 OK

# Перевірити master
curl -I https://victorchei.github.io/pdf-validator/
# Expected: 200 OK (має показувати v1.1.0)
```

---

## FAQ

### Q: Чи можна використовувати формат v1, v2 замість v1.0.0?

**A:** Ні. Проект використовує **повне семантичне версіонування** (vX.Y.Z) для:

- Кращої деталізації змін
- Підтримки hotfix (patch versions)
- Сумісності з npm package.json
- Стандартизації з industry best practices

---

### Q: Що робити якщо package.json показує 0.2.0, а документація згадує 1.0.0?

**A:** Це нормально - 1.0.0 це **майбутній** реліз. Поточна версія 0.2.0 (beta/testing). Після завершення тестування буде merge в master з версією 1.0.0.

---

### Q: Як додати pre-release версію (alpha/beta/rc)?

**A:**

```bash
# Alpha
npm version prerelease --preid=alpha
# → 1.1.0-alpha.0

# Beta
npm version prerelease --preid=beta
# → 1.1.0-beta.0

# Release Candidate
npm version prerelease --preid=rc
# → 1.1.0-rc.0
```

Додати в generate-versions.js:

```javascript
{
  id: 'v1.1.0-beta',
  version: '1.1.0-beta.0',
  label: 'Версія 1.1.0 Beta',
  path: '/pdf-validator/v1.1.0-beta/',
  status: 'beta',
  isLatest: false,
}
```

---

### Q: Чи потрібно оновлювати versions.json на всіх гілках?

**A:** Ні! `versions.json` генерується **автоматично** на кожному deploy і зберігається в **корені gh-pages**. Всі версії читають його з одного місця:

```
https://victorchei.github.io/pdf-validator/versions.json
```

---

### Q: Що якщо хочу видалити стару версію?

```bash
# 1. Видалити з generate-versions.js (в master)
# Прибрати об'єкт версії з VERSIONS_CONFIG

# 2. Видалити workflow
rm .github/workflows/deploy-v0.yml

# 3. Видалити гілку
git branch -d v0
git push origin --delete v0

# 4. Видалити з gh-pages
git checkout gh-pages
rm -rf v0.2.0/
git add .
git commit -m "Remove deprecated version v0.2.0"
git push origin gh-pages
```

---

## Корисні команди

```bash
# Показати всі версії в package.json історії
git log --all --oneline --decorate --grep="version"

# Показати поточну версію
cat package.json | jq '.version'

# Порівняти версії між гілками
diff <(git show master:package.json | jq '.version') \
     <(git show v0:package.json | jq '.version')

# Список всіх deployment URL
curl -s https://victorchei.github.io/pdf-validator/versions.json | \
  jq -r '.versions[] | "\(.version) → https://victorchei.github.io\(.path)"'
```

---

## Підсумок

✅ **Використовуємо:** Семантичне версіонування vX.Y.Z
✅ **package.json відповідає:** Git гілкам та deployment URL
✅ **Поточна версія:** 0.2.0 (гілка v0, beta status)
✅ **Майбутня версія:** 1.0.0 (гілка master, stable)
✅ **Regex підтримує:** Повний формат v0.2.0, v1.0.0, v10.25.3
✅ **Deployment:** /v0.2.0/, /v1.0.0/, / (root для latest)

**Це реалістично та відповідає стандартам!** 🎯
