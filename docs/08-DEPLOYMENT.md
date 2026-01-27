# 🚀 Деплой

Гайд для розгортування додатку на GitHub Pages та інші варіанти деплою.

---

## 🌐 GitHub Pages (Рекомендований спосіб)

### Конфігурація

Проект вже налаштований для автоматичного деплою на GitHub Pages через GitHub Actions.

#### 1. Налаштування репозиторію

**В GitHub**:

1. Переходимо: **Settings** → **Pages**
2. У **Source** вибираємо: **Deploy from a branch**
3. У **Branch** вибираємо: **gh-pages** та папку **/root**
4. Натискаємо **Save**

#### 2. Налаштування package.json

```json
{
  "homepage": "https://victorchei.github.io/pdf-validator",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

#### 3. GitHub Actions Workflow

**Файл**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - master

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

### Як працює автоматичний деплой

```
1. Комітимо і пушимо в master
        ↓
2. GitHub Actions спрацьовує
        ↓
3. npm ci — встановлює залежності
        ↓
4. npm run build — створює папку build/
        ↓
5. Вміст build/ деплоїтся на gh-pages гілку
        ↓
6. GitHub Pages публікує з gh-pages
        ↓
7. Сайт доступний на https://victorchei.github.io/pdf-validator/
```

### Статус деплою

**Перевірити статус**:

1. Переходимо на GitHub репозиторій
2. Клікаємо на **Actions** таб
3. Вибираємо останній workflow run
4. Дивимось status та логи

### Розв'язання проблем з GitHub Pages

#### ❌ Workflow падає

```
Перевірте:
✅ gh-pages залежність встановлена: npm list gh-pages
✅ homepage в package.json правильна
✅ У Settings → Pages вибрана gh-pages гілка
✅ Node.js версія >= 18
```

#### ❌ Сайт показує 404

```
Рішення:
1. Переконайтесь, що gh-pages гілка існує:
   git branch -a | grep gh-pages

2. Перевірте публічний папку:
   public/index.html має існувати

3. Знову деплойте:
   git push origin master
```

#### ❌ Стара версія сайту

```
Рішення:
1. Очистити кеш браузера (Ctrl+Shift+Delete)
2. Перезавантажити сторінку (Ctrl+F5)
3. Очистити GitHub Pages кеш:
   - Settings → Pages
   - Збільшити версію deploy (якщо можливо)
```

---

## 💻 Локальне тестування перед деплоєм

### 1. Білд додатку

```bash
npm run build
```

Створює оптимізований білд в папці `build/`.

### 2. Локальний серверу

```bash
# Встановлюємо serve глобально
npm install -g serve

# Запускаємо білд локально
serve -s build

# Приймається на: http://localhost:3000
```

### 3. Тестування

- Перевірити функціональність
- Перевірити стилізацію
- Перевірити посилання
- Тестування на мобільних пристроях

### 4. Лог білда

```bash
npm run build -- --verbose

# Показує детальний логу білда та розміри файлів
```

---

## 📦 Деплой на Vercel (Альтернатива)

### Налаштування

```bash
# 1. Встановлюємо Vercel CLI
npm install -g vercel

# 2. Логуємось
vercel login

# 3. Деплоймо перший раз
vercel

# 4. На питання відповідаємо:
# - Which scope do you want to deploy to? (ваш аккаунт)
# - Found package.json. How should I set up your new project? (React)
# - Detected 'npm i'. Confirm? (y)
```

### Автоматичний деплой на Vercel

**GitHub Actions для Vercel**:

Можна налаштувати, щоб кожен коміт автоматично деплоївся.

---

## 📦 Деплой на Netlify (Альтернатива)

### Налаштування

```bash
# 1. Встановлюємо Netlify CLI
npm install -g netlify-cli

# 2. Логуємось
netlify login

# 3. Зв'язуємо з репозиторієм
netlify connect
```

### netlify.toml конфіг

```toml
[build]
  command = "npm run build"
  publish = "build"

[dev]
  command = "npm start"
  port = 3000

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## ☁️ Деплой на AWS S3 + CloudFront

