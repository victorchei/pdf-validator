# ⚙️ Конфігурація

Опис файлів конфігурації та налаштувань проекту.

---

## 📄 groupsConfig.ts

**Розташування**: `src/config/groupsConfig.ts`

### Назначення

Містить список всіх груп спеціальностей, для яких налаштована валідація.

### Вміст

```typescript
export const groupsConfig = ['ІПЗ', 'КБ', 'КІ', 'КН', 'КТ']
```

### Розшифровка скорочень

| Скорочення | Повна назва                        | Спеціальність         |
| ---------- | ---------------------------------- | --------------------- |
| **ІПЗ**    | Інженерія програмного забезпечення | Software Engineering  |
| **КБ**     | Кібербезпека                       | Cybersecurity         |
| **КІ**     | Комп'ютерна інженерія              | Computer Engineering  |
| **КН**     | Комп'ютерні науки                  | Computer Science      |
| **КТ**     | Комп'ютерні технології             | Computer Technologies |

### Використання

```typescript
import { groupsConfig } from 'src/config/groupsConfig'

// Отримати першу групу
const firstGroup = groupsConfig[0]  // 'ІПЗ'

// Відобразити вибір груп у Selec компоненті
<Select>
  {groupsConfig.map((group) => (
    <MenuItem key={group} value={group}>
      {group}
    </MenuItem>
  ))}
</Select>

// Перевірити, чи група існує
if (groupsConfig.includes(selectedGroup)) {
  // ...
}
```

### Додавання нової групи

Якщо потрібно додати нову групу спеціальності:

```typescript
export const groupsConfig = ['ІПЗ', 'КБ', 'КІ', 'КН', 'КТ', 'НОВА_ГРУПА']
```

---

## 📄 errorsConfig.ts

**Розташування**: `src/config/errorsConfig.ts`

### Назначение

Містить маппінг помилок на українські описи для відображення у UI.

### Структура

```typescript
export const errorMapper: ErrorMapper = {
  title: {
    [ERROR_TYPE.frame]: 'Помилки при оформленні рамки',
    [ERROR_TYPE.referenceList]: 'Помилки в списку використаних джерел',
    [ERROR_TYPE.pagesFidelity]: 'Помилки в змісті',
    [ERROR_TYPE.picturesAndTables]: 'Помилки підписів до рисунків і таблиць',
    [ERROR_TYPE.referenceOrder]: 'Помилки порядку літературних джерел в роботі',
    [ERROR_TYPE.abbreviation]: 'Помилки в абревіатурах',
    [ERROR_TYPE.addition]: 'Помилки в додатках',
  },

  [ERROR_TYPE.referenceList]: {
    [REF_LIST_KEYS.rule0]: 'Неправильна назва у СПИСКУ ВИКОРИСТАНИХ ДЖЕРЕЛ',
    [REF_LIST_KEYS.rule1]: 'Кількість використаних джерел',
    [REF_LIST_KEYS.rule2]: 'Неправильний порядок джерел',
    [REF_LIST_KEYS.rule3]: 'Неправильна нумерація джерел',
    // ...
  },

  [ERROR_TYPE.referenceOrder]: {
    [REF_ORDER_ERROR_KEYS.rule1]: 'Неправильний формат чисел',
    [REF_ORDER_ERROR_KEYS.rule2]: 'Помилка в розділових знаках перед джерелом',
    // ...
  },

  // ...інші типи помилок
}
```

### Константи за замовчуванням

```typescript
export const defaultGroup = 'Інші помилки в оформленні роботи'
export const defaultRule = 'Інша група помилок'
```

Використовуються, коли категорія або правило не знайдено в маппінгу.

### Типи помилок (ErrorType)

```typescript
enum ERROR_TYPE {
  frame = 'frame', // Помилки рамки
  referenceList = 'referenceList', // Помилки списку джерел
  pagesFidelity = 'pagesFidelity', // Помилки змісту
  picturesAndTables = 'picturesAndTables', // Помилки підписів
  referenceOrder = 'referenceOrder', // Помилки порядку джерел
  abbreviation = 'abbreviation', // Помилки абревіатур
  addition = 'addition', // Помилки додатків
}
```

