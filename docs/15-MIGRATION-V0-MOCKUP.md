# Документація з оновлення застосунку до мокапу v0

## 1. Загальний огляд

Цей документ описує зміни, необхідні для оновлення UI застосунку PDF Validator до макету, який підтримує три адаптивні брейкпоінти: **360px** (мобільний), **780px** (планшет), **1024px** (десктоп).

---

## 2. Аналіз відмінностей: поточний стан vs мокап

### 2.1. Зона завантаження файлу (Drag & Drop)

| Аспект | Поточний стан | Мокап |
|--------|--------------|-------|
| Тип елемента | `<Input type="file">` (MUI) | Стандартний `<input type="file">` + **зона drag-and-drop** з пунктирною рамкою |
| Візуальне оформлення | Простий текстовий інпут | Велика зона з іконкою PDF-документа, пунктирна синя рамка |
| Drag & Drop | Не підтримується | Підтримується (візуальна зона для перетягування файлів) |

**Файли для зміни:**
- `src/components/App.tsx` -- додати компонент DropZone або вбудувати логіку drag-and-drop
- `src/components/App.module.css` -- стилі для зони завантаження

**Деталі реалізації:**
- Створити контейнер `.dropZone` з `border: 2px dashed var(--color-primary-blue)`
- Додати іконку PDF-документа (SVG) по центру зони
- Реалізувати обробники `onDragOver`, `onDragEnter`, `onDragLeave`, `onDrop`
- Зберегти стандартний `<input type="file">` як альтернативний спосіб завантаження (кнопка "Choose File")
- Текст-підказка: "Завантажте дипломну роботу у форматі ПДФ" має бути **над** зоною drag-and-drop
- Зберегти текст інструкції: "Засіб здатний допускати хибну валідність у ПДФ якщо обслуговуванання іншою програмою" (видно на планшеті 780px)

**Орієнтовні стилі:**
```css
.dropZone {
  border: 2px dashed var(--color-primary-blue);
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dropZone:hover,
.dropZoneDragOver {
  background-color: rgba(34, 74, 152, 0.05);
  border-color: var(--color-dark-blue);
}

.dropZoneIcon {
  width: 48px;
  height: 48px;
  color: var(--color-primary-blue);
  margin-bottom: 8px;
}
```

---

### 2.2. Перемикач Бакалавр/Магістр

| Аспект | Поточний стан | Мокап |
|--------|--------------|-------|
| Компонент | MUI `<Switch>` | **Pill/Chip toggle** -- активна опція виділена зеленим кольором |
| Візуал | Стандартний тогл | Два варіанти у формі пігулки: "Бакалавр" (зелений при виборі) / "Магістр" (зелений при виборі) |

**Файли для зміни:**
- `src/components/Settings/index.tsx` -- замінити `<Switch>` на кастомний toggle
- `src/components/Settings/Settings.module.css` -- стилі для pill toggle

**Деталі реалізації:**
- Замінити `<Switch>` на контейнер з двома кнопками-пігулками
- Активна опція: `background-color: var(--color-primary-green); color: white; border-radius: 16px`
- Неактивна опція: `background: transparent; color: var(--color-text)`
- Контейнер: рамка з закругленнями (`border-radius: 20px; border: 1px solid #ccc`)

**Орієнтовні стилі:**
```css
.qualificationToggle {
  display: inline-flex;
  border: 1px solid #ddd;
  border-radius: 20px;
  overflow: hidden;
}

.qualificationOption {
  padding: 4px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.8rem;
  font-family: var(--font-family);
  transition: background-color 0.2s;
}

.qualificationOptionActive {
  background-color: var(--color-primary-green);
  color: var(--color-white);
  border-radius: 16px;
}
```

---

### 2.3. Вибір групи

| Аспект | Поточний стан | Мокап (360px) | Мокап (1024px) |
|--------|--------------|---------------|----------------|
| Компонент | MUI `<Select>` dropdown | Toggle / inline selector | Dropdown `<Select>` з "ІПЗ" |
| Лейбл | "Виберіть групу:" | "Виберіть групу: прогр." | "Виберіть сорту:" (можливо, "групу") |

**Файли для зміни:**
- `src/components/Settings/index.tsx` -- адаптивний рендеринг (toggle на мобільному, dropdown на десктопі)
- `src/components/Settings/Settings.module.css` -- стилі

**Деталі реалізації:**
- На десктопі (>= 960px): залишити MUI `<Select>` dropdown
- На мобільному (< 960px): можливо, використати горизонтальний скрол-список або compact dropdown
- Лейбл: "Виберіть групу:"

---

### 2.4. Футер (Authors) -- двоколонковий макет на десктопі

| Аспект | Поточний стан | Мокап (1024px) |
|--------|--------------|----------------|
| Макет | Одна колонка, вертикальний список | **Дві колонки**: "Основна розробка" зліва, "Основна розробка" справа |
| Мобільний | Одна колонка | Одна колонка (без змін) |

