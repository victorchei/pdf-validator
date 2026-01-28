# 🚀 Швидкий старт для нового розробника

## Перший раз після клонування

### 1. Клонування репозиторію

```bash
# Клонуємо з submodules
git clone --recurse-submodules https://github.com/victorchei/pdf-validator.git
cd pdf-validator

# Якщо вже клонували без submodules:
git submodule update --init --recursive
```

### 2. Встановлення залежностей

```bash
npm install
```

### 3. **ВАЖЛИВО!** Встановлення Git hooks

```bash
./scripts/setup-hooks.sh
```

Це встановить pre-commit hook, який автоматично генерує `versions.json` при коміті.

**Вивід:**
```
🔧 Setting up Git hooks...
✅ Git hooks installed successfully!

Pre-commit hook will now automatically generate versions.json
when you commit changes to package.json or generate-versions.js
```

### 4. Запуск проекту

```bash
npm start
```

Відкриється на http://localhost:3000

---

## Як працює автоматизація versions.json

### 🎯 Не треба НІЧОГО робити вручну!

Система автоматично генерує `versions.json` на **трьох рівнях**:

#### 1️⃣ Локально (Pre-commit Hook)

**Коли:** При `git commit`  
**Якщо:** Коммітите `package.json` або `scripts/generate-versions.js`  
**Що робить:** Автоматично генерує та додає `versions.json` до коміту

**Приклад:**
```bash
git add package.json
git commit -m "chore: Bump version to 1.1.0"

# Вивід:
# 🔍 Checking if versions.json needs update...
# 📝 Detected changes in package.json or generate-versions.js
# 🔄 Generating versions.json...
# ✨ versions.json updated
# ✅ Staged updated versions.json
# [master abc1234] chore: Bump version to 1.1.0
```

#### 2️⃣ На GitHub (Deploy Workflows)

**Коли:** При кожному деплої (push в `master` або `v*.*.*`)  
**Що робить:** Генерує `versions.json` перед білдом

**Workflows:**
- `deploy.yml` - для master
- `deploy-version.yml` - для версійних гілок

**Не потребує дій!** Спрацює автоматично.

#### 3️⃣ Резервний (Auto-update Workflow)

**Коли:** При push в `master` якщо змінилися `package.json` або `generate-versions.js`  
**Що робить:** Додатково перевіряє та комітить якщо пропущено

**Не потребує дій!** Страховка на випадок помилок.

---

## Типові сценарії

### Створення нової версії

```bash
# 1. Створити гілку
git checkout -b v1.2.0

# 2. Оновити версію в package.json
# {
#   "version": "1.2.0"
# }

# 3. Додати в scripts/generate-versions.js
# {
#   id: 'v1.2.0',
#   version: '1.2.0',
#   deployed: true,
#   ...
# }

# 4. Commit (versions.json згенерується автоматично!)
git add .
git commit -m "feat: Create v1.2.0"
# 🔍 Checking if versions.json needs update...
# ✨ versions.json updated  <-- АВТОМАТИЧНО!
# ✅ Staged updated versions.json

# 5. Push
git push origin v1.2.0

# 6. Merge в master
git checkout master
git merge v1.2.0
git push origin master
```

**Результат:**
- ✅ versions.json оновлюється автоматично на кроці 4
- ✅ deploy-version.yml задеплоїть на `/v1.2.0/`
- ✅ deploy.yml задеплоїть master на `/`

### Зміна package.json

```bash
# 1. Змінити версію
nano package.json  # "version": "1.0.2"

# 2. Commit
git add package.json
git commit -m "chore: Bump to 1.0.2"
# Pre-commit hook АВТОМАТИЧНО додасть versions.json!

# 3. Push
git push origin master
```

**Що відбувається:**
1. Pre-commit hook генерує versions.json → додає до коміту
2. GitHub Actions deploy.yml → деплоїть з новим versions.json
3. Auto-update workflow → резервна перевірка (якщо щось пропущено)

---

## Перевірка налаштування

### Чи встановлено Git hooks?