### Ключі правил

#### FRAME_ERROR_KEYS

```typescript
rule0 = 'rule0' // Рамка загалом
rule1 = 'rule1' // Розміри рамки
rule2 = 'rule2' // Товщина ліній
// ...
```

#### REF_LIST_KEYS

```typescript
rule0 = 'rule0' // Назва розділу
rule1 = 'rule1' // Кількість джерел
rule2 = 'rule2' // Порядок джерел
rule3 = 'rule3' // Нумерація джерел
rule4 = 'rule4' // Обов'язкові атрибути
// ...
```

### Використання в компонентах

```typescript
import { errorMapper, defaultGroup, defaultRule } from 'src/config/errorsConfig'

// Отримати опис категорії помилки
const categoryTitle = errorMapper.title[errorType]  // 'Помилки при оформленні рамки'

// Отримати опис правила помилки
const ruleDescription = errorMapper[errorType]?.[ruleKey] ?? defaultRule

// Приклад в ControlledTreeView
<TreeItem
  label={errorMapper.title[key] ?? defaultGroup}
>
  {Object.entries(value).map(([item, arr]) => (
    <TreeItem
      label={errorMapper[key]?.[item] ?? defaultRule}
    >
      {arr.map((error) => (
        <TreeItem label={error} />
      ))}
    </TreeItem>
  ))}
</TreeItem>
```

### Додавання нових помилок

Щоб додати нову категорію помилок:

1. **Додати в enum ERROR_TYPE**:

```typescript
enum ERROR_TYPE {
  // ...старі типи
  newErrorType = 'newErrorType', // Нова категорія
}
```

1. **Додати в title маппінг**:

```typescript
title: {
  // ...старі типи
  [ERROR_TYPE.newErrorType]: 'Опис нової категорії помилок',
}
```

1. **Додати конкретні помилки**:

```typescript
[ERROR_TYPE.newErrorType]: {
  rule0: 'Опис першого правила',
  rule1: 'Опис другого правила',
  // ...
}
```

### Структура типу ErrorMapper

```typescript
type ErrorMapper = {
  title: Record<string, string> // Назви категорій: ERROR_TYPE → описання

  [ERROR_TYPE.frame]: {
    // Конкретні помилки за категоріями
    [FRAME_ERROR_KEYS.rule0]: string
    [FRAME_ERROR_KEYS.rule1]: string
    // ...
  }

  [ERROR_TYPE.referenceList]: {
    [REF_LIST_KEYS.rule0]: string
    // ...
  }

  // ...інші категорії
}
```

---

## 🔧 getStartConfig.ts

**Розташування**: `src/helpers/getStartConfig.ts`

### Назначение

Helper функція для ініціалізації конфігурації валідації на основі вибраної версії та групи.

### Сигнатура

```typescript
export function getStartConfig(isMaster: boolean, groupName: string): StartConfig
```

### Параметри

| Параметр    | Тип       | Опис                                           |
| ----------- | --------- | ---------------------------------------------- |
| `isMaster`  | `boolean` | `true` — для магістра, `false` — для бакалавра |
| `groupName` | `string`  | Назва групи спеціальності ('ІПЗ', 'КБ' тощо)   |

### Повернене значення

```typescript
interface StartConfig {
  // Конкретна структура залежить від модуля validator
  // Але майже завжди включає:
  isMaster: boolean
  groupName: string
  // ...правила валідації для обраної групи та рівня
}
```

### Приклад використання

```typescript
import { getStartConfig } from 'src/helpers/getStartConfig'

// Отримати конфіг для магістра, група КТ
const config = getStartConfig(true, 'КТ')

// Отримати конфіг для бакалавра, група ІПЗ
const config = getStartConfig(false, 'ІПЗ')
```

### В контексті App компонента

```typescript
const isMasterDefault = true
const [config, setConfig] = useState<StartConfig>(getStartConfig(isMasterDefault, groupsConfig[0]))

// При зміні налаштувань:
const handleConfigChange = (isMaster: boolean, group: string) => {
  setConfig(getStartConfig(isMaster, group))
}
```

---

