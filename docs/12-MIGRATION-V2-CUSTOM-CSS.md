# План v2: Видалення MUI — власна дизайн-система на CSS

## Підсумок

Повне видалення Material UI. Створення власної колекції базових компонентів та дизайн-системи на основі бренд-буку Житомирської політехніки. CSS custom properties для токенів, CSS Modules для компонентів.

**Джерело бренду**: [media.ztu.edu.ua](https://media.ztu.edu.ua/)
**Бренд-бук проекту**: [docs/brand/BRAND-BOOK.md](./brand/BRAND-BOOK.md)

---

## Архітектура стилізації

```
src/
├── styles/
│   ├── variables.css          ← CSS custom properties (токени бренду)
│   ├── reset.css              ← CSS reset (оновлений)
│   ├── global.css             ← Глобальні стилі (градієнт, body)
│   └── index.css              ← Entry point (@import all)
├── ui/                        ← Дизайн-система (базові компоненти)
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.module.css
│   ├── Input/
│   │   ├── Input.tsx
│   │   └── Input.module.css
│   ├── Select/
│   │   ├── Select.tsx
│   │   └── Select.module.css
│   ├── Switch/
│   │   ├── Switch.tsx
│   │   └── Switch.module.css
│   ├── Modal/
│   │   ├── Modal.tsx
│   │   └── Modal.module.css
│   ├── Badge/
│   │   ├── Badge.tsx
│   │   └── Badge.module.css
│   ├── TreeView/
│   │   ├── TreeView.tsx
│   │   └── TreeView.module.css
│   ├── FormField/
│   │   ├── FormField.tsx
│   │   └── FormField.module.css
│   └── index.ts               ← Barrel export
├── components/                ← Бізнес-компоненти (використовують ui/)
│   ├── App.tsx
│   ├── TopInfo/
│   ├── Settings/
│   ├── ControlledTreeView.tsx
│   ├── Feedback/
│   └── Authors/
└── theme/
    └── brandTokens.ts         ← TypeScript токени (для JS-доступу)
```

---

## Фаза 1: Токени та глобальні стилі

**Коміт**: `feat(v2): add brand CSS tokens and global styles`

### Нові файли

#### `src/styles/variables.css`

```css
:root {
  /* Colors — Primary */
  --color-primary: #224A98;
  --color-primary-hover: #004D85;
  --color-secondary: #4CAD3B;

  /* Colors — Accent */
  --color-error: #E53E23;
  --color-warning: #EE781C;

  /* Colors — Neutral */
  --color-text: #404248;
  --color-text-secondary: #666666;
  --color-link: #0366D6;
  --color-bg: #FFFFFF;
  --color-border: #E0E0E0;
  --color-divider: #E0E0E0;

  /* Typography */
  --font-family: 'Montserrat', Arial, sans-serif;
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.85rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;
  --font-size-3xl: 3rem;
  --font-size-4xl: 4rem;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-8: 48px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 11px 15px -7px rgba(0, 0, 0, 0.2);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;

  /* Gradient */
  --gradient-bg: linear-gradient(0deg, var(--color-primary) 0%, var(--color-secondary) 100%);
}
```

#### `src/theme/brandTokens.ts`

```typescript
export const brandTokens = {
  primary:  { blue: '#224A98', green: '#4CAD3B' },
  accent:   { red: '#E53E23', orange: '#EE781C' },
  neutral:  { darkBlue: '#004D85', text: '#404248', link: '#0366D6', white: '#FFFFFF' },
  font:     { family: "'Montserrat', Arial, sans-serif", weightRegular: 400, weightBold: 700 },
} as const
```

#### `src/styles/global.css`

```css
@import url('./variables.css');
@import url('./reset.css');

body {
  font-family: var(--font-family);
  color: var(--color-text);
  background: var(--gradient-bg);
  background-repeat: no-repeat;
  background-size: cover;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.App {
  min-height: 100vh;
  padding-top: var(--space-6);
}
```

#### Оновити `public/index.html`

- Google Fonts: Roboto → Montserrat (400, 700)
- `<meta name="theme-color" content="#224A98" />`

---

## Фаза 2: Базові UI компоненти (дизайн-система)

**Коміт**: `feat(v2): create base UI component library`

### Компоненти для створення

#### 2.1 `src/ui/Button/Button.tsx` + `Button.module.css`

Замінює: `@mui/material/Button`

```typescript
interface ButtonProps {
  variant?: 'contained' | 'outlined' | 'text'
  color?: 'primary' | 'secondary' | 'error'
  type?: 'button' | 'submit'
  href?: string
  target?: string
  onClick?: () => void
  children: React.ReactNode
}
```

CSS Module стилі: `.button`, `.contained`, `.outlined`, `.text`, `.primary`, `.secondary`, `.error`

#### 2.2 `src/ui/Input/Input.tsx` + `Input.module.css`

Замінює: `@mui/material/Input`, `@mui/material/TextField`

```typescript
interface InputProps {
  type?: 'text' | 'number' | 'file'
  size?: 'small' | 'medium'
  label?: string
  fullWidth?: boolean
  inputRef?: React.Ref<HTMLInputElement>
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
```

#### 2.3 `src/ui/Select/Select.tsx` + `Select.module.css`

Замінює: `@mui/material/Select` + `MenuItem`

```typescript
interface SelectProps {
  value: string
  size?: 'small' | 'medium'
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
}
```

Використовує native `<select>` + `<option>`.

#### 2.4 `src/ui/Switch/Switch.tsx` + `Switch.module.css`

Замінює: `@mui/material/Switch` + `FormControlLabel`

```typescript
interface SwitchProps {
  checked: boolean
  label?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
```

Custom toggle на `<input type="checkbox">` зі стилізацією через CSS.

#### 2.5 `src/ui/Modal/Modal.tsx` + `Modal.module.css`

Замінює: `@mui/material/Modal` + `Box`

```typescript
interface ModalProps {
  open: boolean
  onClose: () => void
  ariaLabel?: string
  children: React.ReactNode
}
```

Overlay + centered content. Закриття по Escape та click на overlay.

#### 2.6 `src/ui/Badge/Badge.tsx` + `Badge.module.css`

Замінює: `@mui/material/Chip`

```typescript
interface BadgeProps {
  label: string
  variant?: 'filled' | 'outlined'
  color?: 'primary' | 'secondary'
  size?: 'small' | 'medium'
}
```

#### 2.7 `src/ui/TreeView/TreeView.tsx` + `TreeView.module.css`

Замінює: `@mui/x-tree-view/TreeView` + `TreeItem`

```typescript
interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
}

interface TreeViewProps {
  data: TreeNode[]
  defaultExpanded?: string[]
}
```

Custom компонент з `<ul>/<li>`, toggle через `useState`, SVG іконки chevron.

#### 2.8 `src/ui/FormField/FormField.tsx` + `FormField.module.css`

Новий компонент — обгортка для form елементів з label.

```typescript
interface FormFieldProps {
  label: string
  direction?: 'row' | 'column'
  children: React.ReactNode
}
```

#### 2.9 `src/ui/index.ts` — barrel export

```typescript
export { Button } from './Button/Button'
export { Input } from './Input/Input'
export { Select } from './Select/Select'
export { Switch } from './Switch/Switch'
export { Modal } from './Modal/Modal'
export { Badge } from './Badge/Badge'
export { TreeView } from './TreeView/TreeView'
export { FormField } from './FormField/FormField'
```

---

## Фаза 3: Міграція бізнес-компонентів

**Коміт**: `refactor(v2): migrate components from MUI to custom UI library`

### Маппінг замін по файлах

| Файл | MUI → Custom UI |
|------|-----------------|
| `App.tsx` | `Stack` → `<div style={{ display: 'flex', flexDirection: 'column' }}>`. `Input` → `<Input type="file" />` |
| `TopInfo/index.tsx` | `Typography` → `<h1>`, `<p>`. `Box` → `<div>`. `Chip` → `<Badge />`. Додати `TopInfo.module.css` |
| `Settings/index.tsx` | `Modal` → `<Modal />`. `Button` → `<Button />`. `Select+MenuItem` → `<Select />`. `Switch` → `<Switch />`. `Typography` → `<h2>`, `<p>`. Додати `Settings.module.css` |
| `SettingsForm/index.tsx` | `Stack` → `<div className={styles.stack}>`. `Button` → `<Button />`. `Divider` → `<hr />`. `Typography` → `<h3>`, `<p>`. Додати `SettingsForm.module.css` |
| `SettingsForm/FormInput.tsx` | `FormControlLabel+Switch` → `<Switch label={...} />`. `TextField` → `<Input />`. `Stack` → `<FormField />` |
| `ControlledTreeView.tsx` | `TreeView+TreeItem` → `<TreeView />`. Іконки → SVG inline |
| `Feedback/index.tsx` | `Button` → `<Button />`. `Typography` → `<p>`. Додати `Feedback.module.css` |
| `Authors/index.tsx` | `Typography` → `<p>`. Додати `Authors.module.css` |

---

## Фаза 4: Видалення MUI залежностей

**Коміт**: `chore(v2): remove Material UI dependencies`

```bash
npm uninstall @mui/material @mui/icons-material @mui/x-tree-view @emotion/react @emotion/styled
```

### Видалити з `package.json`

```json
"@emotion/react": "^11.11.1",        // ВИДАЛИТИ
"@emotion/styled": "^11.11.0",       // ВИДАЛИТИ
"@mui/icons-material": "^5.14.11",   // ВИДАЛИТИ
"@mui/material": "^5.14.11",         // ВИДАЛИТИ
"@mui/x-tree-view": "^6.17.0",       // ВИДАЛИТИ
```

Також видалити `@types/pdfjs-dist` якщо не використовується.

---

## Фаза 5: Фінальна перевірка

**Коміт**: `chore(v2): cleanup and verify custom design system`

- [ ] `npm start` — без помилок
- [ ] `npm run build` — production build проходить
- [ ] Візуальна перевірка всіх компонентів
- [ ] Перевірка responsive (media queries)
- [ ] Перевірка Settings modal (відкриття/закриття, Escape)
- [ ] Перевірка TreeView (розгортання/згортання)
- [ ] Перевірка Switch toggle
- [ ] Перевірка file upload
- [ ] Bundle size порівняння (до/після)
- [ ] Видалити невикористані файли

---

## Зведена таблиця змін

| Файл | Дія | Фаза |
|------|-----|------|
| `src/styles/variables.css` | **CREATE** | 1 |
| `src/styles/global.css` | **CREATE** | 1 |
| `src/theme/brandTokens.ts` | **CREATE** | 1 |
| `public/index.html` | MODIFY | 1 |
| `src/ui/Button/*` | **CREATE** (2 files) | 2 |
| `src/ui/Input/*` | **CREATE** (2 files) | 2 |
| `src/ui/Select/*` | **CREATE** (2 files) | 2 |
| `src/ui/Switch/*` | **CREATE** (2 files) | 2 |
| `src/ui/Modal/*` | **CREATE** (2 files) | 2 |
| `src/ui/Badge/*` | **CREATE** (2 files) | 2 |
| `src/ui/TreeView/*` | **CREATE** (2 files) | 2 |
| `src/ui/FormField/*` | **CREATE** (2 files) | 2 |
| `src/ui/index.ts` | **CREATE** | 2 |
| `src/components/App.tsx` | MODIFY | 3 |
| `src/components/TopInfo/*` | MODIFY + CREATE .module.css | 3 |
| `src/components/Settings/*` | MODIFY + CREATE .module.css | 3 |
| `src/components/ControlledTreeView.tsx` | MODIFY | 3 |
| `src/components/Feedback/*` | MODIFY + CREATE .module.css | 3 |
| `src/components/Authors/*` | MODIFY + CREATE .module.css | 3 |
| `src/index.tsx` | MODIFY (видалити ThemeProvider) | 4 |
| `package.json` | MODIFY (видалити MUI deps) | 4 |

**Нові файли**: ~22 | **Змінювані файли**: ~10 | **Видалені залежності**: 5

---

**Статус**: Готово до ревю
**Останнє оновлення**: Січень 2026
