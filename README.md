# 📄 PDF Validator

Веб-застосунок для автоматичної валідації дипломних робіт у форматі PDF за встановленими стандартами оформлення.

🌐 **Live**: https://victorchei.github.io/pdf-validator/

---

## 📚 Документація

Повна документація проекту українською мовою знаходиться в папці `/docs`:

| Документ | Опис |
|----------|------|
| [📖 Огляд](./docs/01-OVERVIEW.md) | Загальна інформація про проект та його цілі |
| [🔧 Встановлення](./docs/02-INSTALLATION.md) | Детальна інструкція для налаштування середовища |
| [🏗️ Архітектура](./docs/03-ARCHITECTURE.md) | Структура проекту, компоненти та data flow |
| [🧩 Компоненти](./docs/04-COMPONENTS.md) | Опис всіх React компонентів та їх props |
| [⚙️ Конфігурація](./docs/05-CONFIGURATION.md) | Налаштування помилок та груп спеціальностей |
| [📚 API & Типи](./docs/06-API-TYPES.md) | TypeScript типи та інтерфейси |
| [👨‍💻 Розробка](./docs/07-DEVELOPMENT.md) | Гайд для розробників та Git workflow |
| [🚀 Деплой](./docs/08-DEPLOYMENT.md) | Розгортування на GitHub Pages та інші способи |
| [🆘 Проблеми](./docs/09-TROUBLESHOOTING.md) | Розв'язання типових проблем |
| [⭐ Best Practices](./docs/10-BEST-PRACTICES.md) | Рекомендації та найкращі практики |

---

## 🚀 Швидкий старт

### Передумови
- **Node.js**: ≥18.0.0
- **npm**: ≥8.0.0

### Встановлення

```bash
# 1. Клонування репозиторію
git clone https://github.com/victorchei/pdf-validator.git
cd pdf-validator

# 2. Встановлення залежностей
npm install

# 3. Запуск в режимі розробки
npm start

# Додаток відкриється на http://localhost:3000
```

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
# 1. Мержимо develop в master
git checkout master
git merge develop

# 2. Пушимо в master
git push origin master

# 3. GitHub Actions автоматично деплоїть на GitHub Pages ✨
```

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
│   ├── validator/                  # 🔴 Зовнішній модуль валідатора
│   └── index.tsx                   # Точка входу
├── package.json
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

- **GitHub Issues**: https://github.com/victorchei/pdf-validator/issues
- **Документація**: Див. папку `/docs`
- **GitHub Discussions**: https://github.com/victorchei/pdf-validator/discussions

---

## 📄 Ліцензія

Приватний проект

---

**Статус**: 🟢 Активна розробка  
**Версія**: 0.1.0  
**Остання оновлення**: Січень 2026



