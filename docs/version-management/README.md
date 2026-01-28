# 📚 Документація системи управління версіями

Ласкаво просимо до документації мультиверсійного розгортання PDF Validator!

## � Статус: v1.0.0 ВИПУЩЕНО!

**✅ Перший реліз успішно задеплоєно** → [V1.0.0_RELEASE_STATUS.md](V1.0.0_RELEASE_STATUS.md)

**VersionSelector працює:** В master і v1.0.0 доступний dropdown з вибором версій ✅

---

## 🎯 Швидкий старт

**🎬 ПОЧАТИ ЗВІДСИ!** → [INITIAL_SETUP.md](INITIAL_SETUP.md) - З якої гілки почати? Куди комітити?

**🎉 Статус релізу** → [V1.0.0_RELEASE_STATUS.md](V1.0.0_RELEASE_STATUS.md) - Що вже зроблено

**🔗 Субмодуль validator** → [SUBMODULE_VERSIONING.md](SUBMODULE_VERSIONING.md) - Синхронізація гілок!

**❓ Є питання?** → [FAQ.md](FAQ.md) - Відповіді на всі питання

**⚡ Перевірка логіки** → [VALIDATION_SUMMARY.md](VALIDATION_SUMMARY.md) - Чи все правильно?

**🏷️ Розібратися з версіями** → [VERSIONING_STRATEGY.md](VERSIONING_STRATEGY.md) - vX.Y.Z пояснення

**🚀 Реалізація** → [STEP_BY_STEP_GUIDE.md](STEP_BY_STEP_GUIDE.md) - Покрокова інструкція

**📍 Куди комітити** → [GETTING_STARTED.md](GETTING_STARTED.md) - Детальні команди

**📖 Швидка довідка** → [QUICK_REFERENCE_MULTIPAGE.md](QUICK_REFERENCE_MULTIPAGE.md) - Copy-paste команди

---

## 📋 Зміст документації

### 0. [Початкове налаштування](INITIAL_SETUP.md) 🎬 START HERE

**Для кого**: Всі розробники (ЧИТАТИ ПЕРШИМ!)

**Що містить**:

- ✅ **З якої гілки почати** (master, не v0!)
- ✅ **Куди комітити документацію** (в master)
- ✅ **Як змінити 0.2.0 → 1.0.0** (рекомендовано)
- ✅ **Видалення версій** (НЕ автоматично при видаленні гілки!)
- ✅ Покроковий workflow початкового setup
- ✅ Чек-лист налаштування

**Час читання**: ~10 хвилин  
**Час виконання**: ~20 хвилин

---

### 1. [Підтвердження логіки](VALIDATION_SUMMARY.md) ✅ VALIDATION

**Для кого**: Всі (якщо є сумніви чи все правильно)

**Що містить**:

- ✅ Підтвердження що версіонування коректне
- ✅ package.json (0.2.0) відповідає документації
- ✅ Regex підтримує v0.2.0 формат
- ✅ Deployment URL structure вірна
- ✅ Таблиця перевірки всіх компонентів

**Час читання**: ~3 хвилини

---

### 2. [Швидкий старт](GETTING_STARTED.md) 📍 COMMANDS

**Для кого**: Розробники, які хочуть швидко зрозуміти команди git

**Що містить**:

- ✅ Де ви зараз (поточна гілка)
- ✅ Структура файлів (що створювати)
- ✅ Куди комітити (команди git)
- ✅ Тестування (покроково)
- ✅ Критерії успіху

**Час читання**: ~5 хвилин

---

### 3. [Стратегія версіонування](VERSIONING_STRATEGY.md) 🏷️ VERSIONS

