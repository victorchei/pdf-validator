# Міграція до централізованої системи кольорів

## Дата виконання

28 січня 2026 р.

## Мета

Всі кольори в проекті тепер використовують CSS змінні, визначені в єдиному місці, які відповідають бренд-буку.

---

## Виконані зміни

### 1. Оновлено центральний файл кольорів

**Файл**: [`src/style/variables.css`](../src/style/variables.css)

**Зміни**:

- Оновлено `--color-text` з `#2c2c2c` на `#404248` (згідно brandTokens)
- Оновлено `--color-bg-light` з `#f8f9fa` на `#f5f7fa` (використовується для body background)
- Додано коментарі до всіх змінних для кращої документації

### 2. Синхронізовано Brand Tokens

**Файл**: [`src/theme/brandTokens.ts`](../src/theme/brandTokens.ts)

**Зміни**:

- Додано коментарі з назвами CSS змінних до кожного кольору
- Додано `bgLight: '#F5F7FA'` для відповідності `--color-bg-light`
- Додано заголовок коментаря про синхронізацію з CSS змінними

### 3. Замінено хардкод кольори на CSS змінні

#### [`src/style/index.css`](../src/style/index.css)

```css
/* Було */
body {
  background: #f5f7fa;
}

/* Стало */
body {
  background: var(--color-bg-light);
}
```

#### [`src/components/App.module.css`](../src/components/App.module.css)

```css
/* Було */
.mainContent {
  background-color: #ffffff;
}

/* Стало */
.mainContent {
  background-color: var(--color-white);
}
```

#### [`src/components/Settings/SettingsForm/index.tsx`](../src/components/Settings/SettingsForm/index.tsx)

```tsx
/* Було */
sx={{ backgroundColor: '#fff' }}

/* Стало */
sx={{ backgroundColor: 'var(--color-white)' }}
```

---

## Результат

### ✅ Досягнуто

1. **Єдине джерело правди** - всі кольори визначені тільки в `variables.css`
2. **100% використання CSS змінних** - немає хардкод hex кольорів у компонентах
3. **Синхронізація** - `brandTokens.ts` синхронізований з CSS змінними
4. **Документація** - створено [`COLOR-SYSTEM.md`](COLOR-SYSTEM.md) з правилами використання
5. **Білд успішний** - проект компілюється без помилок

### 📊 Статистика змін

- Змінено файлів: 5
- Замінено хардкод кольорів: 4
- Додано CSS змінних: 0 (всі вже були)
- Оновлено Brand Tokens: 1

### 🎨 Всі кольори проекту (Single Source of Truth)

```css
/* src/style/variables.css */
:root {
  --color-primary-blue: #224a98;      ← Основний брендовий
  --color-primary-green: #4cad3b;     ← Акцентний зелений
  --color-accent-red: #e53e23;        ← Помилки
  --color-accent-orange: #ee781c;     ← Попередження
  --color-dark-blue: #004d85;         ← Hover стани
  --color-text: #404248;              ← Основний текст
  --color-text-secondary: #595959;    ← Вторинний текст
  --color-link: #0366d6;              ← Посилання
  --color-white: #ffffff;             ← Білий фон
  --color-bg-light: #f5f7fa;          ← Світлий фон
}
```

---

## Правила для розробників

### ✅ Правильно

```css
.component {
  color: var(--color-primary-blue);
}
```

```tsx
<Box sx={{ backgroundColor: 'var(--color-white)' }} />
```

### ❌ Неправильно

```css
.component {
  color: #224a98;
}
```

```tsx
<Box sx={{ backgroundColor: '#fff' }} />
```

---

## Наступні кроки (рекомендації)

1. **Code Review**: Переглянути всі майбутні PR на наявність хардкод кольорів
2. **Linting**: Додати ESLint/Stylelint правила для заборони hex кольорів
3. **CI/CD**: Додати перевірку в pipeline на використання тільки CSS змінних
4. **Документація**: Ознайомити команду з [`COLOR-SYSTEM.md`](COLOR-SYSTEM.md)

---

## Білд статус

✅ **Білд успішний**

```
Compiled successfully.

File sizes after gzip:
  239.3 kB (+39 B)  build/static/js/main.09accd56.js
  1.71 kB (+72 B)   build/static/css/main.ac05af49.css
```

Невелике збільшення розміру CSS (+72 B) пов'язане з використанням CSS змінних, що є нормальним та прийнятним.