## 📦 package.json — Конфігурація проекту

**Розташування**: `package.json`

### Основна інформація

```json
{
  "name": "diploma-ui",
  "version": "0.2.0",
  "private": true,
  "homepage": "https://victorchei.github.io/pdf-validator"
}
```

**Версійність**: Версія в `package.json` повинна збігатися з версією в:

- `CHANGELOG.md` (див. поточний релиз)
- `src/components/TopInfo/index.tsx` (константа `APP_VERSION`)
- Версія відображається на UI як badge поруч із заголовком

### Вимоги до оточення

```json
{
  "engines": {
    "npm": ">=8.0.0",
    "node": ">=18.0.0"
  }
}
```

### Скрипти

```json
{
  "scripts": {
    "start": "react-scripts start", // Запуск dev сервера
    "test": "jest --coverage", // Запуск тестів
    "build": "react-scripts build", // Білд для продакшену
    "predeploy": "npm run build", // Автоматично перед deploy
    "deploy": "gh-pages -d build" // Деплой на GitHub Pages
  }
}
```

### Запуск скриптів

```bash
npm start        # Розробка на http://localhost:3000
npm test         # Запуск тестів з покриттям
npm run build    # Створити папку build/
npm run deploy   # Деплой на GitHub Pages
```

---

## 🔗 tsconfig.json — Конфігурація TypeScript

**Розташування**: `tsconfig.json`

### Основні налаштування

```json
{
  "compilerOptions": {
    "target": "es2020", // Цільова версія JavaScript
    "lib": ["es2020", "dom", "dom.iterable"],
    "jsx": "react-jsx", // JSX конфіг для React 18
    "module": "esnext", // Модульна система
    "moduleResolution": "bundler", // Дозволяє абсолютні шляхи
    "baseUrl": ".", // Базовий шлях для імпортів
    "strict": true, // Строгі перевірки типів
    "esModuleInterop": true, // Сумісність ES6 модулів
    "skipLibCheck": true, // Пропускати перевірку типів lib
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true, // Імпорт JSON файлів
    "declaration": true, // Генерувати .d.ts файли
    "declarationMap": true // Карти для .d.ts файлів
  },
  "include": ["src"],
  "exclude": ["node_modules", "build", "dist"]
}
```

### Налаштування путів імпортів

```json
{
  "compilerOptions": {
    "paths": {
      "src/*": ["src/*"] // Дозволяє писати: import from 'src/components'
    }
  }
}
```

---

## 📄 .github/workflows/deploy.yml — CI/CD Конфіг

**Розташування**: `.github/workflows/deploy.yml`

### Назначение

GitHub Actions workflow для автоматичного деплою на GitHub Pages при кожному коміті в `master`.

### Конфіг

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - master

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

### Як це працює

1. **Тригер**: При push в гілку `master`
2. **Checkout**: Завантажує останній код
3. **Setup Node**: Встановлює Node.js 18
4. **Install**: Встановлює залежності
5. **Build**: Запускає `npm run build`
6. **Deploy**: Деплоїть папку `build/` на GitHub Pages

---

## 🎨 CSS/SCSS Конфігурація

### reset.css

**Розташування**: `src/style/reset.css`

Скидає стандартні стилі браузера для консистентного оформлення на всіх платформах.

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,

  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
}
```

### index.css

**Розташування**: `src/style/index.css`

Глобальні стилі проекту.

```css
.App {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Material-UI override */
.MuiButton-root {
  /* кастомні стилі для кнопок */
}
```

---

## ✅ Контрольний список конфігурації

При налаштуванні нового проекту або оновленні переконайтесь:

- [ ] `groupsConfig.ts` містить всі необхідні групи
- [ ] `errorsConfig.ts` містить всі типи помилок
- [ ] `getStartConfig.ts` повертає коректну конфігурацію
- [ ] `package.json` має всі залежності
- [ ] `tsconfig.json` налаштований правильно
- [ ] `.github/workflows/deploy.yml` налаштований для вашого репозиторію
- [ ] `homepage` в `package.json` збігається з URL GitHub Pages

---

**Статус**: ✅ Актуально  
**Останнє оновлення**: Січень 2026
