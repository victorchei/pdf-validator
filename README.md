# 📄 PDF Validator

[![Version 0.2.0](https://img.shields.io/badge/version-0.2.0-blue.svg)](./CHANGELOG.md)
[![Node.js 18+](https://img.shields.io/badge/node-18%2B-green.svg)](https://nodejs.org/)
[![npm 8+](https://img.shields.io/badge/npm-8%2B-red.svg)](https://www.npmjs.com/)

Веб-застосунок для автоматичної валідації дипломних робіт у форматі PDF за встановленими стандартами оформлення.

🌐 **Live**: <https://victorchei.github.io/pdf-validator/>

> **Остання версія**: [0.2.0](./CHANGELOG.md) (27 січня 2026)

---

## 📚 Документація

Повна документація проекту українською мовою знаходиться в папці `/docs`:

| Документ                                         | Опис                                            |
| ------------------------------------------------ | ----------------------------------------------- |
| [📝 Changelog](./CHANGELOG.md)                   | Журнал змін по версіях                          |
| [🎨 Бренд-бук](./docs/brand/BRAND-BOOK.md)       | Бренд-система Житомирської політехніки          |
| [📖 Огляд](./docs/01-OVERVIEW.md)                | Загальна інформація про проект та його цілі     |
| [🔧 Встановлення](./docs/02-INSTALLATION.md)     | Детальна інструкція для налаштування середовища |
| [🏗️ Архітектура](./docs/03-ARCHITECTURE.md)      | Структура проекту, компоненти та data flow      |
| [🧩 Компоненти](./docs/04-COMPONENTS.md)         | Опис всіх React компонентів та їх props         |
| [⚙️ Конфігурація](./docs/05-CONFIGURATION.md)    | Налаштування помилок та груп спеціальностей     |
| [📚 API & Типи](./docs/06-API-TYPES.md)          | TypeScript типи та інтерфейси                   |
| [👨‍💻 Розробка](./docs/07-DEVELOPMENT.md)          | Гайд для розробників та Git workflow            |
| [🚀 Деплой](./docs/08-DEPLOYMENT.md)             | Розгортування на GitHub Pages та інші способи   |
| [🆘 Проблеми](./docs/09-TROUBLESHOOTING.md)      | Розв'язання типових проблем                     |
| [⭐ Best Practices](./docs/10-BEST-PRACTICES.md) | Рекомендації та найкращі практики               |

---

## 🚀 Швидкий старт

### Передумови

- **Node.js**: ≥18.0.0
- **npm**: ≥8.0.0
- **Git**: з підтримкою submodules

### Встановлення

```bash
# 1. Клонування репозиторію разом із submodules
git clone --recurse-submodules https://github.com/victorchei/pdf-validator.git
cd pdf-validator

# Якщо вже клонували без --recurse-submodules:
git submodule update --init --recursive

# 2. Встановлення залежностей
npm install

# 3. Запуск в режимі розробки
npm start

# Додаток відкриється на http://localhost:3000
```

> **Примітка**: Модуль валідатора (`src/validator`) підключений як git submodule з приватного репозиторію. Для клонування потрібен доступ до `victorchei/validator`.

---

## 📋 Доступні команди

```bash
# Запуск dev сервера
npm start

# Білд для продакшену
npm run build

# Запуск тестів
npm test

# Деплой на GitHub Pages
npm run deploy

# Запуск оптимізованого білду локально
serve -s build
```

---

## 🌿 Git Workflow

### Розробка

```bash
# 1. Переходимо на develop
git checkout develop
git pull origin develop

# 2. Створюємо гілку функції
git checkout -b feature/назва-функції

# 3. Розробляємо та коммітимо
git add .
git commit -m "feat: описание змін"

# 4. Пушимо та відкриваємо PR в develop
git push origin feature/назва-функції
```

### Деплой в продакшн

```bash
# 1. Мержимо develop в master (через PR або напряму)
git checkout master
git merge develop

# 2. Пушимо в master
git push origin master

# 3. GitHub Actions автоматично деплоїть на GitHub Pages ✨
```

> **CI/CD**: При push у `master` GitHub Actions автоматично збирає проект та деплоїть на GitHub Pages (гілка `gh-pages`). Приватний submodule `validator` клонується через SSH deploy key.

---

## 📊 Структура проекту

```
pdf-validator/
├── .github/workflows/
│   └── deploy.yml                  # Автоматичний деплой на GitHub Pages
├── docs/                           # 📚 Повна документація
├── public/
│   └── index.html
├── src/
│   ├── components/                 # React компоненти
│   ├── config/                     # Конфігурації помилок та груп
│   ├── helpers/                    # Допоміжні функції
│   ├── style/                      # CSS стилі
│   ├── validator/                  # 🔗 Git submodule (victorchei/validator)
│   └── index.tsx                   # Точка входу
├── .gitmodules                     # Конфігурація submodules
├── package.json
├── package-lock.json
├── CHANGELOG.md                    # Журнал змін по версіях
├── tsconfig.json
└── README.md
```

---

## 🛠️ Технологічний стек

- **React 18** — UI бібліотека
- **TypeScript** — типізація JavaScript
- **Material-UI (MUI)** — компоненти та дизайн
- **PDF.js** — робота з PDF документами
- **React Router** — навігація
- **Jest** — тестування
- **GitHub Actions** — CI/CD

---

## 📱 Функціональність

✅ Завантаження та валідація PDF файлів  
✅ Виявлення помилок в оформленні  
✅ Дерево результатів з категоріями  
✅ Підтримка різних групп спеціальностей  
✅ Чутливий дизайн (mobile-friendly)  
✅ Автоматичний деплой на GitHub Pages

---

## 📞 Контакти та підтримка

- **GitHub Issues**: <https://github.com/victorchei/pdf-validator/issues>
- **Документація**: Див. папку `/docs`
- **GitHub Discussions**: <https://github.com/victorchei/pdf-validator/discussions>

---

## 📄 Ліцензія

Приватний проект

---

**Статус**: 🟢 Активна розробка
**Версія**: 0.2.0  
**Остання оновлення**: 27 січня 2026
