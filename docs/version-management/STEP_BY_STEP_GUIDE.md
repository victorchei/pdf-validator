# 🚀 Покроковий гайд: Впровадження мультиверсійного розгортання

## Поточний стан

- **Поточна гілка**: `v0` ✅
- **Основна гілка**: `master`
- **Розробка**: `develop`

## Крок 0: Підготовка (ВИ ТУТ)

```bash
# Переконайтесь що ви на правильній гілці
git branch --show-current
# Має показати: v0

# Перевірте статус
git status
```

---

## ЧАСТИНА 1: ЛОКАЛЬНЕ ТЕСТУВАННЯ

### Крок 1: Створити скрипт генерації versions.json

```bash
# Створити папку для скриптів
mkdir -p scripts
```

**Створити файл `scripts/generate-versions.js`:**

```javascript
const fs = require('fs')
const path = require('path')

// Конфігурація версій з семантичним версіонуванням
// ВАЖЛИВО: версії мають відповідати package.json у відповідних гілках
const VERSIONS_CONFIG = [
  {
    id: 'latest',
    version: '1.0.0',
    label: 'Поточна версія (1.0.0)',
    path: '/pdf-validator/',
    branch: 'master',
    isLatest: true,
    status: 'stable',
    releaseDate: '2026-02-15', // Майбутній реліз
  },
  {
    id: 'v0.2.0',
    version: '0.2.0',
    label: 'Версія 0.2.0 (Тестова)',
    path: '/pdf-validator/v0.2.0/',
    branch: 'v0',
    isLatest: false,
    status: 'beta',
    releaseDate: '2026-01-28', // Поточна версія з package.json
  },
]

function generateVersionsJson() {
  const manifest = {
    versions: VERSIONS_CONFIG,
    latestVersion: VERSIONS_CONFIG.find((v) => v.isLatest)?.version || '1.0.0',
    lastUpdated: new Date().toISOString(),
  }

  // Створити public папку якщо не існує
  const publicDir = path.join(__dirname, '../public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  // Запис versions.json
  const outputPath = path.join(publicDir, 'versions.json')
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2))

  console.log('✅ versions.json успішно згенеровано:', outputPath)
  console.log(`📦 Знайдено версій: ${VERSIONS_CONFIG.length}`)
  console.log(`🔖 Остання версія: ${manifest.latestVersion}`)

  VERSIONS_CONFIG.forEach((v) => {
    console.log(`   - ${v.id}: ${v.version} (${v.status})`)
  })
}

if (require.main === module) {
  generateVersionsJson()
}

module.exports = { generateVersionsJson }
```

**Тест локально:**

```bash
# Запустити скрипт
node scripts/generate-versions.js

# Має показати:
# ✅ versions.json успішно згенеровано: /path/to/public/versions.json
# 📦 Знайдено версій: 2
# 🔖 Остання версія: 1.0.0
#    - latest: 1.0.0 (stable)
#    - v0.2.0: 0.2.0 (beta)

# Перевірити вміст
cat public/versions.json
```

### Крок 2: Оновити package.json

```bash
# Відкрити package.json і додати:
```

```json
{
  "scripts": {
    "generate-versions": "node scripts/generate-versions.js",
    "prebuild": "npm run generate-versions",
    "build": "react-scripts build",
    "test:versions": "node scripts/generate-versions.js && cat public/versions.json"
  }
}
```

**Тест:**

```bash
npm run test:versions
# Має показати згенерований JSON
```

### Крок 3: Створити компонент VersionSelector

**Створити `src/components/VersionSelector/index.tsx`:**