**Файли для зміни:**
- `src/components/Authors/index.tsx` -- розділити на дві колонки
- `src/components/Authors/Authors.module.css` -- додати flex/grid для двоколонкового макету

**Деталі реалізації:**
```css
@media (min-width: 960px) {
  .authors {
    display: flex;
    justify-content: space-between;
    gap: 24px;
  }

  .authorColumn {
    flex: 1;
  }
}
```

- Ліва колонка: "Основна розробка:" + розробники
- Права колонка: "Основна розробка:" + ідея, версія

---

### 2.5. Текст попередження (Settings)

| Аспект | Поточний стан | Мокап |
|--------|--------------|-------|
| Колір | `color="error"` (червоний) | Червоний текст -- без змін |
| Текст кнопки | "Налаштування перевірки" (звичайний MUI Button) | **"НАЛАШТУВАННЯ ПЕРЕВІРКИ"** -- великі літери, виглядає як текстове посилання (не кнопка) |

**Файли для зміни:**
- `src/components/Settings/index.tsx` -- змінити стиль кнопки на текстове посилання

**Деталі реалізації:**
- Замінити `<Button>` на `<Button variant="text">` або `<a>` styled як посилання
- Текст великими літерами: `text-transform: uppercase` або написати "НАЛАШТУВАННЯ ПЕРЕВІРКИ" прямо
- Стиль: виглядає як inline-посилання в тексті

---

### 2.6. Кнопка зворотнього зв'язку

| Аспект | Поточний стан | Мокап |
|--------|--------------|-------|
| Стиль | MUI `contained` Button (синій) | **Зелений** contained button |
| Текст | "Форма зворотнього зв'язку" | "ФОРМА ЗВОРОТНЬОГО ЗВ'ЯЗКУ" (uppercase) |

**Файли для зміни:**
- `src/components/Feedback/index.tsx` -- додати `color="secondary"` або кастомний стиль
- `src/components/Feedback/Feedback.module.css` -- зелений фон кнопки

**Деталі реалізації:**
```tsx
<Button
  variant="contained"
  color="secondary"  // або sx={{ bgcolor: 'var(--color-primary-green)' }}
  // ...
>
  ФОРМА ЗВОРОТНЬОГО ЗВ'ЯЗКУ
</Button>
```

---

### 2.7. Текст перед drag-and-drop зоною

| Аспект | Поточний стан | Мокап |
|--------|--------------|-------|
| Текст | "Завантажте дипломну роботу у форматі ПДФ" + input | Окремий рядок: "Завантажте дипломну роботу у форматі ПДФ" + стандартний file input + drag-and-drop зона нижче |
| Інструкція | Відсутня | "Засіб здатний допускати хибну валідність у ПДФ якого обслуговуванання іншою програмою" -- видно на 780px |

**Файли для зміни:**
- `src/components/App.tsx` -- розділити лейбл, file input та drop zone

---

## 3. Брейкпоінти

Мокап визначає три основних брейкпоінти:

| Брейкпоінт | Ширина | Пристрій |
|-----------|--------|----------|
| Mobile | 360px | Смартфон |
| Tablet | 780px | Планшет |
| Desktop | 1024px | Монітор |

**Поточні брейкпоінти** в коді:
- xs: < 600px
- sm: 600px
- md: 960px
- lg: 1280px
- xl: 1600px

**Рекомендація:** Поточні MUI-брейкпоінти близькі до мокапних. Не потрібно змінювати систему брейкпоінтів, достатньо адаптувати стилі під існуючі MUI breakpoints:
- 360px -> xs (< 600px)
- 780px -> sm/md (600px-960px)
- 1024px -> md/lg (960px+)

---

## 4. Повний перелік змін по компонентах

### 4.1. `App.tsx` + `App.module.css`

| # | Зміна | Пріоритет |
|---|-------|-----------|
| 1 | Додати компонент/зону Drag & Drop з пунктирною рамкою та іконкою PDF | Високий |
| 2 | Зберегти стандартний file input як альтернативу | Середній |
| 3 | Розділити лейбл і file input на окремі блоки | Низький |
| 4 | Додати текст-інструкцію під file input (перед drop zone) | Низький |

### 4.2. `Settings/index.tsx` + `Settings.module.css`

| # | Зміна | Пріоритет |
|---|-------|-----------|
| 1 | Замінити `<Switch>` на pill toggle (Бакалавр/Магістр) | Високий |
| 2 | Змінити стиль кнопки "Налаштування перевірки" на текстове посилання uppercase | Середній |
| 3 | Адаптувати селект групи для мобільного/десктопу | Низький |

### 4.3. `Feedback/index.tsx` + `Feedback.module.css`

| # | Зміна | Пріоритет |
|---|-------|-----------|
| 1 | Змінити колір кнопки з синього на зелений (`color="secondary"`) | Середній |
| 2 | Uppercase текст кнопки | Низький |

### 4.4. `Authors/index.tsx` + `Authors.module.css`

