# 🚀 Стратегія деплою та фільтрації версій

## Оглядoverall Architecture

### Deployment Workflows

Проект використовує **єдиний універсальний workflow** для всіх версій замість створення окремого файлу під кожну гілку.

#### Файли Workflows

```
.github/workflows/
├── deploy.yml         # Деплой master (Latest) → /
└── deploy-version.yml # Деплой будь-якої v*.*.* → /vX.Y.Z/
```

---

## 📝 deploy-version.yml - Універсальний Workflow

**Патерн:** Спрацьовує для будь-якої гілки формату `v*.*.*`

```yaml
on:
  push:
    branches:
      - 'v*.*.*' # v1.0.0, v2.1.3, v10.5.2 тощо
```

### Автоматичне визначення версії

```yaml
- name: Extract version from branch name
  id: version
  run: |
    BRANCH_NAME=${GITHUB_REF#refs/heads/}
    echo "version=$BRANCH_NAME" >> $GITHUB_OUTPUT

- name: Build
  env:
    PUBLIC_URL: /pdf-validator/${{ steps.version.outputs.version }}

- name: Deploy to GitHub Pages (version folder)
  with:
    destination_dir: ${{ steps.version.outputs.version }}
    keep_files: true
```

### Переваги

✅ **Один файл** замість створення окремого під кожну версію  
✅ **Автоматична обробка** нових версій без зміни конфігурації  
✅ **DRY принцип** - код не дублюється  
✅ **Масштабованість** - легко додавати нові версії

---

## 🎯 Фільтрація версій через deployed field

### Концепція

Замість створення workflow під кожну версію, використовуємо **поле `deployed`** в конфігурації.

**Файл:** `scripts/generate-versions.js`

```javascript
const VERSIONS_CONFIG = [
  {
    id: 'latest',
    version: '1.0.0',
    deployed: true, // ✅ Показується в VersionSelector
    // ...
  },
  {
    id: 'v1.0.0',
    version: '1.0.0',
    deployed: true, // ✅ Показується
    // ...
  },
  {
    id: 'v0.2.0',
    version: '0.2.0',
    deployed: false, // ❌ Приховується з dropdown
    // ...
  },
]
```

### Фільтр в VersionSelector

```typescript
// src/components/VersionSelector/index.tsx
const fetchVersions = async () => {
  const response = await fetch('/pdf-validator/versions.json')
  const data = await response.json()

  // Показуємо тільки задеплоєні версії
  const deployedVersions = data.versions.filter((v: Version) => v.deployed !== false)

  setVersions(deployedVersions)
}
```

### Використання

**Коли версія готова до показу:**

```javascript
// Було
{ id: 'v2.0.0', deployed: false } // Прихована

// Стало (після деплою)
{ id: 'v2.0.0', deployed: true }  // Видима
```

**Або для заготовок:**

```javascript
{
  id: 'v2.0.0',
  version: '2.0.0',
  deployed: false, // Запланована, але ще не деплоїться
  // ...
}
```

---

## 🔗 Workflow створення нової версії

### Крок 1: Створення гілки

```bash
git checkout -b v2.0.0
```

### Крок 2: Оновлення package.json

```json
{
  "version": "2.0.0"
}
```

### Крок 3: Додавання в конфігурацію

**scripts/generate-versions.js:**

```javascript
const VERSIONS_CONFIG = [
  // ...existing versions
  {
    id: 'v2.0.0',
    version: '2.0.0',
    label: 'Версія 2.0.0',
    path: '/pdf-validator/v2.0.0/',
    branch: 'v2.0.0',
    isLatest: false,
    status: 'stable',
    deployed: false, // ❌ Спочатку прихована
    releaseDate: '2026-02-15',
    changelog: '/pdf-validator/v2.0.0/CHANGELOG.md',
  },
]
```

### Крок 4: Push гілки

```bash
git add .
git commit -m "chore: Create v2.0.0 release branch"
git push origin v2.0.0
```

**Автоматично спрацює:** `.github/workflows/deploy-version.yml`

### Крок 5: Активація в dropdown

Коли версія готова показати користувачам:

```javascript
{
  id: 'v2.0.0',
  // ...
  deployed: true, // ✅ Тепер видима
}
```