```tsx
import { Alert, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styles from './VersionSelector.module.css'

interface Version {
  id: string
  version: string
  label: string
  path: string
  branch: string
  isLatest: boolean
  status: 'stable' | 'legacy' | 'beta'
  releaseDate: string
}

interface VersionsManifest {
  versions: Version[]
  latestVersion: string
  lastUpdated: string
}

export const VersionSelector = () => {
  const [currentVersion, setCurrentVersion] = useState<string>('latest')
  const [versions, setVersions] = useState<Version[]>([])
  const [latestVersion, setLatestVersion] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [isOutdated, setIsOutdated] = useState<boolean>(false)

  useEffect(() => {
    const pathname = window.location.pathname
    const detectedVersion = detectCurrentVersion(pathname)
    setCurrentVersion(detectedVersion)
    fetchVersions(detectedVersion)
  }, [])

  const detectCurrentVersion = (pathname: string): string => {
    // Шукаємо паттерн /pdf-validator/vX.Y.Z/ (семантична версія)
    const match = pathname.match(/\/pdf-validator\/(v\d+\.\d+\.\d+)/)
    return match ? match[1] : 'latest'
  }

  const fetchVersions = async (currentVer: string) => {
    try {
      setLoading(true)

      // Для локального тестування використовуємо відносний шлях
      const isLocal = window.location.hostname === 'localhost'
      const versionsUrl = isLocal ? '/versions.json' : 'https://victorchei.github.io/pdf-validator/versions.json'

      const response = await fetch(versionsUrl)

      if (!response.ok) {
        throw new Error('Failed to fetch versions')
      }

      const data: VersionsManifest = await response.json()
      setVersions(data.versions)
      setLatestVersion(data.latestVersion)

      // Перевірити чи поточна версія застаріла
      const current = data.versions.find((v) => v.id === currentVer)
      if (current && !current.isLatest) {
        setIsOutdated(true)
      }
    } catch (err) {
      console.error('Error fetching versions:', err)

      // Fallback
      setVersions([
        {
          id: 'latest',
          version: '1.0.0',
          label: 'Поточна версія',
          path: '/pdf-validator/',
          branch: 'master',
          isLatest: true,
          releaseDate: new Date().toISOString().split('T')[0],
          status: 'stable',
        },
      ])
      setLatestVersion('1.0.0')
    } finally {
      setLoading(false)
    }
  }

  const handleVersionChange = (event: SelectChangeEvent<string>) => {
    const versionId = event.target.value
    const selectedVersion = versions.find((v) => v.id === versionId)

    if (selectedVersion) {
      const baseUrl =
        window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://victorchei.github.io'

      window.location.href = `${baseUrl}${selectedVersion.path}`
    }
  }

  if (loading) {
    return <div className={styles.loading}>Завантаження версій...</div>
  }

  return (
    <div className={styles.container}>
      {isOutdated && (
        <Alert severity="warning" className={styles.outdatedAlert}>
          Ви переглядаєте застарілу версію. Доступна нова версія {latestVersion}.{' '}
          <a href={versions.find((v) => v.isLatest)?.path} style={{ color: 'inherit', fontWeight: 'bold' }}>
            Перейти на останню версію →
          </a>
        </Alert>
      )}

      <FormControl size="small" className={styles.selector}>
        <InputLabel>Версія</InputLabel>
        <Select value={currentVersion} onChange={handleVersionChange} label="Версія">
          {versions.map((version) => (
            <MenuItem key={version.id} value={version.id}>
              {version.label}
              {version.isLatest && ' 🌟'}
              {version.status === 'legacy' && ' (Застаріла)'}
              {version.status === 'beta' && ' (Бета)'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
```

**Створити `src/components/VersionSelector/VersionSelector.module.css`:**

```css
.container {
  margin: 12px 0;
}

.selector {
  min-width: 250px;
  background-color: var(--color-white);
}

.loading {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  padding: 8px;
}

.outdatedAlert {
  margin-bottom: 16px;
  font-size: 0.85rem;
}

@media (max-width: 600px) {
  .selector {
    min-width: 100%;
    font-size: 0.85rem;
  }

  .outdatedAlert {
    font-size: 0.75rem;
  }
}
```

### Крок 4: Інтегрувати з TopInfo

**Оновити `src/components/TopInfo/index.tsx`:**

```tsx
import React from 'react'
import { Typography } from '@mui/material'
import { VersionSelector } from '../VersionSelector'
import styles from './TopInfo.module.css'

export const TopInfo = () => {
  return (
    <div className={styles.container}>
      <Typography className={styles.title}>Валідатор дипломних робіт</Typography>

      <Typography className={styles.description}>
        Автоматична перевірка дипломної роботи на відповідність стандартам оформлення
      </Typography>

      {/* Селектор версій */}
      <div className={styles.versionWrapper}>
        <VersionSelector />
      </div>

      <Typography className={styles.instruction}>Завантажте файл PDF для перевірки</Typography>
    </div>
  )
}
```

**Додати в `src/components/TopInfo/TopInfo.module.css`:**

```css
.versionWrapper {
  margin: 16px 0;
  display: flex;
  justify-content: center;
}

@media (max-width: 600px) {
  .versionWrapper {
    margin: 12px 0;
  }
}
```

### Крок 5: Локальне тестування

