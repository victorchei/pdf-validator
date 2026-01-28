# Контрольний список впровадження мультиверсійного розгортання

## Передумови

- [ ] Node.js ≥18.0.0 встановлено
- [ ] npm ≥8.0.0 встановлено
- [ ] Git налаштований
- [ ] GitHub Pages активовано в Settings → Pages
- [ ] Доступ до GitHub Actions (workflows)

---

## Фаза 1: Базова інфраструктура

### 1.1 Скрипт генерації versions.json

- [ ] Створити папку `scripts/`
- [ ] Створити файл `scripts/generate-versions.js`
- [ ] Додати VERSIONS_CONFIG з мінімум master
- [ ] Протестувати: `node scripts/generate-versions.js`
- [ ] Перевірити що створено `public/versions.json`

### 1.2 Оновлення package.json

- [ ] Додати script: `"generate-versions": "node scripts/generate-versions.js"`
- [ ] Додати hook: `"prebuild": "npm run generate-versions"`
- [ ] Протестувати: `npm run generate-versions`
- [ ] Протестувати: `npm run build` (має викликати prebuild)

### 1.3 React Router basename

- [ ] Оновити `src/index.tsx`
- [ ] Додати функцію `getBasename()` для детекції версії
- [ ] Оновити `<BrowserRouter basename={getBasename()}>`
- [ ] Протестувати локально на різних шляхах

---

## Фаза 2: UI Компонента

### 2.1 Створення VersionSelector

- [ ] Створити `src/components/VersionSelector/`
- [ ] Створити `index.tsx` з основною логікою
- [ ] Створити `VersionSelector.module.css`
- [ ] Додати TypeScript інтерфейси
- [ ] Додати fetch логіку для versions.json
- [ ] Додати fallback на випадок помилки

### 2.2 Інтеграція з TopInfo

- [ ] Імпортувати VersionSelector в TopInfo
- [ ] Додати компонент після заголовку
- [ ] Додати CSS для wrapper (.versionSelectorWrapper)
- [ ] Протестувати responsive дизайн (mobile, tablet, desktop)

### 2.3 Стилізація

- [ ] Переконатись що використовуються CSS змінні
- [ ] Додати responsive breakpoints
- [ ] Додати hover стани
- [ ] Протестувати accessibility (keyboard navigation)

---

## Фаза 3: GitHub Actions

### 3.1 Workflow для Master

- [ ] Створити `.github/workflows/deploy-master.yml`
- [ ] Налаштувати trigger: `push` на `master`
- [ ] Додати steps: checkout, setup-node, install, build
- [ ] Встановити PUBLIC_URL: `/pdf-validator`
- [ ] Налаштувати peaceiris/actions-gh-pages з `keep_files: true`
- [ ] Протестувати: зробити commit в master і перевірити Actions

### 3.2 Workflow для версій

- [ ] Створити `.github/workflows/deploy-version.yml`
- [ ] Налаштувати trigger: `push` на `v[0-9]+/main`
- [ ] Додати step для екстракції номера версії
- [ ] Встановити PUBLIC_URL: `/pdf-validator/$VERSION`
- [ ] Налаштувати destination_dir: `$VERSION`
- [ ] Встановити `keep_files: true`

### 3.3 Тестування workflows

- [ ] Зробити test commit в master
- [ ] Перевірити GitHub Actions → зелений чекмарк
- [ ] Перевірити що versions.json оновлено на gh-pages
- [ ] Перевірити що сайт доступний на victorchei.github.io/pdf-validator/

---

## Фаза 4: Створення версійних веток

### 4.1 Створення v1

- [ ] `git checkout -b v1/main master`
- [ ] Оновити `scripts/generate-versions.js` (додати v1 в VERSIONS_CONFIG)
- [ ] `git commit -m "Add v1 version config"`
- [ ] `git push origin v1/main`
- [ ] Перевірити Actions → deploy-version.yml запущено
- [ ] Перевірити що v1 доступна: `/pdf-validator/v1/`

### 4.2 Перевірка автоматичного оновлення

- [ ] Відкрити master версію: `/pdf-validator/`
- [ ] Перевірити dropdown VersionSelector
- [ ] Переконатись що є опція "Версія 1"
- [ ] Перевірити перехід на v1 версію
- [ ] Відкрити v1 версію і перевірити dropdown
- [ ] Переконатись що v1 теж бачить master і себе

### 4.3 Створення v2 (опціонально)

- [ ] Повторити кроки 4.1 для v2
- [ ] Перевірити що всі 3 версії бачать одна одну