### Налаштування

```bash
# 1. Встановлюємо AWS CLI
npm install -g awscli

# 2. Налаштовуємо credentials
aws configure

# 3. Білдимо
npm run build

# 4. Завантажуємо в S3
aws s3 sync build/ s3://your-bucket-name --delete

# 5. Інвалідуємо CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

## 📋 Pre-deployment Checklist

Перед деплоєм переконайтесь:

- [ ] Всі тести проходять: `npm test`
- [ ] Код зліінтований без помилок: `npx eslint src/`
- [ ] Нема console.log в продакшну коді
- [ ] Версія в package.json оновлена
- [ ] CHANGELOG оновлений
- [ ] Документація актуальна
- [ ] Немає hardcoded URLs (використовуйте env variables)
- [ ] Все протестовано локально: `serve -s build`
- [ ] Комміт додано: `git add .` → `git commit -m "..."`
- [ ] Пуш в master: `git push origin master`

---

## 🔐 Середовищні змінні (Environment Variables)

### .env файли

```bash
# .env.local (не комітити в git!)
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENV=development
```

### Використання

```typescript
const apiUrl = process.env.REACT_APP_API_URL
const env = process.env.REACT_APP_ENV

// Тільки REACT_APP_* починаються з префіксу!
```

### GitHub Secrets (для Actions)

1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Назва: `MY_SECRET`
4. Значення: `secret-value`

**Використання в workflow**:

```yaml
- name: Deploy
  env:
    MY_SECRET: ${{ secrets.MY_SECRET }}
  run: echo $MY_SECRET
```

---

## 📊 Моніторинг після деплою

### 1. Перевірити сайт

```bash
# Відкрити в браузері
https://victorchei.github.io/pdf-validator/

# Перевірити:
✅ Сайт завантажується
✅ CSS завантажується правильно
✅ Все функціонує
✅ Немає помилок в console (F12)
```

### 2. Lighthouse аналіз

```
Chrome DevTools → Lighthouse → Analyze page load
```

Перевіряє:

- Performance
- Accessibility
- Best Practices
- SEO

### 3. Моніторинг помилок

```bash
# GitHub Actions
# Settings → Actions → View all

# Логи деплою:
# Actions таб → натисніть на workflow
```

---

## 🔄 Откат деплою

### Якщо щось пішло не так

```bash
# 1. Повертаємось на останню гарну версію
git revert HEAD

# Або переходимо на конкретний коміт
git reset --hard <commit-hash>

# 2. Пушимо в master
git push origin master

# 3. GitHub Actions автоматично деплоїть нову версію
```

### Очистити gh-pages гілку

```bash
# Якщо потрібно очистити все
git push origin --delete gh-pages

# GitHub Pages переніне контент з нової gh-pages
```

---

## 📝 Версіонування

### Semantic Versioning

```
MAJOR.MINOR.PATCH

0.1.0 = Version 0, Release 1, Patch 0

0.1.0 → 0.1.1 = Patch (баг-фікс)
0.1.0 → 0.2.0 = Minor (нова функція)
0.1.0 → 1.0.0 = Major (breaking change)
```

### Оновлення версії

```bash
# Вручну в package.json
"version": "0.1.1"

# Або використовуйте npm
npm version patch     # 0.1.0 → 0.1.1
npm version minor     # 0.1.0 → 0.2.0
npm version major     # 0.1.0 → 1.0.0
```

### Git tags

```bash
# Створити тег версії
git tag -a v0.1.0 -m "Release version 0.1.0"
git push origin v0.1.0

# Список тагів
git tag

# Видалити тег
git tag -d v0.1.0
```

---

## 📚 Корисні посилання

- **GitHub Pages docs**: https://pages.github.com/
- **GitHub Actions docs**: https://docs.github.com/en/actions
- **Vercel docs**: https://vercel.com/docs
- **Netlify docs**: https://docs.netlify.com/
- **AWS S3 docs**: https://docs.aws.amazon.com/s3/

---

**Статус**: ✅ Актуально  
**Останнє оновлення**: Січень 2026
