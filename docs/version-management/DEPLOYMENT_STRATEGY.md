# 🚀 Стратегія деплою та фільтрації версій

## Оглядoverall Architecture

### Deployment Workflows

Проект використовує **єдиний універсальний workflow** для всіх версій замість створення окремого файлу під кожну гілку.

#### Файли Workflows

```
.github/workflows/
├── deploy.yml                # Деплой master (Latest) → /
├── deploy-version.yml        # Деплой будь-якої v*.*.* → /vX.Y.Z/
└── auto-update-versions.yml  # 🆕 Автоматична генерація versions.json
```

---

## 🤖 Автоматична генерація versions.json

### GitHub Actions (Серверна автоматизація)

**Файл:** `.github/workflows/auto-update-versions.yml`

**Коли спрацьовує:**
- При push в `master`
- Якщо змінилися `package.json` або `scripts/generate-versions.js`

**Що робить:**
1. Генерує `versions.json`
2. Якщо є зміни - автоматично комітить
3. Пушить зміни назад в `master`

**Переваги:**
- ✅ Працює автоматично на GitHub
- ✅ Не потребує локального налаштування
- ✅ Завжди спрацює, навіть якщо забули локально
- ✅ Використовує `[skip ci]` щоб уникнути циклів

### Pre-commit Hook (Локальна автоматизація)

**Файл:** `.githooks/pre-commit`

**Коли спрацьовує:**
- При локальному `git commit`
- Якщо в commit є `package.json` або `generate-versions.js`

**Що робить:**
1. Генерує `versions.json`
2. Автоматично додає до commit
3. Показує статус в терміналі

**Встановлення:**
```bash
./scripts/setup-hooks.sh
```

**Переваги:**
- ✅ Миттєва перевірка локально
- ✅ Бачиш результат до push
- ✅ Менше помилок в CI/CD

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

### Одноразове налаштування (для нових розробників)

```bash
# Встановити Git hooks для автоматичної генерації versions.json
./scripts/setup-hooks.sh
```

### Крок 1: Створення гілки

```bash
git checkout master
git pull origin master
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

### Крок 4: Commit змін

```bash
git add .
git commit -m "chore: Create v2.0.0 release branch"
```

**✨ Pre-commit hook автоматично:**
- Згенерує `versions.json`
- Додасть до commit

### Крок 5: Push гілки

```bash
git push origin v2.0.0
```

**Автоматично спрацює:** `.github/workflows/deploy-version.yml`

### Крок 6: Оновлення master

```bash
git checkout master
git merge v2.0.0
git push origin master
```

**🤖 GitHub Actions автоматично:**
- Згенерує `versions.json` через `auto-update-versions.yml`
- Закомітить якщо є зміни
- Задеплоїть через `deploy.yml`

### Крок 7: Активація в dropdown

Коли версія готова показати користувачам:

```javascript
{
  id: 'v2.0.0',
  // ...
  deployed: true, // ✅ Тепер видима
}
```

Commit → **pre-commit hook** або **GitHub Actions** оновлять `versions.json` → VersionSelector покаже нову версію

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

**Commit** → versions.json **автоматично оновиться** 🤖

### Активувати версію

```javascript
// Змінити deployed: false → deployed: true
{
  id: 'v2.0.0',
  deployed: true, // ✅ Показується
}
```

**Commit** → versions.json **автоматично оновиться** 🤖

### Приховати стару версію

```javascript
{
  id: 'v0.1.0',
  deployed: false, // Приховати застарілу
}
```

**Commit** → versions.json **автоматично оновиться** 🤖
```

---

## ✅ Checklist нової версії

- [ ] **Одноразово:** Запустити `./scripts/setup-hooks.sh` (для нових розробників)
- [ ] Створити гілку `v*.*.*`
- [ ] Оновити `package.json` version
- [ ] Додати в `generate-versions.js` з `deployed: false`
- [ ] Commit → **pre-commit hook автоматично згенерує versions.json** 🤖
- [ ] Push → автоматичний deploy через `deploy-version.yml`
- [ ] Перевірити деплой на `/{version}/`
- [ ] Merge в master → **GitHub Actions оновить versions.json** 🤖
- [ ] Змінити `deployed: true` коли готово показати → **auto-update спрацює** 🤖
- [ ] Синхронізувати validator submodule

---

## 🎯 Переваги поточної стратегії

✅ Єдиний workflow для всіх версій  
✅ Гнучка фільтрація через `deployed` field  
✅ Не потрібно створювати файли під кожну версію  
✅ Універсальна 404 для всіх помилок  
✅ Легко приховувати/показувати версії  
✅ Масштабується на десятки версій  
✅ **🆕 Автоматична генерація versions.json** (локально + CI/CD)  
✅ **🆕 Неможливо забути оновити versions.json**

---

## 🔧 Troubleshooting

### versions.json не оновлюється локально

```bash
# Перевірити чи встановлені hooks
git config core.hooksPath

# Має показати: .githooks
# Якщо немає - запустити:
./scripts/setup-hooks.sh
```

### versions.json не оновлюється на GitHub

Перевірити:
1. Workflow `auto-update-versions.yml` існує
2. В логах Actions перевірити чи спрацював
3. Переконатися що змінилися `package.json` або `generate-versions.js`

### Pre-commit hook не спрацьовує

```bash
# Перевірити права
ls -la .githooks/pre-commit
# Має бути -rwxr-xr-x (executable)

# Якщо немає - додати:
chmod +x .githooks/pre-commit
```

---

**Дата оновлення:** 28 січня 2026  
**Версія документа:** 1.2.0
