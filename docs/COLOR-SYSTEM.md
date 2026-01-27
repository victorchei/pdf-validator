# Система кольорів проекту

## Центральне визначення кольорів

Всі кольори проекту визначені в **єдиному місці**: [`src/style/variables.css`](../src/style/variables.css)

## CSS змінні (Primary Source)

```css
:root {
  /* Brand primary */
  --color-primary-blue: #224a98;
  --color-primary-green: #4cad3b;

  /* Brand accent */
  --color-accent-red: #e53e23;
  --color-accent-orange: #ee781c;

  /* Neutral */
  --color-dark-blue: #004d85;
  --color-text: #404248;
  --color-text-secondary: #595959;
  --color-link: #0366d6;
  --color-white: #ffffff;
  --color-bg-light: #f5f7fa;

  /* Typography */
  --font-family: 'Montserrat', Arial, sans-serif;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Gradient */
  --gradient-bg: linear-gradient(0deg, var(--color-primary-blue) 0%, var(--color-primary-green) 100%);
}
```

## Brand Tokens для MUI теми

Файл [`src/theme/brandTokens.ts`](../src/theme/brandTokens.ts) містить JS/TS експорт тих самих кольорів для використання в MUI темі. **Важливо**: ці значення синхронізовані з CSS змінними.

```typescript
// Всі кольори відповідають CSS змінним у src/style/variables.css
export const brandTokens = {
  primary: {
    blue: '#224A98', // --color-primary-blue
    green: '#4CAD3B', // --color-primary-green
  },
  accent: {
    red: '#E53E23', // --color-accent-red
    orange: '#EE781C', // --color-accent-orange
  },
  neutral: {
    darkBlue: '#004D85', // --color-dark-blue
    text: '#404248', // --color-text
    link: '#0366D6', // --color-link
    white: '#FFFFFF', // --color-white
    bgLight: '#F5F7FA', // --color-bg-light
  },
  font: {
    family: "'Montserrat', Arial, sans-serif",
    weightRegular: 400,
    weightBold: 700,
  },
} as const
```

## Використання кольорів

### В CSS/CSS Modules

```css
/* Правильно ✅ */
.myComponent {
  color: var(--color-primary-blue);
  background-color: var(--color-white);
}

/* Неправильно ❌ */
.myComponent {
  color: #224a98;
  background-color: #ffffff;
}
```

### В React компонентах (MUI sx prop)

```tsx
// Правильно ✅
<Box sx={{ backgroundColor: 'var(--color-white)' }}>

// Або через тему MUI
<Box sx={{ color: 'primary.main' }}>

// Неправильно ❌
<Box sx={{ backgroundColor: '#ffffff' }}>
```

### В React inline styles

```tsx
// Правильно ✅
<div style={{ backgroundColor: 'var(--color-white)' }}>

// Неправильно ❌
<div style={{ backgroundColor: '#ffffff' }}>
```

## Відповідність бренд-буку

Всі кольори відповідають офіційному бренд-буку проекту ([`docs/brand/BRAND-BOOK.md`](../brand/BRAND-BOOK.md)):

| Призначення        | Колір        | CSS змінна              | Hex     |
| ------------------ | ------------ | ----------------------- | ------- |
| Основний брендовий | Primary Blue | `--color-primary-blue`  | #224A98 |
| Акцентний          | Green        | `--color-primary-green` | #4CAD3B |
| Помилки            | Red          | `--color-accent-red`    | #E53E23 |
| Попередження       | Orange       | `--color-accent-orange` | #EE781C |
| Hover стани        | Dark Blue    | `--color-dark-blue`     | #004D85 |
| Основний текст     | Text         | `--color-text`          | #404248 |
| Посилання          | Link         | `--color-link`          | #0366D6 |
| Білий фон          | White        | `--color-white`         | #FFFFFF |
| Світлий фон        | Light BG     | `--color-bg-light`      | #F5F7FA |

## Правила підтримки

1. **Ніколи не використовуйте хардкод hex кольори** в компонентах
2. **Додавайте нові кольори** тільки в `variables.css`
3. **Синхронізуйте** нові кольори з `brandTokens.ts` з коментарями про відповідні CSS змінні
4. **Використовуйте CSS змінні** через `var(--color-*)` в усіх стилях
5. **Для MUI компонентів** використовуйте або CSS змінні через sx, або theme tokens

## Переваги централізованого підходу

✅ Єдине джерело правди (Single Source of Truth)  
✅ Легка зміна теми для всього проекту  
✅ Автоматична синхронізація між CSS та JS  
✅ Відповідність бренд-буку  
✅ Простіша підтримка і рефакторинг  
✅ TypeScript автодоповнення для theme tokens