| # | Зміна | Пріоритет |
|---|-------|-----------|
| 1 | Двоколонковий макет на десктопі (>= 960px) | Середній |
| 2 | Зберегти одноколонковий макет на мобільному | -- (вже є) |

### 4.5. `TopInfo/index.tsx` + `TopInfo.module.css`

| # | Зміна | Пріоритет |
|---|-------|-----------|
| -- | Без суттєвих змін. Заголовок, опис та інструкція відповідають мокапу | -- |

---

## 5. Нові компоненти

### 5.1. `DropZone` (або вбудований в `App.tsx`)

**Призначення:** Зона для drag-and-drop завантаження PDF-файлів.

**Props:**
```tsx
interface DropZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string; // default: 'application/pdf'
}
```

**Структура:**
```tsx
<div className={styles.dropZone}>
  <PdfIcon className={styles.dropZoneIcon} />
  {/* або <img src={pdfIcon} /> */}
</div>
```

**Стани:**
- Default: пунктирна синя рамка, іконка PDF
- Hover: легкий синій фон
- Drag over: підсвічений фон, зміна кольору рамки
- File loaded: можна показати назву файлу

### 5.2. `QualificationToggle` (або вбудований в `Settings`)

**Призначення:** Pill toggle для вибору Бакалавр/Магістр.

**Props:**
```tsx
interface QualificationToggleProps {
  value: boolean; // true = Master, false = Bachelor
  onChange: (isMaster: boolean) => void;
}
```

---

## 6. Порядок впровадження

1. **Етап 1** -- Pill toggle Бакалавр/Магістр (Settings)
2. **Етап 2** -- Drag & Drop зона завантаження файлів (App)
3. **Етап 3** -- Зелена кнопка зворотнього зв'язку (Feedback)
4. **Етап 4** -- Двоколонковий футер (Authors)
5. **Етап 5** -- Стиль посилання для "Налаштування перевірки" (Settings)
6. **Етап 6** -- Фінальне тестування на всіх брейкпоінтах (360px, 780px, 1024px)

---

## 7. Файли, які потрібно змінити

```
src/components/App.tsx                    -- drag-and-drop логіка, restructure file upload
src/components/App.module.css             -- стилі drop zone
src/components/Settings/index.tsx         -- pill toggle, styled link
src/components/Settings/Settings.module.css -- стилі toggle, link
src/components/Feedback/index.tsx         -- зелена кнопка
src/components/Feedback/Feedback.module.css -- (можливо)
src/components/Authors/index.tsx          -- двоколонковий макет
src/components/Authors/Authors.module.css -- flex/grid для двох колонок
```

---

## 8. Ризики та застереження

- **Drag & Drop**: Потрібно забезпечити fallback для браузерів, які не підтримують Drag & Drop API (маловірогідно для сучасних, але слід перевірити на мобільних)
- **Pill Toggle**: Зміна Switch на pill toggle може потребувати оновлення логіки стану (інвертована семантика: Switch `checked=true` = Master, pill toggle потрібно адаптувати)
- **Двоколонковий футер**: На проміжних ширинах (600-960px) потрібно визначити поведінку (одна чи дві колонки)
- **Тестування**: Перевірити на реальних пристроях 360px, 780px та 1024px

---

## 9. Візуальне порівняння

### Mobile (360px)
```
┌──────────────────┐
│ Сервіс для       │
│ перевірки...     │
│                  │
│ (червоний текст) │
│ НАЛАШТУВАННЯ...  │
│                  │
│ Бакалавр│Магістр │  <-- pill toggle (NEW)
│ [■■■■■■] toggle  │
│                  │
│ Виберіть групу:  │
│ [PP100        ]  │
│ [Choose File   ] │
│                  │
│ ┌──────────────┐ │
│ │   📄 (icon)  │ │  <-- drop zone (NEW)
│ │              │ │
│ └──────────────┘ │
│                  │
│ [ФОРМА ЗВОР...]  │  <-- green button (CHANGED)
│                  │
│ footer (1 col)   │
└──────────────────┘
```

### Desktop (1024px)
```
┌─────────────────────────────────────────┐
│      Сервіс для перевірки дипл. робіт   │
│      description / instruction          │
│   (red text + НАЛАШТУВАННЯ ПЕРЕВІРКИ)   │
│                                         │
│   Бакалавр │ Магістр    Група: [ІПЗ ▼]  │
│                                         │
│   Завантажте дипломну роботу...         │
│   [Choose File] No file chosen          │
│                                         │
│   ┌───────────────────────────────────┐ │
│   │           📄 (PDF icon)           │ │  <-- drop zone
│   │                                   │ │
│   └───────────────────────────────────┘ │
│                                         │
│   [  ФОРМА ЗВОРОТНЬОГО ЗВ'ЯЗКУ  ]      │  <-- green
│                                         │
│  Основна розробка:   │  Основна розр.:  │  <-- 2-col footer
│  developer info      │  idea authors    │
└─────────────────────────────────────────┘
```
