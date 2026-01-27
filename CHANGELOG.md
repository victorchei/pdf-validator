# Changelog

Усі значущі зміни в проекті документуються у цьому файлі.

Формат базується на [Keep a Changelog](https://keepachangelog.com/uk-UA/1.1.0/),
проект дотримується [Semantic Versioning](https://semver.org/lang/uk/).

---

## [0.2.0] - 2026-01-27

### Додано

- Git submodule для валідатора (`src/validator`) замість ручного клонування
- SSH deploy key для доступу CI до приватного репозиторію `victorchei/validator`
- GitHub Actions workflow для автоматичного деплою на GitHub Pages при push у `master`
- Секрет `VALIDATOR_DEPLOY_KEY` для CI доступу до приватного submodule
- `package-lock.json` для відтворюваних CI білдів
- Файл `CHANGELOG.md` для відстеження змін по версіях

### Змінено

- GitHub Pages source переключено з `master /` на гілку `gh-pages`
- Workflow оновлено: `actions/checkout@v4`, `actions/setup-node@v4`
- Workflow додано `permissions: contents: write` для push у `gh-pages`
- Workflow клонує submodules через SSH замість HTTPS
- Документація оновлена з інформацією про submodules та деплой

### Виправлено

- CI білд падав через відсутність `package-lock.json`
- CI білд падав через відсутність `src/validator` (не був відстежуваний у git)
- Deploy крок падав через відсутність write permissions у `GITHUB_TOKEN`

---

## [0.1.0] - 2026-01-27

### Додано

- Початкова версія веб-застосунку PDF Validator
- React 18 + TypeScript + Material-UI інтерфейс
- Завантаження та валідація PDF файлів
- Дерево результатів з категоріями помилок
- Підтримка груп спеціальностей (ІПЗ, КБ, КІ, КН, КТ)
- Налаштування параметрів валідації через Settings
- Форма зворотного зв'язку (Feedback)
- Повна документація проекту (10 розділів)
- Початковий GitHub Actions workflow для деплою
- Адаптивний дизайн (mobile-friendly)

---

[0.2.0]: https://github.com/victorchei/pdf-validator/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/victorchei/pdf-validator/releases/tag/v0.1.0