Commit і push в `master` → оновить `versions.json` → VersionSelector покаже нову версію

---

## 🛡️ 404 Error Handling

### Універсальна 404 сторінка

**Файл:** `public/404.html`

**Працює для:**

- ❌ `/pdf-validator/v99.99.99/` (не існує)
- ❌ `/pdf-validator/some-random-page`
- ❌ `/pdf-validator/v0.2.0/` (deployed: false)
- ❌ Будь-яка неправильна URL

### Розумна логіка

```javascript
// Визначення версії з URL
const path = window.location.pathname
const versionMatch = path.match(/\/(v\d+\.\d+\.\d+)/)

if (versionMatch) {
  // Показує: "Запитана версія: v0.2.0"
} else {
  // Просто показує загальну 404
}
```

### Пропозиції доступних версій

Автоматично завантажує `versions.json` і показує 3 доступні версії:

```javascript
fetch('/pdf-validator/versions.json')
  .then((response) => response.json())
  .then((data) => {
    const availableVersions = data.versions.filter((v) => !v.isLatest).slice(0, 3)
    // Показує кнопки переходу
  })
```

---

## 📊 Стан деплою

### Зараз задеплоєно

| Версія       | URL                                       | Workflow           | deployed |
| ------------ | ----------------------------------------- | ------------------ | -------- |
| Latest 1.0.0 | `/`                                       | deploy.yml         | true     |
| v1.0.0       | `/v1.0.0/`                                | deploy-version.yml | true     |
| v0.2.0       | `/v0.2.0/` (404 через deploy-version.yml) | -                  | false    |

### Як це працює

1. **Master branch** → `deploy.yml` → деплой на `/`
2. **v1.0.0 branch** → `deploy-version.yml` → деплой на `/v1.0.0/`
3. **v0.2.0** - не має активного workflow → 404
4. **VersionSelector** показує тільки `deployed: true` (Latest + v1.0.0)

---

## 🎨 VersionSelector Features

### Фільтрація

- ✅ Показує тільки `deployed !== false`
- ✅ Лімит 10 останніх версій
- ✅ Scroll для великих списків

### UI/UX

```typescript
<Select
  MenuProps={{
    PaperProps: {
      style: {
        maxHeight: 400 // Scroll після 10-12 версій
      }
    }
  }}
>
```

### Badges

- 🌟 **Latest** - поточна версія (master)
- 📦 **Stable** - стабільні релізи
- 🧪 **Beta** - тестові версії

---

## 🔄 Синхронізація з submodule

При створенні нової версії **validator** submodule також потребує версії:

```bash
# В validator репозиторії
cd validator
git checkout -b v2.0.0
git push origin v2.0.0

# В pdf-validator
git submodule update --remote
git add src/validator
git commit -m "chore: Update validator submodule to v2.0.0"
```

---

## 📖 Приклади

### Додати майбутню версію (прихована)

```javascript
// generate-versions.js
{
  id: 'v3.0.0',
  version: '3.0.0',
  deployed: false, // Не показується
  // ...
}
```

### Активувати версію

```javascript
// Змінити deployed: false → deployed: true
{
  id: 'v2.0.0',
  deployed: true, // ✅ Показується
}
```

### Приховати стару версію

```javascript
{
  id: 'v0.1.0',
  deployed: false, // Приховати застарілу
}
```

---

## ✅ Checklist нової версії

- [ ] Створити гілку `v*.*.*`
- [ ] Оновити `package.json` version
- [ ] Додати в `generate-versions.js` з `deployed: false`
- [ ] Push → автоматичний deploy через `deploy-version.yml`
- [ ] Перевірити деплой на `/{version}/`
- [ ] Змінити `deployed: true` коли готово показати
- [ ] Commit → оновить `versions.json`
- [ ] Синхронізувати validator submodule

---

## 🎯 Переваги поточної стратегії

✅ Єдиний workflow для всіх версій  
✅ Гнучка фільтрація через `deployed` field  
✅ Не потрібно створювати файли під кожну версію  
✅ Універсальна 404 для всіх помилок  
✅ Легко приховувати/показувати версії  
✅ Масштабується на десятки версій

---

**Дата оновлення:** 28 січня 2026  
**Версія документа:** 1.1.0