```bash
# 1. Генерувати versions.json
npm run generate-versions

# 2. Перевірити що файл створено
ls -la public/versions.json
cat public/versions.json

# 3. Запустити dev сервер
npm start

# 4. Відкрити http://localhost:3000
# Має показати:
# - VersionSelector після заголовку
# - Dropdown з версіями: "Поточна версія (1.0.0)" і "Версія 0.2.0 (Тестова)"
# - Alert про застарілу версію НЕ має показуватись (ми на latest)

# 5. Протестувати що versions.json завантажується
# Відкрити DevTools → Network → знайти versions.json (200 OK)

# 6. Build проект
npm run build

# 7. Перевірити що versions.json скопійовано
ls -la build/versions.json

# 8. Запустити production build локально
npx serve -s build -p 5000

# 9. Відкрити http://localhost:5000
# Перевірити що все працює як в dev режимі
```

**✅ Checkpoint 1**: Якщо все працює локально, можна переходити до GitHub!

---

## ЧАСТИНА 2: GITHUB DEPLOYMENT

### Крок 6: Створити GitHub Actions workflows

**Створити `.github/workflows/deploy-v0.yml`:**

```yaml
name: Deploy v0 (Test Version)

on:
  push:
    branches: [v0]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate versions manifest
        run: npm run generate-versions

      - name: Build project
        run: npm run build
        env:
          PUBLIC_URL: https://victorchei.github.io/pdf-validator/v0
          REACT_APP_VERSION: v0

      - name: Deploy to GitHub Pages (v0 folder)
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
          destination_dir: v0
          keep_files: true

      - name: Notify success
        run: |
          echo "✅ v0.2.0 deployed successfully!"
          echo "📍 URL: https://victorchei.github.io/pdf-validator/v0.2.0/"
```

**Створити `.github/workflows/deploy-master.yml`:**

```yaml
name: Deploy Master (Latest)

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate versions manifest
        run: npm run generate-versions

      - name: Build project
        run: npm run build
        env:
          PUBLIC_URL: https://victorchei.github.io/pdf-validator
          REACT_APP_VERSION: latest

      - name: Deploy to GitHub Pages (root)
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
          destination_dir: ./
          keep_files: true

      - name: Notify success
        run: |
          echo "✅ Master deployed successfully!"
          echo "📍 URL: https://victorchei.github.io/pdf-validator/"
```

### Крок 7: Комітити зміни на v0

```bash
# Переконайтесь що ви на v0
git branch --show-current

# Додати всі нові файли
git add scripts/generate-versions.js
git add src/components/VersionSelector/
git add .github/workflows/deploy-v0.yml
git add .github/workflows/deploy-master.yml
git add package.json

# Також додати оновлення в TopInfo якщо є
git add src/components/TopInfo/

# Перевірити що додано
git status

# Комітити
git commit -m "feat: Add multi-version deployment system

- Add versions.json generation script
- Create VersionSelector component with outdated version alert
- Add GitHub Actions workflows for v0 and master
- Integrate version selector in TopInfo
- Support semantic versioning (v0.2.0, v1.0.0)
- Match versions with package.json in each branch
"

# Push на v0
git push origin v0
```

### Крок 8: Перевірити GitHub Actions

```bash
# Відкрити GitHub в браузері
open https://github.com/victorchei/pdf-validator/actions

# Або перевірити через gh CLI якщо встановлено
gh workflow list
gh run watch
```

**Очікувані результати:**

1. GitHub Actions запускається автоматично
2. Workflow "Deploy v0" виконується
3. Build успішний
4. Deploy в папку `v0/` на gh-pages

### Крок 9: Перевірити deployment

```bash
# Через ~1-2 хвилини після успішного deploy:

# Перевірити versions.json
curl https://victorchei.github.io/pdf-validator/versions.json

# Має повернути:
# {
#   "versions": [...],
#   "latestVersion": "1.0.0",
#   ...
# }

# Перевірити v0.2.0 версію
curl -I https://victorchei.github.io/pdf-validator/v0.2.0/

# Має повернути: HTTP/1.1 200 OK

# Відкрити в браузері
open https://victorchei.github.io/pdf-validator/v0.2.0/
```

**Що має бути на сторінці (v0.2.0):**

- ⚠️ Alert "Ви переглядаєте тестову версію. Доступна стабільна версія 1.0.0"
- Dropdown з вибором версії
- Посилання на останню версію
- Badge "Бета" або "Тестова" біля версії

### Крок 10: Deploy master версії

```bash
# Перейти на master
git checkout master

# Merge змін з v0 (або cherry-pick потрібні commits)
git merge v0 --no-ff -m "Merge multi-version system from v0"

# Або якщо є конфлікти, cherry-pick:
git cherry-pick <commit-hash-from-v0>

# Push на master
git push origin master

# Перевірити Actions
open https://github.com/victorchei/pdf-validator/actions
```

