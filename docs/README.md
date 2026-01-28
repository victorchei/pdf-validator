# 📚 Документація PDF Validator

Ласкаво просимо в документацію проекту **PDF Validator** — веб-застосунку для валідації дипломних робіт у форматі PDF за встановленими стандартами оформлення.

## 📋 Зміст

1. [Огляд проекту](./01-OVERVIEW.md) — загальна інформація про проект
2. [Інструкція встановлення](./02-INSTALLATION.md) — як налаштувати середовище розробки
3. [Архітектура](./03-ARCHITECTURE.md) — структура та організація коду
4. [Компоненти](./04-COMPONENTS.md) — детальний опис всіх React компонентів
5. [Конфігурація](./05-CONFIGURATION.md) — налаштування помилок та груп
6. [API та типи даних](./06-API-TYPES.md) — типи даних та інтерфейси
7. [Розробка](./07-DEVELOPMENT.md) — гайд для розробників
8. [Деплой](./08-DEPLOYMENT.md) — розгортування на GitHub Pages
9. [Розв'язання проблем](./09-TROUBLESHOOTING.md) — типові проблеми та їх рішення
10. [Best Practices](./10-BEST-PRACTICES.md) — рекомендації та найкращі практики

## 🚀 Швидкий старт

```bash
# 1. Клонування репозиторію
git clone https://github.com/victorchei/pdf-validator.git
cd pdf-validator

# 2. Встановлення залежностей
npm install

# 3. Запуск в режимі розробки
npm start

# 4. Збудування для продакшену
npm run build
```

## 🌐 Посилання

- **Live Demo**: <https://victorchei.github.io/pdf-validator/>
- **GitHub**: <https://github.com/victorchei/pdf-validator>
- **Node**: ≥18.0.0
- **npm**: ≥8.0.0

## 🛠️ Стек технологій

- **React 18** — бібліотека для побудови UI
- **TypeScript** — типізація JavaScript
- **Material-UI (MUI)** — компоненти та дизайн-система
- **PDF.js** — робота з PDF документами
- **React Router** — маршрутизація
- **React Hook Form** — управління формами
- **Jest** — тестування

## 🎨 Дизайн та UI/UX

- [Система кольорів](COLOR-SYSTEM.md) - Централізовані CSS змінні
- [Звіт з доступності](ACCESSIBILITY-REPORT.md) - WCAG контрастність
- [Бренд-бук](brand/BRAND-BOOK.md) - Офіційні бренд-гайдлайни

## 🚀 Мультиверсійне розгортання (NEW!)

### 📂 Повна документація

**[/docs/version-management/](version-management/)** - Все про систему управління версіями

### Швидкий старт

- 🎯 [Покроковий гайд](version-management/STEP_BY_STEP_GUIDE.md) - START HERE!
- 📖 [Повна архітектура](version-management/MULTI_PAGE_IMPLEMENTATION.md)
- 🔄 [Автоматичне оновлення](version-management/AUTO_VERSIONS_UPDATE.md)
- ⚡ [Швидка довідка](version-management/QUICK_REFERENCE_MULTIPAGE.md)
- ☑️ [Контрольний список](version-management/IMPLEMENTATION_CHECKLIST.md)

### Ключові можливості

- ✅ Семантичне версіонування (v1.0.0, v1.1.0, v2.0.0)
- ✅ Автоматична синхронізація списку версій
- ✅ VersionSelector з dropdown
- ✅ Alert про застарілу версію
- ✅ CI/CD через GitHub Actions
- ✅ Локальне тестування перед deployment

### URL структура

- Master: `https://victorchei.github.io/pdf-validator/`
- v0: `https://victorchei.github.io/pdf-validator/v0/`
- v1.1.0: `https://victorchei.github.io/pdf-validator/v1.1.0/`

## 📝 Міграції

- [11 - Міграція V1: MUI + Brand](11-MIGRATION-V1-MUI-BRAND.md)
- [12 - Міграція V2: Custom CSS](12-MIGRATION-V2-CUSTOM-CSS.md)
- [13 - Міграція V3: Bootstrap](13-MIGRATION-V3-BOOTSTRAP.md)
- [14 - Порівняння версій](14-VERSIONS-COMPARISON.md)
- [Міграція централізованих кольорів](MIGRATION-CENTRALIZED-COLORS.md)

## 📞 Контакти та підтримка

Документація регулярно оновлюється. Для питань та пропозицій звертайтесь до команди розробників.

---

**Версія**: 0.1.0  
**Останнє оновлення**: Січень 2026
