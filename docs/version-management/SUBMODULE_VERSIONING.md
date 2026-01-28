# 🔗 Управління версіями сабмодуля validator

## ❗ КРИТИЧНО ВАЖЛИВО

**Гілки в сабмодулі validator ПОВИННІ відповідати гілкам в pdf-validator!**

```
pdf-validator (UI)          validator (субмодуль)
├── master                  ├── master (створити!)
├── v1.0.0                  ├── v1.0.0 (створити!)
├── v1.1.0                  ├── v1.1.0 (створити!)
└── develop                 └── develop (існує)
```

---

## 📍 Поточний стан

### validator repository

**Default branch**: `main` ← Це проблема!

**Існуючі гілки:**

- `main` (default)
- `develop` ✅
- Feature branches (багато)

**Що потрібно:**

- Створити гілку `master` (синхронна з pdf-validator)
- Змінити default branch на `master`
- Створювати версійні гілки (v1.0.0, v1.1.0) синхронно

---

## 🔄 Стратегія синхронізації

### Правило іменування

```
pdf-validator branch = validator branch
```

**Приклади:**

| pdf-validator | validator | Коли створювати          |
| ------------- | --------- | ------------------------ |
| `master`      | `master`  | При першому налаштуванні |
| `v1.0.0`      | `v1.0.0`  | При релізі v1.0.0        |
| `v1.1.0`      | `v1.1.0`  | При релізі v1.1.0        |
| `develop`     | `develop` | Вже існує ✅             |

---

## 🎯 Workflow синхронізації версій

### Сценарій 1: Перший setup (master)

#### В validator repository

```bash
# 1. Клонувати validator окремо
git clone https://github.com/victorchei/validator.git
cd validator

# 2. Перевірити поточну гілку
git branch --show-current
# main

# 3. Створити master з main
git checkout -b master
git push origin master

# 4. На GitHub змінити default branch на master
# Settings → Branches → Default branch → master

# 5. Оновити версію в package.json
npm version 1.0.0 --no-git-tag-version

# 6. Commit
git add package.json
git commit -m "chore: bump version to 1.0.0"
git push origin master
```

---

#### В pdf-validator repository

```bash
# Повернутись в pdf-validator
cd /Users/viktorzhelizko/Projects-local/pdf-validator

# Оновити субмодуль на master гілку
cd src/validator
git checkout master
git pull origin master
cd ../..

# Commit зміни в субмодулі
git add src/validator
git commit -m "chore: update validator submodule to master branch"
git push origin master
```

---

### Сценарій 2: Новий реліз (v1.0.0)

#### 1. Підготовка в pdf-validator

```bash
# В pdf-validator на master
git checkout master
git pull origin master

# Створити гілку v1.0.0
git checkout -b v1.0.0
```

---

#### 2. Створення відповідної гілки в validator

```bash
# Перейти в субмодуль
cd src/validator

# Переконатись що на master
git checkout master
git pull origin master

# Створити гілку v1.0.0 в validator
git checkout -b v1.0.0

# Оновити версію (якщо потрібно)
npm version 1.0.0 --no-git-tag-version

# Commit
git add package.json
git commit -m "chore: release v1.0.0"

# Push в validator repository
git push origin v1.0.0

# Повернутись в pdf-validator
cd ../..
```

---

#### 3. Commit зміни субмодуля в pdf-validator

```bash
# Тепер субмодуль вказує на v1.0.0 гілку
git add src/validator
git commit -m "chore: update validator submodule to v1.0.0 branch"
git push origin v1.0.0
```

---

### Сценарій 3: Hotfix на версії

#### Якщо потрібен hotfix для v1.0

```bash
# 1. В validator
cd validator-standalone  # Окремий clone
git checkout v1.0
git pull origin v1.0

# Внести зміни для hotfix
# ... edit code ...

# Bump patch version
npm version patch  # 1.0.0 → 1.0.1

git add .
git commit -m "fix: critical bug in validation logic"
git push origin v1.0

# 2. В pdf-validator
cd /path/to/pdf-validator
git checkout v1.0

# Оновити субмодуль
cd src/validator
git checkout v1.0
git pull origin v1.0
cd ../..

# Commit
git add src/validator
git commit -m "chore: update validator to v1.0.1 (hotfix)"
git push origin v1.0
```

---

## 📋 Чек-лист синхронізації

### Початкове налаштування

- [ ] Клонувати validator окремо
- [ ] Створити `master` гілку в validator
- [ ] Змінити default branch на `master` (GitHub Settings)
- [ ] Bump version на 1.0.0 в validator/package.json
- [ ] Push master в validator
- [ ] Оновити субмодуль в pdf-validator на master
- [ ] Commit зміни субмодуля в pdf-validator

---

### При створенні нової версії

- [ ] В pdf-validator: створити гілку vX.Y
- [ ] В validator: створити гілку vX.Y (з master)
- [ ] В validator: bump version якщо потрібно
- [ ] Push validator/vX.Y
- [ ] В pdf-validator: `cd src/validator && git checkout vX.Y`
- [ ] Commit зміни субмодуля в pdf-validator
- [ ] Push pdf-validator/vX.Y

---

## 🔍 Перевірка синхронізації

### Команди для перевірки

```bash
# В pdf-validator
git checkout master
cat .gitmodules  # Перевірити URL субмодуля

cd src/validator
git branch --show-current  # Має показати: master
git remote get-url origin  # https://github.com/victorchei/validator.git

# Перевірити версію
cat package.json | grep version
```