**Для кого**: Всі розробники (ОБОВ'ЯЗКОВО ДО ПРОЧИТАННЯ!)

**Що містить**:

- ✅ Семантичне версіонування (vX.Y.Z)
- ✅ Відповідність package.json ↔️ Git ↔️ URL
- ✅ Поточний стан (0.2.0) vs Майбутній (1.0.0)
- ✅ Правила роботи з версіями
- ✅ Regex для детектування версій
- ✅ FAQ та приклади

**Час читання**: ~10 хвилин

---

### 4. [Покроковий гайд](STEP_BY_STEP_GUIDE.md) 🚀 IMPLEMENTATION

**Для кого**: Розробники, які впроваджують систему

**Що містить**:

- ✅ Локальне тестування перед deployment
- ✅ Створення всіх необхідних файлів
- ✅ GitHub Actions налаштування
- ✅ Тестові сценарії
- ✅ Troubleshooting

**Час виконання**: ~30-45 хвилин

---

### 5. [Повна архітектура](MULTI_PAGE_IMPLEMENTATION.md)

**Для кого**: Технічні ліди, архітектори

**Що містить**:

- Git стратегія веток
- URL структура
- React Router конфігурація
- CI/CD pipeline детально
- Компоненти та їх взаємодія

**Коли читати**: Для глибокого розуміння системи

---

### 6. [Автоматичне оновлення версій](AUTO_VERSIONS_UPDATE.md)

**Для кого**: DevOps, Backend розробники

**Що містить**:

- Візуальні діаграми workflow
- Алгоритм синхронізації versions.json
- Стратегії кешування
- Performance оптимізації

**Коли читати**: Коли потрібно зрозуміти як працює синхронізація

---

### 7. [Швидкий довідник](QUICK_REFERENCE_MULTIPAGE.md)

**Для кого**: Всі розробники

**Що містить**:

- TL;DR секція
- 5 кроків швидкого старту
- Code snippets ready-to-use
- Швидкі команди

**Коли використовувати**: Коли потрібно швидко щось перевірити

---

### 8. [Контрольний список](IMPLEMENTATION_CHECKLIST.md)

**Для кого**: Project managers, Tech leads

**Що містить**:

- 7 фаз впровадження
- Checkbox для кожного кроку
- Критерії успіху
- Troubleshooting checklist

**Коли використовувати**: Для tracking прогресу впровадження

---

### 9. [Управління субмодулем](SUBMODULE_VERSIONING.md) 🔗 SUBMODULE

**Для кого**: Всі розробники (ОБОВ'ЯЗКОВО!)

**Що містить**:

- ✅ **Синхронізація гілок** з validator repository
- ✅ Правило іменування (pdf-validator/master = validator/master)
- ✅ Workflow створення версій в субмодулі
- ✅ Поточний стан (main → master migration)
- ✅ Скрипти перевірки синхронізації
- ✅ Типові проблеми та рішення
- ✅ CI для автоматичної перевірки

**Час читання**: ~8 хвилин

---

## 🏗️ Архітектура (коротко)

### Ключова концепція

```
Єдиний versions.json на gh-pages
         ↓
    Фетчується всіма версіями
         ↓
  Автоматична синхронізація
```

### URL Структура

```
https://victorchei.github.io/pdf-validator/        ← Master (latest)
https://victorchei.github.io/pdf-validator/v0/     ← Version 0.9.0
https://victorchei.github.io/pdf-validator/v1.1.0/ ← Version 1.1.0
https://victorchei.github.io/pdf-validator/v2.0.0/ ← Version 2.0.0
```

### Компоненти

1. **VersionSelector** - Dropdown для вибору версії
2. **Outdated Alert** - Попередження про застарілу версію
3. **versions.json** - Централізований manifest
4. **GitHub Actions** - Автоматичний deployment
5. **validator (субмодуль)** - Синхронізовані гілки з pdf-validator

---

## 🔗 Управління субмодулем

### validator repository

**Критично**: Гілки в validator ПОВИННІ співпадати з pdf-validator!

```
pdf-validator/master  →  validator/master
pdf-validator/v1.0.0  →  validator/v1.0.0
pdf-validator/v1.1.0  →  validator/v1.1.0
```

**Поточний стан**:

- Default branch: `main` ← Потрібно змінити на `master`!
- Існує: `develop` ✅

**Детальніше**: [SUBMODULE_VERSIONING.md](SUBMODULE_VERSIONING.md)

---

## 🎨 Нові можливості

### ✨ Семантичне версіонування

Замість `v1`, `v2` → **`v1.0.0`, `v1.1.0`, `v2.0.0`**

```javascript
{
  id: 'v1.0.0',
  version: '1.0.0',
  label: 'Версія 1.0.0',
  path: '/pdf-validator/v1.0.0/',
  ...
}
```

### ⚠️ Alert про застарілу версію

Якщо користувач на старій версії, показується:

```
⚠️ Ви переглядаєте застарілу версію.
   Доступна нова версія 1.2.0.
   [Перейти на останню версію →]
```

---

## 📦 Структура файлів

### Проект (source code)

```
pdf-validator/
├── scripts/
│   └── generate-versions.js          ← Генерація versions.json
├── src/
│   └── components/
│       └── VersionSelector/          ← Dropdown + Alert
│           ├── index.tsx
│           └── VersionSelector.module.css
├── .github/
│   └── workflows/
│       ├── deploy-master.yml         ← Deploy latest
│       ├── deploy-v0.yml             ← Deploy v0
│       └── deploy-v1.1.0.yml         ← Deploy v1.1.0
└── public/
    └── versions.json                 ← Generated manifest
```

### gh-pages branch

```
gh-pages/
├── versions.json                     ← ЄДИНЕ ДЖЕРЕЛО
├── index.html                        ← Master version
├── static/
├── v0/
│   ├── index.html                    ← v0.9.0
│   └── static/
├── v1.0.0/
│   ├── index.html                    ← v1.0.0
│   └── static/
└── v1.1.0/
    ├── index.html                    ← v1.1.0
    └── static/
```

---

## 🚦 Workflow

### Додати нову версію

```bash
# 1. Створити гілку
git checkout -b v1.2.0 master

# 2. Оновити scripts/generate-versions.js
#    Додати: { id: 'v1.2.0', version: '1.2.0', ... }

# 3. Створити workflow
#    .github/workflows/deploy-v1.2.0.yml

# 4. Commit і push
git add .
git commit -m "feat: Add v1.2.0"
git push origin v1.2.0

# 5. GitHub Actions автоматично:
#    ✅ Build v1.2.0
#    ✅ Deploy в /v1.2.0/
#    ✅ Update versions.json
#    ✅ Всі версії бачать v1.2.0!
```

---

## 🧪 Тестування

### Локально

```bash
npm run generate-versions
npm run build
npx serve -s build
# → http://localhost:5000
```

### Production

```bash
# Перевірити versions.json
curl https://victorchei.github.io/pdf-validator/versions.json

# Перевірити версії
open https://victorchei.github.io/pdf-validator/
open https://victorchei.github.io/pdf-validator/v0/
```

---

## 📝 Чек-лист для нової версії

- [ ] Оновити `scripts/generate-versions.js`
- [ ] Створити workflow `.github/workflows/deploy-vX.X.X.yml`
- [ ] Тестувати локально
- [ ] Push на GitHub
- [ ] Перевірити GitHub Actions (зелений ✓)
- [ ] Перевірити deployment
- [ ] Перевірити dropdown на всіх версіях
- [ ] Перевірити alert на старих версіях

---

## 🆘 Потрібна допомога?

### За темами

- **Перше впровадження** → [STEP_BY_STEP_GUIDE.md](STEP_BY_STEP_GUIDE.md)
- **Архітектура** → [MULTI_PAGE_IMPLEMENTATION.md](MULTI_PAGE_IMPLEMENTATION.md)
- **Синхронізація** → [AUTO_VERSIONS_UPDATE.md](AUTO_VERSIONS_UPDATE.md)
- **Швидка довідка** → [QUICK_REFERENCE_MULTIPAGE.md](QUICK_REFERENCE_MULTIPAGE.md)
- **Прогрес tracking** → [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)

### Типові питання

**Q: Як додати нову версію?**  
A: Див. секцію "Workflow" → "Додати нову версію"

**Q: Чому dropdown порожній?**  
A: Перевірити DevTools → Network → versions.json (має бути 200 OK)

**Q: Як тестувати локально?**  
A: `npm run generate-versions && npx serve -s build`

**Q: Де оновити список версій?**  
A: `scripts/generate-versions.js` → `VERSIONS_CONFIG`

---

## 📊 Статус документації

| Документ                     | Статус   | Остання оновлення |
| ---------------------------- | -------- | ----------------- |
| STEP_BY_STEP_GUIDE.md        | ✅ Ready | 2026-01-28        |
| MULTI_PAGE_IMPLEMENTATION.md | ✅ Ready | 2026-01-28        |
| AUTO_VERSIONS_UPDATE.md      | ✅ Ready | 2026-01-28        |
| QUICK_REFERENCE_MULTIPAGE.md | ✅ Ready | 2026-01-28        |
| IMPLEMENTATION_CHECKLIST.md  | ✅ Ready | 2026-01-28        |

---

**Версія документації**: 1.0.0  
**Створено**: 2026-01-28  
**Команда**: PDF Validator Team