---

## Фаза 5: Валідація та тестування

### 5.1 Функціональне тестування

- [ ] Перевірити що всі URL відкриваються:
  - [ ] `https://victorchei.github.io/pdf-validator/`
  - [ ] `https://victorchei.github.io/pdf-validator/v1/`
  - [ ] `https://victorchei.github.io/pdf-validator/v2/`
- [ ] Перевірити versions.json доступний:
  - [ ] `https://victorchei.github.io/pdf-validator/versions.json`
- [ ] Перевірити що dropdown працює на всіх версіях
- [ ] Протестувати перехід між версіями

### 5.2 Browser тестування

- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (mobile iOS)

### 5.3 Responsive тестування

- [ ] Mobile (320px, 375px, 414px)
- [ ] Tablet (768px, 1024px)
- [ ] Desktop (1280px, 1440px, 1920px)
- [ ] VersionSelector правильно відображається на всіх розмірах

### 5.4 Performance

- [ ] versions.json завантажується швидко (< 500ms)
- [ ] Немає CORS помилок в Console
- [ ] Немає 404 помилок
- [ ] Lighthouse score > 90

---

## Фаза 6: Документація

### 6.1 Основні документи

- [x] MULTI_PAGE_IMPLEMENTATION.md створено
- [x] AUTO_VERSIONS_UPDATE.md створено
- [x] QUICK_REFERENCE_MULTIPAGE.md створено
- [ ] README.md оновлено з посиланням на нову архітектуру

### 6.2 Внутрішня документація

- [ ] Додати коментарі в scripts/generate-versions.js
- [ ] Додати JSDoc в VersionSelector компоненті
- [ ] Оновити CHANGELOG.md з інформацією про multipage

### 6.3 Team documentation

- [ ] Створити Wiki сторінку (якщо потрібно)
- [ ] Додати інструкції в CONTRIBUTING.md
- [ ] Повідомити команду про нову архітектуру

---

## Фаза 7: Моніторинг і підтримка

### 7.1 Налаштування моніторингу

- [ ] Додати uptime monitoring для всіх версій
- [ ] Налаштувати alerts для failed deployments
- [ ] Додати версії в статус dashboard (якщо є)

### 7.2 Backup стратегія

- [ ] Документувати rollback процедуру
- [ ] Зберігати старі versions.json (git history)
- [ ] Мати план відновлення для кожної версії

### 7.3 Регулярне обслуговування

- [ ] Перевіряти versions.json раз на місяць
- [ ] Оновлювати застарілі версії (security patches)
- [ ] Видаляти дуже старі версії (за потреби)

---

## Критерії успіху

✅ **Базовий рівень (MVP)**

- Master версія доступна на `/pdf-validator/`
- v1 версія доступна на `/pdf-validator/v1/`
- VersionSelector працює на обох версіях
- versions.json автоматично оновлюється

✅ **Повний функціонал**

- Мінімум 2 версії розгорнуто
- Автоматичне оновлення працює
- Всі версії синхронізовані
- Документація повна
- CI/CD налаштовано

✅ **Production ready**

- Всі тести пройдено
- Browser compatibility перевірено
- Performance оптимізовано
- Моніторинг налаштовано
- Команда навчена

---

## Troubleshooting checklist

Якщо щось не працює, перевірте:

### versions.json не завантажується

- [ ] Файл існує на gh-pages в корені?
- [ ] CORS правильно налаштований?
- [ ] URL правильний (абсолютний шлях)?
- [ ] Network tab показує 200 OK?

### Dropdown порожній

- [ ] Console показує помилки?
- [ ] Fallback спрацював?
- [ ] versions.json має правильну структуру?
- [ ] fetch успішний в Network tab?

### Deploy не працює

- [ ] GitHub Actions запущено?
- [ ] Токен GITHUB_TOKEN має права?
- [ ] keep_files: true встановлено?
- [ ] destination_dir правильний?

### Версія не бачить іншу версію

- [ ] versions.json оновлено?
- [ ] Кеш браузера очищено?
- [ ] Fetch URL правильний (absolute path)?
- [ ] VERSIONS_CONFIG містить всі версії?

---

## Наступні кроки після впровадження

1. Створити v2 версію з новими фічами
2. Додати A/B тестування між версіями
3. Налаштувати analytics для кожної версії окремо
4. Розглянути можливість dynamic версії detection через GitHub API
5. Додати version badges в README
6. Створити changelog для кожної версії

---

**Створено**: 2026-01-28  
**Автор**: PDF Validator Team  
**Версія документа**: 1.0
