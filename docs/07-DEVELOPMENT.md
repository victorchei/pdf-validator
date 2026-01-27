# 👨‍💻 Розробка

Гайд для розробників, котрі хочуть працювати над проектом.

---

## 🚀 Встановлення для розробки

### Передумови

```bash
node --version    # v18.0.0+
npm --version     # 8.0.0+
git --version     # будь-яка сучасна версія
```

### Клонування та встановлення

```bash
git clone https://github.com/victorchei/pdf-validator.git
cd pdf-validator
npm install
npm start
```

Додаток відкриється на `http://localhost:3000`

---

## 🌿 Git workflow

### Структура гілок

```
master (продакшн)
  ↑
  ↓
develop (розробка)
  ├─── feature/описание
  ├─── bugfix/описание
  └─── refactor/описание
```

### Процес розробки

#### 1. Створення гілки функції

```bash
# Переходимо на develop
git checkout develop
git pull origin develop

# Створюємо нову гілку
git checkout -b feature/назва-функції

# Приклади:
git checkout -b feature/add-dark-theme
git checkout -b bugfix/fix-validation-error
git checkout -b refactor/extract-validation-logic
```

#### 2. Розробка

```bash
# Редагуємо файли
# Тестуємо локально
npm start

# Коммітимо зміни
git add .
git commit -m "описання змін"

# Пуш в GitHub
git push origin feature/назва-функції
```

#### 3. Pull Request

1. Відкриваємо PR в GitHub
2. Додаємо опис змін
3. Чекаємо review
4. Мержимо в `develop`

#### 4. Деплой в master

```bash
git checkout master
git pull origin master
git merge develop
git push origin master

# Автоматичний деплой на GitHub Pages
```

### Правила комітів

**Формат**:

```
<тип>: <описание>

<детальное описание (опционально)>
```

**Типи**:

- `feat:` — нова функція
- `fix:` — виправлення помилки
- `refactor:` — рефакторинг коду
- `style:` — форматування, відсутні точки з комами
- `test:` — додавання тестів
- `docs:` — оновлення документації
- `chore:` — оновлення залежностей

**Приклади**:

```bash
git commit -m "feat: add dark theme toggle"
git commit -m "fix: correct PDF validation error"
git commit -m "docs: update installation guide"
git commit -m "refactor: extract validation logic to hook"
```

---

## 🎨 Структура компонента

### Шаблон нового компонента

```typescript
import React from 'react'

interface ComponentProps {
  prop1: string
  prop2?: number
  onAction?: (value: string) => void
}

/**
 * Опис компонента
 *
 * Використання:
 * <MyComponent prop1="value" />
 */
export const MyComponent: React.FC<ComponentProps> = ({
  prop1,
  prop2 = 0,
  onAction,
}) => {
  // State
  const [state, setState] = React.useState('')

  // Effects
  React.useEffect(() => {
    // setup
    return () => {
      // cleanup
    }
  }, [])

  // Handlers
  const handleClick = () => {
    setState('new value')
    onAction?.(state)
  }

  // Render
  return (
    <div>
      <p>{prop1}</p>
      <button onClick={handleClick}>Click</button>
    </div>
  )
}

export default MyComponent
```

### Структура файлу компонента

```
src/components/MyComponent/
├── index.tsx           # Основний файл компонента
├── MyComponent.tsx     # (опціонально) Якщо файл дуже великий
├── styles.css          # (опціонально) Локальні стилі
└── types.ts            # (опціонально) TypeScript типи
```

---

## 🧪 Тестування

### Запуск тестів

```bash
# Запуск усіх тестів
npm test

# Запуск тестів з покриттям
npm test -- --coverage

# Запуск тестів для конкретного файлу
npm test -- MyComponent.test.tsx

# Стоп режим (watch mode)
npm test -- --watch
```

### Написання тестів

**Приклад**: `src/components/App.test.tsx`

```typescript
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />)
    const element = screen.getByText(/завантажте/i)
    expect(element).toBeInTheDocument()
  })

  test('loads PDF file', async () => {
    render(<App />)
    const input = screen.getByLabelText(/завантажте дипломну роботу/i)
    expect(input).toBeInTheDocument()
  })
})
```

### Best Practices для тестів

✅ **Правильно**:

```typescript
// Тестуємо поведінку, а не реалізацію
test('button calls handler when clicked', () => {
  const handleClick = jest.fn()
  render(<MyComponent onClick={handleClick} />)
  userEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalled()
})
```

❌ **Неправильно**:

```typescript
// Не тестуємо деталі реалізації
test('useState is called', () => {
  // Не можна перевіряти використання useState
})
```

---

## 🔧 Hot Reload та Debug

### Hot Module Replacement (HMR)

React Scripts автоматично підтримує HMR. При збереженні файлу:

```
1. Файл оновлюється
2. Тільки змінений компонент перезавантажується
3. Стан збережеться (якщо можливо)
```

### DevTools

#### React DevTools

```bash
# Chrome extension
# https://chromewebstore.google.com/detail/react-developer-tools

# Дозволяє:
# - Переглядати компоненти
# - Редагувати props
# - Стежити за state зміни
```

#### Redux DevTools (якщо додасте Redux)

```bash
# Chrome extension для стану
# https://chromewebstore.google.com/detail/redux-devtools
```

### Console debugging

```typescript
// Логування
console.log('Дані:', errorsData)
console.warn('Попередження:', message)
console.error('Помилка:', error)

// Таблиця в консолі
console.table(Object.entries(errorsData))

// Вимірювання часу
console.time('validation')
await check(...)
console.timeEnd('validation')
```

---

## 📝 Lint та Formatting

### Prettier (Форматування)

```bash
# Форматує весь код за налаштуванням
npx prettier --write .

# Або просто збережіть файл в VSCode (auto-format on save)
```

### ESLint (Лінтинг)

```bash
# Перевірити помилки лінту
npx eslint src/

# Автоматично виправити
npx eslint src/ --fix
```

### Налаштування VSCode

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## 📚 Виконання типових завдань

### Додати новий компонент

1. Створити папку: `src/components/NewComponent/`
2. Створити файл: `src/components/NewComponent/index.tsx`
3. Реалізувати компонент за шаблоном вище
4. Експортувати з батьківського компонента

```typescript
// App.tsx
import { NewComponent } from './NewComponent'

export default function App() {
  return (
    <>
      <NewComponent prop1="value" />
    </>
  )
}
```

### Додати нову конфігурацію помилок

1. Додати новий тип в `ERROR_TYPE` enum
2. Додати в `errorMapper.title`
3. Додати конкретні помилки в `errorMapper[ERROR_TYPE.newType]`

```typescript
// src/config/errorsConfig.ts
export const errorMapper: ErrorMapper = {
  title: {
    // ...старі типи
    [ERROR_TYPE.newType]: 'Нова категорія помилок',
  },

  [ERROR_TYPE.newType]: {
    rule0: 'Перше правило',
    rule1: 'Друге правило',
  },
}
```

### Змінити стилізацію

**Global styles**: `src/style/index.css`

```css
.App {
  /* глобальні стилі */
}
```

**Component styles** (Material-UI):

```typescript
import { Box, styled } from '@mui/material'

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}))
```

### Обновити залежність

```bash
# Перевіряємо версії
npm outdated

# Оновлюємо конкретний пакет
npm install package-name@latest

# Оновлюємо всі пакети
npm update

# Перевіряємо що не зламалось
npm test
npm start
```

---

## 🚨 Розв'язання проблем під час розробки

### Порт 3000 займий

```bash
# Знайти і закрити процес
lsof -i :3000
kill -9 <PID>

# Або запустити на іншому порту
PORT=3001 npm start
```

### npm install падає

```bash
# Очистити кеш
npm cache clean --force

# Видалити lock файли та переінстальовувати
rm -rf node_modules package-lock.json
npm install
```

### TypeScript помилки

```bash
# Перевірити всі помилки
npx tsc --noEmit

# Оновити типи
npm install --save-dev @types/package-name
```

### HMR не працює

```bash
# Перезавантажити вручну
# Ctrl+R (Cmd+R на Mac)

# Або перезапустити dev сервер
# Ctrl+C і потім npm start
```

---

## 📊 Профайлінг і оптимізація

### React Profiler

```typescript
import { Profiler } from 'react'

<Profiler id="App" onRender={onRenderCallback}>
  <App />
</Profiler>
```

### Вимірювання wydajności

```typescript
// Chrome DevTools → Performance
// 1. Натисніть Record
// 2. Виконайте дію
// 3. Натисніть Stop
// 4. Аналізуйте результати
```

### Web Vitals

```bash
# Перевіряємо Core Web Vitals
npm run build
npm install -g serve
serve -s build

# Відкриємо в браузері та вимірюємо
# Lighthouse (F12 → Lighthouse)
```

---

## 🎯 Рекомендовані розширення VSCode

1. **ES7+ React/Redux/React-Native snippets** — snippets для React
2. **Prettier - Code formatter** — форматування
3. **ESLint** — лінтинг
4. **TypeScript Vue Plugin** — підтримка TypeScript
5. **Thunder Client** — тестування API

---

## 📞 Отримання допомоги

- **Документація** → див. інші файли в `/docs`
- **GitHub Issues** → посилайте проблеми та питання
- **React docs** → https://react.dev
- **TypeScript docs** → https://www.typescriptlang.org/docs/

---

**Статус**: ✅ Актуально  
**Останнє оновлення**: Січень 2026
