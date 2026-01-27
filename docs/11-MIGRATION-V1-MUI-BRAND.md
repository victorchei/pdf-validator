# План: Адаптація MUI теми під бренд-бук Житомирської політехніки

## Підсумок

Залишаємо Material UI, але створюємо кастомну тему на основі бренд-буку. Замінюємо Roboto на Montserrat, оновлюємо кольори, додаємо CSS-змінні та CSS Modules для компонентів.

**Джерело бренду**: [media.ztu.edu.ua](https://media.ztu.edu.ua/)
**Бренд-бук проекту**: [docs/brand/BRAND-BOOK.md](./brand/BRAND-BOOK.md)

---

## Зміст

1. [Поточний стан](#поточний-стан)
2. [Цільовий стан](#цільовий-стан)
3. [Фаза 1: Інфраструктура теми](#фаза-1-інфраструктура-теми)
4. [Фаза 2: Підключення теми та заміна шрифту](#фаза-2-підключення-теми-та-заміна-шрифту)
5. [Фаза 3: Заміна hardcoded кольорів](#фаза-3-заміна-hardcoded-кольорів-у-компонентах)
6. [Фаза 4: CSS Modules](#фаза-4-css-modules-для-компонентів)
7. [Фаза 5: Фінальна перевірка](#фаза-5-фінальна-перевірка-та-cleanup)
8. [Зведена таблиця змін](#зведена-таблиця-змін)
9. [Верифікація](#верифікація)

---

## Поточний стан

| Аспект | Зараз |
|--------|-------|
| **Тема MUI** | Дефолтна (без ThemeProvider, без createTheme) |
| **Шрифт** | Roboto (Google Fonts) |
| **Стилізація** | sx props з hardcoded значеннями |
| **CSS змінні** | Відсутні |
| **CSS Modules** | Не використовуються |
| **Градієнт фону** | `#3A93E9` (синій) → `#ECE61C` (жовтий) |
| **Кольори** | Hardcoded: `#fff`, `#000`, `#666`, MUI defaults |

### Поточне використання MUI по файлах

| Файл | MUI компоненти |
|------|----------------|
| `App.tsx` | Stack, Input |
| `TopInfo/index.tsx` | Box, Chip, Typography |
| `Settings/index.tsx` | Modal, Box, Button, Typography, Select, MenuItem, Switch |
| `Settings/SettingsForm/index.tsx` | Stack, Button, Divider, Typography |
| `Settings/SettingsForm/FormInput.tsx` | Stack, Switch, FormControlLabel, TextField |
| `ControlledTreeView.tsx` | TreeView, TreeItem, ChevronRightIcon, ExpandMoreIcon |
| `Feedback/index.tsx` | Button, Typography |
| `Authors/index.tsx` | Typography |

---

## Цільовий стан

| Аспект | Після міграції |
|--------|----------------|
| **Тема MUI** | Кастомна тема з `createTheme()` + `ThemeProvider` |
| **Шрифт** | Montserrat (Regular 400 / Bold 700) |
| **Стилізація** | Тема + CSS змінні + CSS Modules для складних стилів |
| **CSS змінні** | `variables.css` з токенами бренду |
| **CSS Modules** | Для компонентів зі складними inline стилями |
| **Градієнт фону** | `#224A98` (синій) → `#4CAD3B` (зелений) |
| **Кольори** | Палітра бренд-буку через тему та CSS змінні |

### Палітра бренду

| Колір | HEX | Роль |
|-------|-----|------|
| **Синій** | `#224A98` | Primary — заголовки, кнопки, навігація |
| **Зелений** | `#4CAD3B` | Secondary — success, switch checked |
| **Червоний** | `#E53E23` | Error — помилки валідації, alerts |
| **Помаранчевий** | `#EE781C` | Warning — попередження |
| **Темно-синій** | `#004D85` | Button hover, footer |
| **Текст** | `#404248` | Основний текст |
| **Посилання** | `#0366D6` | Лінки |

---

## Фаза 1: Інфраструктура теми

**Коміт**: `feat: add brand theme tokens, MUI theme, and CSS custom properties`

### Нові файли

#### `src/theme/brandTokens.ts` — єдине джерело правди

```typescript
export const brandTokens = {
  primary: {
    blue: '#224A98',
    green: '#4CAD3B',
  },
  accent: {
    red: '#E53E23',
    orange: '#EE781C',
  },
  neutral: {
    darkBlue: '#004D85',
    text: '#404248',
    link: '#0366D6',
    white: '#FFFFFF',
  },
  font: {
    family: "'Montserrat', Arial, sans-serif",
    weightRegular: 400,
    weightBold: 700,
  },
} as const
```

#### `src/theme/theme.ts` — MUI тема

```typescript
import { createTheme } from '@mui/material/styles'
import { brandTokens } from './brandTokens'

export const theme = createTheme({
  palette: {
    primary:   { main: brandTokens.primary.blue },
    secondary: { main: brandTokens.primary.green },
    error:     { main: brandTokens.accent.red },
    warning:   { main: brandTokens.accent.orange },
    text:      { primary: brandTokens.neutral.text },
    background: {
      default: brandTokens.neutral.white,
      paper: brandTokens.neutral.white,
    },
  },
  typography: {
    fontFamily: brandTokens.font.family,
    fontWeightRegular: brandTokens.font.weightRegular,
    fontWeightBold: brandTokens.font.weightBold,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: brandTokens.primary.blue,
          '&:hover': { backgroundColor: brandTokens.neutral.darkBlue },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': { color: brandTokens.primary.green },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: brandTokens.primary.green,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlinedPrimary: {
          borderColor: brandTokens.primary.blue,
          color: brandTokens.primary.blue,
        },
      },
    },
  },
})
```

#### `src/theme/index.ts` — barrel export

```typescript
export { theme } from './theme'
export { brandTokens } from './brandTokens'
```

#### `src/style/variables.css` — CSS custom properties

```css
:root {
  /* Brand primary */
  --color-primary-blue: #224A98;
  --color-primary-green: #4CAD3B;

  /* Brand accent */
  --color-accent-red: #E53E23;
  --color-accent-orange: #EE781C;

  /* Neutral */
  --color-dark-blue: #004D85;
  --color-text: #404248;
  --color-link: #0366D6;
  --color-white: #FFFFFF;

  /* Typography */
  --font-family: 'Montserrat', Arial, sans-serif;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Gradient */
  --gradient-bg: linear-gradient(
    0deg,
    var(--color-primary-blue) 0%,
    var(--color-primary-green) 100%
  );
}
```

---

## Фаза 2: Підключення теми та заміна шрифту

**Коміт**: `feat: wire ThemeProvider, replace Roboto with Montserrat, update gradient`

### Змінювані файли

#### `public/index.html`

```html
<!-- ВИДАЛИТИ -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&display=swap" rel="stylesheet" />

<!-- ДОДАТИ -->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />

<!-- ЗМІНИТИ theme-color -->
<meta name="theme-color" content="#224A98" />
```

#### `src/style/reset.css`

```css
/* Рядок ~129: змінити font-family */
body {
  font-family: 'Montserrat', Arial, sans-serif;  /* було: Roboto, sans-serif */
}
```

#### `src/style/index.css`

```css
@import url("./reset.css");
@import url("./variables.css");  /* ДОДАТИ */

body {
  background: var(--gradient-bg);  /* було: linear-gradient(#3A93E9, #ECE61C) */
  background-repeat: no-repeat;
  background-size: cover;
}

.App {
  min-height: 100vh;
  padding-top: 32px;
  color: var(--color-text);  /* ДОДАТИ */
}
```

#### `src/index.tsx`

```tsx
import { ThemeProvider } from '@mui/material/styles'  // ДОДАТИ
import CssBaseline from '@mui/material/CssBaseline'   // ДОДАТИ
import { theme } from './theme'                         // ДОДАТИ

// Обгорнути App:
<StrictMode>
  <ThemeProvider theme={theme}>       {/* ДОДАТИ */}
    <CssBaseline />                    {/* ДОДАТИ */}
    <BrowserRouter basename="/pdf-validator">
      <App />
    </BrowserRouter>
  </ThemeProvider>                     {/* ДОДАТИ */}
</StrictMode>
```

---

## Фаза 3: Заміна hardcoded кольорів у компонентах

**Коміт**: `refactor: replace hardcoded colors with theme tokens`

| Файл | Було | Стало |
|------|------|-------|
| `TopInfo/index.tsx` | `color: '#666'` | `color: 'text.secondary'` |
| `Settings/index.tsx` | `border: '2px solid #000'` | `borderColor: 'divider'` |
| `Settings/index.tsx` | `background: '#fff'` (Select) | `background: 'background.paper'` |
| `SettingsForm/index.tsx` | `backgroundColor: '#fff'` | `backgroundColor: 'background.paper'` |

### Що НЕ змінюється

Компоненти, що використовують MUI props (`color="error"`, `variant="contained"`), **автоматично** підхоплять нову тему:

- `App.tsx` — без hardcoded кольорів
- `FormInput.tsx` — без hardcoded кольорів
- `ControlledTreeView.tsx` — без hardcoded кольорів
- `Feedback/index.tsx` — `variant="contained"` → автоматично бренд-синій
- `Authors/index.tsx` — без hardcoded кольорів

---

## Фаза 4: CSS Modules для компонентів

**Коміт**: `refactor: extract complex inline styles to CSS Modules`

### Правило

- **Виносимо** в CSS Module: media queries, складні позиціонування, великі style-об'єкти
- **Залишаємо** як sx prop: прості значення (`mb: 2`, `textAlign: 'center'`) — це ідіоматичний MUI

### Нові CSS Module файли

#### `src/components/TopInfo/TopInfo.module.css`

```css
.title {
  font-size: 4rem;
  text-align: center;
  margin: 16px;
  margin-bottom: 0;
}

@media (max-width: 900px) {
  .title { font-size: 3rem; }
}

@media (max-width: 600px) {
  .title { font-size: 2rem; }
}

.subtitle {
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-text);
  margin-bottom: 24px;
}
```

**Зміна у `TopInfo/index.tsx`**:
```tsx
import styles from './TopInfo.module.css'

// Замість sx={{ fontSize: '4rem', '@media...' }}:
<h1 className={styles.title}>...</h1>
```

#### `src/components/Settings/Settings.module.css`

```css
.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 90vw;
  background-color: var(--color-white);
  border: 2px solid var(--color-dark-blue);
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2);
  padding: 32px;
  padding-top: 0;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
}
```

**Зміна у `Settings/index.tsx`**:
```tsx
import styles from './Settings.module.css'

// Замість sx={style} на Box:
<div className={styles.modal}>...</div>
```

#### `src/components/Authors/Authors.module.css`

```css
.authors {
  margin: auto 50px 50px 50px;
}
```

**Зміна у `Authors/index.tsx`**:
```tsx
import styles from './Authors.module.css'

// Замість style={{ margin: 'auto 50px 50px 50px' }}:
<div className={styles.authors}>...</div>
```

---

## Фаза 5: Фінальна перевірка та cleanup

**Коміт**: `chore: cleanup and verify brand theme integration`

- [ ] Перевірити що `CssBaseline` не конфліктує з `reset.css`
- [ ] Пошук залишкових hardcoded `#hex` кольорів у компонентах
- [ ] Перевірити градієнт, шрифт, кнопки, switch, chip
- [ ] Оновити `<title>` в `index.html` якщо потрібно
- [ ] Видалити невикористані стилі

---

## Зведена таблиця змін

| Файл | Дія | Фаза |
|------|-----|------|
| `src/theme/brandTokens.ts` | **CREATE** | 1 |
| `src/theme/theme.ts` | **CREATE** | 1 |
| `src/theme/index.ts` | **CREATE** | 1 |
| `src/style/variables.css` | **CREATE** | 1 |
| `public/index.html` | MODIFY | 2 |
| `src/style/reset.css` | MODIFY | 2 |
| `src/style/index.css` | MODIFY | 2 |
| `src/index.tsx` | MODIFY | 2 |
| `src/components/TopInfo/index.tsx` | MODIFY | 3, 4 |
| `src/components/Settings/index.tsx` | MODIFY | 3, 4 |
| `src/components/Settings/SettingsForm/index.tsx` | MODIFY | 3 |
| `src/components/TopInfo/TopInfo.module.css` | **CREATE** | 4 |
| `src/components/Settings/Settings.module.css` | **CREATE** | 4 |
| `src/components/Authors/Authors.module.css` | **CREATE** | 4 |
| `src/components/Authors/index.tsx` | MODIFY | 4 |

**Нові файли**: 7 | **Змінювані файли**: 8

---

## Верифікація

### Автоматична

```bash
npm start       # Запуск без помилок
npm run build   # Production build проходить
```

### Візуальна перевірка в браузері

| Що перевіряємо | Очікуваний результат |
|----------------|---------------------|
| Шрифт (DevTools → Computed → font-family) | `Montserrat` |
| Градієнт фону | Синій `#224A98` → Зелений `#4CAD3B` |
| Кнопки | Синій `#224A98`, hover → `#004D85` |
| Switch (checked) | Зелений `#4CAD3B` |
| Chip версії | Синій outlined |
| Modal border | `divider` колір (не чорний) |
| Текст | `#404248` |
| Responsive (TopInfo) | Заголовок зменшується на мобільних |
| Settings modal | Відкривається/закривається коректно |

---

## Архітектура стилізації (після міграції)

```
brandTokens.ts          ← єдине джерело правди
    ↓                ↓
theme.ts          variables.css
(MUI createTheme)   (CSS custom properties)
    ↓                ↓
ThemeProvider      CSS Modules
(sx props,          (.module.css для
 component props)    складних стилів)
```

**Статус**: Готово до імплементації
**Останнє оновлення**: Січень 2026
