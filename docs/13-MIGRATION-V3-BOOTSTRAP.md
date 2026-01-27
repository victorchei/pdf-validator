# План v3: Міграція з MUI на Bootstrap + react-bootstrap

## Підсумок

Видалення Material UI та заміна на react-bootstrap + Bootstrap 5. Кастомізація через SCSS-змінні під бренд-бук Житомирської політехніки. CSS Modules для компонент-специфічних стилів.

**Джерело бренду**: [media.ztu.edu.ua](https://media.ztu.edu.ua/)
**Бренд-бук проекту**: [docs/brand/BRAND-BOOK.md](./brand/BRAND-BOOK.md)

---

## Архітектура стилізації

```
src/
├── styles/
│   ├── _variables.scss        ← SCSS overrides (ПЕРЕД імпортом Bootstrap)
│   ├── bootstrap.scss         ← Імпорт Bootstrap з кастомізацією
│   ├── variables.css          ← CSS custom properties (додаткові токени)
│   └── global.css             ← Глобальні стилі додатку
├── components/
│   ├── App.tsx
│   ├── TopInfo/
│   │   ├── index.tsx
│   │   └── TopInfo.module.css
│   ├── Settings/
│   │   ├── index.tsx
│   │   ├── Settings.module.css
│   │   └── SettingsForm/
│   │       ├── index.tsx
│   │       └── FormInput.tsx
│   ├── ErrorTree/              ← Новий (замість ControlledTreeView)
│   │   ├── ErrorTree.tsx
│   │   └── ErrorTree.module.css
│   ├── Feedback/
│   ├── Authors/
│   └── index.tsx
└── theme/
    └── brandTokens.ts
```

---

## Нові залежності

### Встановити

```bash
npm install react-bootstrap@2.10.10 bootstrap@5.3.3 react-icons@5.4.0 sass
```

### Видалити

```bash
npm uninstall @mui/material @mui/icons-material @mui/x-tree-view @emotion/react @emotion/styled
```

---

## Маппінг компонентів MUI → react-bootstrap

| MUI | react-bootstrap | Примітка |
|-----|-----------------|----------|
| `Typography` | HTML теги (`<h1>`-`<h6>`, `<p>`) + Bootstrap utility classes | `fs-1`..`fs-6`, `fw-bold`, `text-muted` |
| `Box` | `<div>` + utility classes | `d-flex`, `align-items-center` |
| `Stack` | `import { Stack } from 'react-bootstrap'` | 1:1 заміна |
| `Button` | `import { Button } from 'react-bootstrap'` | 1:1 заміна. `variant="primary"` |
| `Modal` | `import { Modal } from 'react-bootstrap'` | `<Modal.Header>`, `<Modal.Body>`, `<Modal.Footer>` |
| `Input` | `<Form.Control type="text" />` | Частина `Form` |
| `TextField` | `<Form.Group>` + `<Form.Label>` + `<Form.Control>` | Композиція |
| `Select` + `MenuItem` | `<Form.Select>` + `<option>` | Native select |
| `Switch` | `<Form.Check type="switch" />` | `label` prop |
| `FormControlLabel` | `<Form.Check label="..." />` | Label через prop |
| `Chip` | `import { Badge } from 'react-bootstrap'` | `<Badge pill bg="primary">` |
| `Divider` | `<hr />` | Bootstrap стилізує автоматично |
| `TreeView + TreeItem` | **Кастомний компонент** з `Collapse` | Див. фазу 2 |
| `ChevronRightIcon` | `import { BsChevronRight } from 'react-icons/bs'` | |
| `ExpandMoreIcon` | `import { BsChevronDown } from 'react-icons/bs'` | |
| `SelectChangeEvent` | `React.ChangeEvent<HTMLSelectElement>` | Стандартний React тип |

---

## Фаза 1: Bootstrap інфраструктура та SCSS тема

**Коміт**: `feat(v3): add Bootstrap with brand SCSS theme`

### Нові файли

#### `src/styles/_variables.scss` — SCSS overrides

```scss
// Brand colors (BEFORE Bootstrap import!)
$primary: #224A98;
$secondary: #4CAD3B;
$danger: #E53E23;
$warning: #EE781C;
$dark: #004D85;
$body-color: #404248;
$link-color: #0366D6;

// Typography
$font-family-base: 'Montserrat', Arial, sans-serif;
$font-weight-normal: 400;
$font-weight-bold: 700;

// Border radius
$border-radius: 8px;
$border-radius-sm: 4px;
$border-radius-lg: 12px;

// Enable CSS custom properties
$enable-cssgrid: false;
```

#### `src/styles/bootstrap.scss` — Bootstrap entry point

```scss
// 1. Override variables
@import './variables';

// 2. Import Bootstrap
@import '~bootstrap/scss/bootstrap';
```

#### `src/styles/variables.css` — додаткові CSS custom properties

```css
:root {
  --color-primary: #224A98;
  --color-primary-hover: #004D85;
  --color-secondary: #4CAD3B;
  --color-error: #E53E23;
  --color-warning: #EE781C;
  --color-text: #404248;
  --gradient-bg: linear-gradient(0deg, #224A98 0%, #4CAD3B 100%);
}
```

#### `src/styles/global.css` — додаткові глобальні стилі

```css
@import url('./variables.css');

body {
  background: var(--gradient-bg);
  background-repeat: no-repeat;
  background-size: cover;
}

.App {
  min-height: 100vh;
  padding-top: 32px;
}
```

#### Оновити `public/index.html`

- Google Fonts: Roboto → Montserrat (400, 700)
- `<meta name="theme-color" content="#224A98" />`

#### Оновити `src/index.tsx`

```tsx
import './styles/bootstrap.scss'   // Bootstrap з SCSS темою
import './styles/global.css'        // Глобальні стилі

// Видалити: ThemeProvider, CssBaseline, @mui imports
```

---

## Фаза 2: Створення кастомного ErrorTree компоненту

**Коміт**: `feat(v3): create custom ErrorTree component with Bootstrap Collapse`

Це найскладніша заміна — MUI TreeView не має прямого аналогу в Bootstrap.

#### `src/components/ErrorTree/ErrorTree.tsx`

```typescript
interface ErrorTreeProps {
  errorsData: ErrorsType
}
```

Реалізація:
- Nested `<ul>` зі стилізацією
- Toggle через `useState` + react-bootstrap `Collapse`
- Іконки: `BsChevronRight` / `BsChevronDown` з `react-icons`
- 3 рівні: група → правило → повідомлення

#### `src/components/ErrorTree/ErrorTree.module.css`

```css
.tree { list-style: none; padding: 0; }
.node { cursor: pointer; padding: var(--space-2); }
.node:hover { background: rgba(0, 0, 0, 0.04); border-radius: var(--bs-border-radius); }
.children { padding-left: 24px; }
.leaf { padding: var(--space-1) var(--space-2); color: var(--color-text); }
.icon { margin-right: 8px; transition: transform 150ms ease; }
.iconExpanded { transform: rotate(90deg); }
```

---

## Фаза 3: Міграція бізнес-компонентів

**Коміт**: `refactor(v3): migrate all components from MUI to react-bootstrap`

### 3.1 `App.tsx`

```tsx
// БУЛО:
import { Input, Stack } from '@mui/material'

// СТАЛО:
import { Stack, Form } from 'react-bootstrap'

// Stack → <Stack direction="vertical" className="align-items-center">
// Input → <Form.Control type="file" accept="application/pdf" ref={ref} />
```

### 3.2 `TopInfo/index.tsx`

```tsx
// БУЛО:
import { Box, Chip, Typography } from '@mui/material'

// СТАЛО:
import { Badge } from 'react-bootstrap'

// Typography h1 → <h1 className={styles.title}>
// Box → <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
// Chip → <Badge pill bg="primary">v0.2.0</Badge>
// Typography body → <p className={styles.subtitle}>
```

#### `TopInfo.module.css`

```css
.title { font-size: 4rem; text-align: center; margin: 16px 0 0; }
@media (max-width: 900px) { .title { font-size: 3rem; } }
@media (max-width: 600px) { .title { font-size: 2rem; } }
.subtitle { text-align: center; font-size: 0.85rem; color: var(--color-text); }
```

### 3.3 `Settings/index.tsx`

```tsx
// БУЛО:
import { MenuItem, Select, SelectChangeEvent, Switch } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'

// СТАЛО:
import { Button, Modal, Form } from 'react-bootstrap'

// Modal → <Modal show={open} onHide={handleClose} centered>
//           <Modal.Body>...</Modal.Body>
//         </Modal>
// Select+MenuItem → <Form.Select value={groupName} onChange={onGroupSelect}>
//                     {groups.map(g => <option key={g} value={g}>{g}</option>)}
//                   </Form.Select>
// Switch → <Form.Check type="switch" checked={value} onChange={onChangeHandler} />
// SelectChangeEvent → React.ChangeEvent<HTMLSelectElement>
```

### 3.4 `Settings/SettingsForm/index.tsx`

```tsx
// БУЛО:
import { Button, Divider, Stack, Typography } from '@mui/material'

// СТАЛО:
import { Button, Stack } from 'react-bootstrap'

// Divider → <hr />
// Typography → <h3>, <p>
// Button type="submit" variant="contained" → <Button type="submit" variant="primary">
```

### 3.5 `Settings/SettingsForm/FormInput.tsx`

```tsx
// БУЛО:
import { FormControlLabel, Stack, Switch, TextField } from '@mui/material'

// СТАЛО:
import { Form, Stack } from 'react-bootstrap'

// Switch → <Form.Check type="switch" checked={field.value} label={...} onChange={...} />
// TextField number → <Form.Control type="number" size="sm" min={0} />
// TextField text → <Form.Control type="text" size="sm" />
// FormControlLabel — не потрібен, label через Form.Check prop
```

### 3.6 `ControlledTreeView.tsx` → `ErrorTree/ErrorTree.tsx`

Повна заміна на кастомний компонент з Фази 2.

### 3.7 `Feedback/index.tsx`

```tsx
// БУЛО:
import { Button, Typography } from '@mui/material'

// СТАЛО:
import { Button } from 'react-bootstrap'

// Typography → <p>
// Button variant="contained" → <Button variant="primary" href="..." target="_blank">
```

### 3.8 `Authors/index.tsx`

```tsx
// БУЛО:
import { Typography } from '@mui/material'

// СТАЛО:
// Typography → <p>, <p className="fst-italic">
```

---

## Фаза 4: Видалення MUI та cleanup

**Коміт**: `chore(v3): remove MUI dependencies and cleanup`

```bash
npm uninstall @mui/material @mui/icons-material @mui/x-tree-view @emotion/react @emotion/styled
```

- Видалити старий `src/style/index.css` та `src/style/reset.css` (замінені на bootstrap.scss + global.css)
- Видалити `src/components/ControlledTreeView.tsx` (замінений на ErrorTree)
- Перевірити що немає залишкових MUI імпортів: `grep -r "@mui" src/`
- Оновити `package.json` version

---

## Фаза 5: Фінальна перевірка

**Коміт**: `chore(v3): verify Bootstrap migration`

- [ ] `npm start` — без помилок
- [ ] `npm run build` — production build
- [ ] Шрифт Montserrat у DevTools
- [ ] Градієнт синій→зелений
- [ ] Кнопки — brand primary `#224A98`
- [ ] Modal — відкриття/закриття/Escape
- [ ] Form.Check switch — toggle
- [ ] ErrorTree — expand/collapse
- [ ] File upload працює
- [ ] Responsive — mobile/tablet
- [ ] Bundle size менший за MUI версію

---

## Зведена таблиця змін

| Файл | Дія | Фаза |
|------|-----|------|
| `src/styles/_variables.scss` | **CREATE** | 1 |
| `src/styles/bootstrap.scss` | **CREATE** | 1 |
| `src/styles/variables.css` | **CREATE** | 1 |
| `src/styles/global.css` | **CREATE** | 1 |
| `public/index.html` | MODIFY | 1 |
| `src/index.tsx` | MODIFY | 1 |
| `src/components/ErrorTree/ErrorTree.tsx` | **CREATE** | 2 |
| `src/components/ErrorTree/ErrorTree.module.css` | **CREATE** | 2 |
| `src/components/App.tsx` | MODIFY | 3 |
| `src/components/TopInfo/index.tsx` | MODIFY | 3 |
| `src/components/TopInfo/TopInfo.module.css` | **CREATE** | 3 |
| `src/components/Settings/index.tsx` | MODIFY | 3 |
| `src/components/Settings/Settings.module.css` | **CREATE** | 3 |
| `src/components/Settings/SettingsForm/index.tsx` | MODIFY | 3 |
| `src/components/Settings/SettingsForm/FormInput.tsx` | MODIFY | 3 |
| `src/components/Feedback/index.tsx` | MODIFY | 3 |
| `src/components/Authors/index.tsx` | MODIFY | 3 |
| `src/components/ControlledTreeView.tsx` | **DELETE** | 4 |
| `src/style/index.css` | **DELETE** | 4 |
| `src/style/reset.css` | **DELETE** | 4 |
| `package.json` | MODIFY | 4 |

**Нові файли**: ~10 | **Змінювані файли**: ~9 | **Видалені файли**: ~3

---

**Статус**: Готово до ревю
**Останнє оновлення**: Січень 2026