**Через 1-2 хвилини:**

```bash
# Відкрити master версію
open https://victorchei.github.io/pdf-validator/

# Має бути:
# - Dropdown з версіями
# - БЕЗ alert (це остання версія)
# - Можливість перейти на v0
```

---

## ЧАСТИНА 3: ТЕСТУВАННЯ

### Тестовий сценарій 1: Перевірка versions.json

```bash
# Test 1: JSON доступний
curl https://victorchei.github.io/pdf-validator/versions.json | jq '.'

# Expected output:
# {
#   "versions": [
#     { "id": "latest", "version": "1.0.0", ... },
#     { "id": "v0.2.0", "version": "0.2.0", ... }
#   ],
#   "latestVersion": "1.0.0",
#   "lastUpdated": "2026-01-28T..."
# }

# Test 2: Обидві версії доступні
curl -I https://victorchei.github.io/pdf-validator/
curl -I https://victorchei.github.io/pdf-validator/v0.2.0/

# Both should return: 200 OK
```

### Тестовий сценарій 2: Version Selector

**На master (latest):**

1. Відкрити <https://victorchei.github.io/pdf-validator/>
2. Перевірити dropdown → має бути 2 версії
3. НЕ має бути alert про застарілу версію
4. Вибрати "Версія 0.9.0" → redirect на /v0/

**На v0:**

1. Відкрити <https://victorchei.github.io/pdf-validator/v0/>
2. Перевірити alert ⚠️ "Ви переглядаєте застарілу версію"
3. Клікнути посилання → redirect на latest
4. Dropdown також має працювати

### Тестовий сценарій 3: Додати нову версію v1.1.0

```bash
# Створити нову гілку від master
git checkout master
git pull origin master
git checkout -b v1.1.0

# Оновити scripts/generate-versions.js
# Додати: { id: 'v1.1.0', version: '1.1.0', ... }

# Build і test локально
npm run generate-versions
npm run build
npx serve -s build

# Commit
git add scripts/generate-versions.js
git commit -m "feat: Add v1.1.0 version"
git push origin v1.1.0

# Створити workflow .github/workflows/deploy-v1.1.0.yml
# Push workflow
git add .github/workflows/deploy-v1.1.0.yml
git commit -m "ci: Add deploy workflow for v1.1.0"
git push origin v1.1.0

# Перевірити deployment
# Через 2 хв всі версії мають бачити v1.1.0 в dropdown!
```

---

## Troubleshooting

### Проблема: versions.json 404

**Рішення:**

```bash
# Перевірити чи файл в build/
ls -la build/versions.json

# Якщо немає - перевірити prebuild hook
npm run generate-versions
npm run build
ls -la build/versions.json

# Перевірити gh-pages гілку
git checkout gh-pages
ls -la versions.json
git checkout -
```

### Проблема: Alert не показується на v0

**Рішення:**

```bash
# Перевірити DevTools Console
# Має бути: isOutdated = true

# Перевірити що versions.json містить isLatest: false для v0
curl https://victorchei.github.io/pdf-validator/versions.json | jq '.versions[] | select(.id == "v0")'

# Має бути: "isLatest": false
```

### Проблема: GitHub Actions fail

**Рішення:**

```bash
# Перевірити logs в GitHub Actions UI

# Типові проблеми:
# 1. npm ci fails → видалити package-lock.json і regenerate
# 2. Build fails → перевірити PUBLIC_URL в workflow
# 3. Deploy fails → перевірити GITHUB_TOKEN permissions

# Перевірити локально
npm ci
npm run build
```

---

## ✅ Контрольний список

Після виконання всіх кроків:

- [ ] Локально: versions.json генерується
- [ ] Локально: VersionSelector показує версії
- [ ] Локально: Alert працює коректно
- [ ] Локально: Build успішний
- [ ] GitHub: Workflows створено
- [ ] GitHub: v0 deployed на /v0/
- [ ] GitHub: master deployed на /
- [ ] GitHub: versions.json доступний
- [ ] Production: v0 показує alert про застарілість
- [ ] Production: master НЕ показує alert
- [ ] Production: Dropdown працює на обох версіях
- [ ] Production: Переходи між версіями працюють

**Якщо всі пункти ✅ - система працює!** 🎉

---

## Наступні кроки

1. Додати більше версій (v1.1.0, v1.2.0, v2.0.0)
2. Автоматизувати оновлення versions.json
3. Додати changelog для кожної версії
4. Налаштувати analytics per version
5. Створити version badges

**Документація**: `/docs/version-management/`