```bash
git config core.hooksPath
```

**Має показати:** `.githooks`

**Якщо пусто:**
```bash
./scripts/setup-hooks.sh
```

### Чи працює pre-commit hook?

```bash
# Тест
echo '{"version":"test"}' > package.json
git add package.json
git commit -m "test"

# Має показати:
# 🔍 Checking if versions.json needs update...
# 📝 Detected changes in package.json
# ✨ versions.json updated

git reset HEAD~1  # Відкат тесту
git checkout package.json
```

---

## FAQ для нових розробників

### ❓ Чи треба вручну запускати `npm run generate-versions`?

**Відповідь:** НІ! Це робиться автоматично:
- Локально - pre-commit hook
- На GitHub - deploy workflows

### ❓ Що робити якщо забув встановити hooks?

**Відповідь:** 
```bash
./scripts/setup-hooks.sh
```

Після цього все запрацює.

### ❓ Чи можна відключити pre-commit hook?

**Відповідь:** Не рекомендується, але можна:
```bash
git commit --no-verify -m "message"
```

Але тоді треба вручну:
```bash
npm run generate-versions
git add public/versions.json
```

### ❓ Що робити якщо versions.json не оновився?

**Відповідь:** Система має 3 рівні захисту, але якщо щось пропущено:

1. Перевірити hooks: `git config core.hooksPath`
2. Запустити вручну: `npm run generate-versions`
3. Закомітити: `git add public/versions.json && git commit -m "fix: Update versions.json"`
4. Перевірити GitHub Actions логи

### ❓ Чи треба комітити public/versions.json?

**Відповідь:** НІ! Pre-commit hook та GitHub Actions роблять це автоматично.

---

## Архітектура автоматизації

```
┌─────────────────────────────────────────────────────┐
│  git commit (package.json/generate-versions.js)    │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ Pre-commit Hook    │ 🔧 Локальна автоматизація
         │ (.githooks/)       │
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ Generate           │
         │ versions.json      │
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ git add            │
         │ public/versions.js │
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ Commit успішний    │
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ git push           │
         └────────┬───────────┘
                  │
                  ▼
         ┌─────────────────────┐
         │ GitHub Actions      │ 🤖 Серверна автоматизація
         └────────┬────────────┘
                  │
         ┌────────┴───────────┐
         ▼                    ▼
┌──────────────────┐  ┌──────────────────┐
│ deploy.yml       │  │ auto-update-     │
│ (master)         │  │ versions.yml     │
│                  │  │ (резерв)         │
│ Generate         │  │                  │
│ versions.json    │  │ Перевіряє +      │
│ → Build → Deploy │  │ Комітить якщо    │
│                  │  │ пропущено        │
└──────────────────┘  └──────────────────┘
```

---

## Шпаргалка команд

```bash
# Початкове налаштування (один раз)
./scripts/setup-hooks.sh

# Створення нової версії
git checkout -b v1.X.X
# ... зміни в package.json та generate-versions.js ...
git commit -m "feat: v1.X.X"  # versions.json AUTO!
git push origin v1.X.X

# Оновлення версії в master
nano package.json  # Змінити version
git commit -m "chore: Bump version"  # versions.json AUTO!
git push

# Перевірка налаштувань
git config core.hooksPath  # Має бути: .githooks

# Ручна генерація (якщо треба)
npm run generate-versions
```

---

## Що НЕ потрібно робити

❌ Вручну запускати `npm run generate-versions` перед комітом  
❌ Вручну додавати `git add public/versions.json`  
❌ Створювати окремі workflow файли для нових версій  
❌ Хвилюватися про синхронізацію versions.json

---

## Підтримка

Якщо є проблеми:
1. Перевірити [DEPLOYMENT_STRATEGY.md](./docs/version-management/DEPLOYMENT_STRATEGY.md) → Troubleshooting
2. Перевірити логи GitHub Actions
3. Запустити `./scripts/setup-hooks.sh` ще раз

---

**Остання оновлена:** 28 січня 2026  
**Версія гайду:** 1.0.0