---

### Автоматична перевірка

**Скрипт для перевірки синхронізації:**

```bash
#!/bin/bash
# check-submodule-sync.sh

# Отримати поточну гілку pdf-validator
PDF_BRANCH=$(git branch --show-current)

# Отримати поточну гілку validator
cd src/validator
VALIDATOR_BRANCH=$(git branch --show-current)
cd ../..

echo "📊 Статус синхронізації гілок:"
echo "  pdf-validator:  $PDF_BRANCH"
echo "  validator:      $VALIDATOR_BRANCH"

if [ "$PDF_BRANCH" = "$VALIDATOR_BRANCH" ]; then
    echo "✅ Гілки синхронізовані!"
else
    echo "⚠️  ПОПЕРЕДЖЕННЯ: Гілки НЕ співпадають!"
    echo ""
    echo "Рекомендація:"
    echo "  cd src/validator"
    echo "  git checkout $PDF_BRANCH"
    echo "  cd ../.."
    echo "  git add src/validator"
    echo "  git commit -m 'chore: sync validator to $PDF_BRANCH branch'"
fi
```

**Використання:**

```bash
chmod +x scripts/check-submodule-sync.sh
./scripts/check-submodule-sync.sh
```

---

## ⚠️ Типові проблеми

### Проблема 1: Субмодуль на іншій гілці

**Симптом:**

```bash
git status
# Changes not staged for commit:
#   modified:   src/validator (new commits)
```

**Рішення:**

```bash
cd src/validator
git checkout master  # Або потрібна гілка
git pull origin master
cd ../..
git add src/validator
git commit -m "chore: sync validator submodule"
```

---

### Проблема 2: Субмодуль не ініціалізований

**Симптом:**

```bash
cd src/validator
# bash: cd: src/validator: No such file or directory
```

**Рішення:**

```bash
git submodule update --init --recursive
```

---

### Проблема 3: Різні версії в package.json

**Перевірка:**

```bash
# pdf-validator
cat package.json | grep version
# "version": "1.0.0"

# validator
cat src/validator/package.json | grep version
# "version": "0.5.0"  ← Не співпадає!
```

**Рішення:**

```bash
cd src/validator
npm version 1.0.0 --no-git-tag-version
git add package.json
git commit -m "chore: sync version with pdf-validator"
git push origin master
cd ../..
git add src/validator
git commit -m "chore: update validator to v1.0.0"
```

---

## 🔐 Best Practices

### 1. Завжди синхронізувати назви гілок

```bash
# ПРАВИЛЬНО ✅
pdf-validator/master    → validator/master
pdf-validator/v1.0.0    → validator/v1.0.0
pdf-validator/develop   → validator/develop

# НЕПРАВИЛЬНО ❌
pdf-validator/master    → validator/main
pdf-validator/v1.0.0    → validator/release-1.0
```

---

### 2. Версії в package.json мають співпадати

```json
// pdf-validator/package.json
{
  "version": "1.0.0"
}

// validator/package.json
{
  "version": "1.0.0"  // ← Має бути така сама!
}
```

---

### 3. Commit субмодуля після кожної зміни

```bash
# Після будь-яких змін в validator
cd src/validator
git status  # Перевірити зміни

cd ../..
git add src/validator
git commit -m "chore: update validator submodule"
git push
```

---

### 4. Використовувати CI для перевірки

**GitHub Actions workflow:**

```yaml
name: Check Submodule Sync

on: [push, pull_request]

jobs:
  check-sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive

      - name: Check branch sync
        run: |
          MAIN_BRANCH=$(git branch --show-current)
          cd src/validator
          SUB_BRANCH=$(git branch --show-current)

          if [ "$MAIN_BRANCH" != "$SUB_BRANCH" ]; then
            echo "❌ Branch mismatch!"
            echo "Main: $MAIN_BRANCH"
            echo "Submodule: $SUB_BRANCH"
            exit 1
          fi

          echo "✅ Branches synced: $MAIN_BRANCH"
```

---

## 📚 Додаткова документація

### Для validator repository

Створити файл `docs/BRANCHING_STRATEGY.md` в validator:

```markdown
# Стратегія гілок validator

## ⚠️ ВАЖЛИВО

Гілки в цьому repository ПОВИННІ співпадати з pdf-validator!

### Гілки

- `master` - production версія (sync з pdf-validator/master)
- `v1.0.0`, `v1.1.0` - версійні гілки (sync з pdf-validator)
- `develop` - активна розробка

### Створення нової версії

1. Дочекатись створення гілки в pdf-validator
2. Створити відповідну гілку тут
3. Sync версії в package.json

Детальніше: https://github.com/victorchei/pdf-validator/tree/master/docs/version-management
```

---

## 🎯 Підсумок

### Ключові правила

1. ✅ **Назви гілок синхронізовані**: pdf-validator/master = validator/master
2. ✅ **Версії синхронізовані**: обидва package.json мають однакову версію
3. ✅ **Default branch**: змінити в validator з `main` на `master`
4. ✅ **Commit субмодуля**: після кожної зміни в validator
5. ✅ **Перевірка**: використовувати скрипти та CI

### Що далі?

1. Створити `master` в validator
2. Змінити default branch на GitHub
3. Оновити субмодуль в pdf-validator
4. Створити скрипт перевірки
5. Додати CI workflow

---

**Готові почати?** → Слідуйте "Сценарій 1: Перший setup"! 🚀
