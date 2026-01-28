# Quick Reference: Мультиверсійне розгортання

## TL;DR

**Мета**: Розгортати декілька версій PDF Validator на одному домені з автоматичною синхронізацією списку версій.

**Результат**:

- Master: `victorchei.github.io/pdf-validator/`
- v1: `victorchei.github.io/pdf-validator/v1/`
- v2: `victorchei.github.io/pdf-validator/v2/`

**Як працює**: Централізований `versions.json` на gh-pages → всі версії його фетчують → автоматичне оновлення dropdown.

---

## Швидкий старт (5 кроків)

### 1️⃣ Створити скрипт генерації versions.json

```bash
mkdir -p scripts
```

**scripts/generate-versions.js:**

```javascript
const fs = require('fs')
const path = require('path')

const VERSIONS_CONFIG = [
  {
    id: 'latest',
    label: 'Поточна версія',
    path: '/pdf-validator/',
    branch: 'master',
    isLatest: true,
    status: 'stable',
  },
  { id: 'v1', label: 'Версія 1', path: '/pdf-validator/v1/', branch: 'v1/main', isLatest: false, status: 'legacy' },
]

const manifest = {
  versions: VERSIONS_CONFIG,
  lastUpdated: new Date().toISOString(),
}

fs.writeFileSync(path.join(__dirname, '../public/versions.json'), JSON.stringify(manifest, null, 2))

console.log('✅ versions.json created')
```

### 2️⃣ Оновити package.json

```json
{
  "scripts": {
    "generate-versions": "node scripts/generate-versions.js",
    "prebuild": "npm run generate-versions",
    "build": "react-scripts build"
  }
}
```

### 3️⃣ Створити компонент VersionSelector

```bash
mkdir -p src/components/VersionSelector
```

**src/components/VersionSelector/index.tsx:**

```tsx
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'

export const VersionSelector = () => {
  const [currentVersion, setCurrentVersion] = useState('latest')
  const [versions, setVersions] = useState([])

  useEffect(() => {
    fetch('https://victorchei.github.io/pdf-validator/versions.json')
      .then((res) => res.json())
      .then((data) => setVersions(data.versions))
      .catch(() => setVersions([{ id: 'latest', label: 'Поточна версія', path: '/pdf-validator/' }]))
  }, [])

  const handleChange = (e) => {
    const version = versions.find((v) => v.id === e.target.value)
    if (version) window.location.href = `https://victorchei.github.io${version.path}`
  }

  return (
    <FormControl size="small">
      <InputLabel>Версія</InputLabel>
      <Select value={currentVersion} onChange={handleChange} label="Версія">
        {versions.map((v) => (
          <MenuItem key={v.id} value={v.id}>
            {v.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
```

### 4️⃣ Додати VersionSelector в TopInfo

**src/components/TopInfo/index.tsx:**

```tsx
import { VersionSelector } from '../VersionSelector'

export const TopInfo = () => (
  <div>
    <Typography>Валідатор дипломних робіт</Typography>
    <VersionSelector /> {/* ← Додати тут */}
  </div>
)
```

### 5️⃣ Створити GitHub Actions

**.github/workflows/deploy-master.yml:**

```yaml
name: Deploy Master
on:
  push:
    branches: [master]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
        env:
          PUBLIC_URL: https://victorchei.github.io/pdf-validator
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
          keep_files: true
```

**.github/workflows/deploy-version.yml:**

```yaml
name: Deploy Version
on:
  push:
    branches: ['v[0-9]+/main']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - id: version
        run: echo "version=$(echo ${{ github.ref }} | cut -d'/' -f3)" >> $GITHUB_OUTPUT
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
        env:
          PUBLIC_URL: https://victorchei.github.io/pdf-validator/${{ steps.version.outputs.version }}
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
          destination_dir: ${{ steps.version.outputs.version }}
          keep_files: true
```

---

## Тестування

```bash
# Локально
npm run generate-versions
cat public/versions.json
npm run build
npx serve -s build

# Production
curl https://victorchei.github.io/pdf-validator/versions.json
```

---

## Додати нову версію

```bash
# 1. Створити гілку
git checkout -b v2/main master

# 2. Оновити scripts/generate-versions.js
# Додати: { id: 'v2', label: 'Версія 2', ... }

# 3. Commit і push
git add scripts/generate-versions.js
git commit -m "Add v2 version config"
git push origin v2/main

# 4. GitHub Actions автоматично:
#    - Build v2
#    - Deploy в /v2/
#    - Update versions.json
#    - Всі версії бачать v2!
```

---

## Troubleshooting

**Питання**: Dropdown порожній?
**Відповідь**: Перевір DevTools Console → Network → versions.json (має бути 200 OK)

**Питання**: Стара версія не бачить нову?
**Відповідь**: Очисти кеш браузера або чекай оновлення кешу (може зайняти 5-10хв)

**Питання**: Deploy перезаписав інші версії?
**Відповідь**: Додай `keep_files: true` в peaceiris/actions-gh-pages

---

## Ключові файли

```
📦 Проект
├── scripts/generate-versions.js      ← Генерація versions.json
├── public/versions.json               ← Буде скопійовано в build/
├── src/components/VersionSelector/    ← Dropdown компонент
└── .github/workflows/
    ├── deploy-master.yml              ← Deploy root
    └── deploy-version.yml             ← Deploy v1, v2, v3...

📦 gh-pages branch
├── versions.json                      ← ЄДИНЕ ДЖЕРЕЛО СПИСКУ
├── index.html                         ← Master
├── v1/index.html                      ← Version 1
└── v2/index.html                      ← Version 2
```

---

## Детальна документація

- 📖 [MULTI_PAGE_IMPLEMENTATION.md](MULTI_PAGE_IMPLEMENTATION.md) - Повна архітектура
- 🔄 [AUTO_VERSIONS_UPDATE.md](AUTO_VERSIONS_UPDATE.md) - Автоматичне оновлення
