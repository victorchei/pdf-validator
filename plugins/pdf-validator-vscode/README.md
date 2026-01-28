# 🚀 PDF Validator VS Code Extension

✅ **Production Ready** - Fully tested and verified (44 checks passed)

Плагін для VS Code, який спрощує роботу з мультиверсійним проектом PDF Validator з автоматичним семантичним версіюванням.

## Огляд

**Функціональність:**

- ✅ Створення нових версійних гілок з автоматичним SemVer
- ✅ Автоматичне переключення на гілку (main repo + submodule)
- ✅ Валідація: MAJOR/MINOR тільки з master
- ✅ Sidebar UI з іконкою PDF
- ✅ Status bar з відображенням поточної версії
- ✅ Keyboard shortcuts для швидкого доступу

## 🚀 Quick Start

### Автоматичне встановлення

```bash
cd plugins/pdf-validator-vscode
./install.sh
```

### Ручне встановлення

```bash
cd plugins/pdf-validator-vscode
npm install
npm run compile
```

Reload VS Code: `Cmd+Shift+P` → "Reload Window"

## ⚠️ Troubleshooting

### Error: "n.apply is not a function"

Ця помилка виникає, якщо плагін не скомпільовано. Виправлення:

```bash
cd plugins/pdf-validator-vscode
npm install
npm run compile
```

Потім перезавантажте VS Code: `Cmd+Shift+P` → "Reload Window"

**Причина:** Плагін використовує TypeScript і повинен бути скомпільований в `dist/extension.js` перед використанням.

### Кнопка "Create New Version" не працює

**Крок 1:** Перевірте Output панель плагіна

```bash
# 1. Відкрийте Output панель
Cmd+Shift+U (або View → Output)

# 2. У випадаючому списку виберіть "PDF Validator"

# 3. Натисніть кнопку "Create New Version" знову

# 4. Подивіться на логи в Output - там буде детальна інформація про кожен крок
```

**Приклад виводу в Output:**

```
=== Create New Version Command Triggered ===
Workspace root: /Users/username/Projects/pdf-validator

[1/8] Checking Git status...
Git is clean: true

[2/8] Getting current branch...
Current branch: master

[3/8] Reading current version...
Current version: v1.0.0

...
```

**Крок 2:** Перекомпілюйте та перезавантажте

```bash
cd plugins/pdf-validator-vscode
npm run compile
```

Потім: `Cmd+Shift+P` → "Reload Window"

**Крок 3:** Перевірте Developer Console (для глибшої діагностики)

```bash
# Відкрийте Developer Tools в VS Code
Cmd+Shift+P → "Developer: Toggle Developer Tools"
# Перевірте Console на помилки
```

**Крок 4:** Переконайтеся, що ви у правильній workspace

- Розширення працює тільки якщо відкрито workspace з PDF Validator проектом
- Перевірте, що є `package.json` в кореневій директорії

**Крок 5:** Спробуйте викликати команду вручну

```bash
# В Command Palette
Cmd+Shift+P → "PDF Validator: Create New Version"
# Або використайте shortcut
Cmd+Shift+V V
```

## Команди плагіна

| Команда            | Hotkey          | Описання                       |
| ------------------ | --------------- | ------------------------------ |
| Create New Version | `Cmd+Shift+V V` | Створити нову версійну гілку   |
| Show Version Info  | —               | Показати інформацію про версію |

**Як працює версіювання:**

- **MAJOR/MINOR** - можна створити ТІЛЬКИ з гілки `master`
- **PATCH** - можна створити з будь-якої гілки
- Автоматичний розрахунок нової версії
- Підтвердження перед створенням
- Оновлення файлів та створення гілки

## Вимоги

- VS Code ≥ 1.80.0
- Node.js ≥ 18.0.0
- Git ≥ 2.30.0
- Проект має бути клонований з submodules

## Структура проекту

```
plugins/pdf-validator-vscode/
├── README.md                      # Цей файл
├── ARCHITECTURE.md                # Архітектура плагіна
├── TESTING.md                     # Тестування
├── install.sh                     # Shell скрипт для встановлення
├── verify.sh                      # Перевірка плагіна
├── docs/                          # Документація плагіна
│   ├── VERSION-COMMAND.md        # Команда версіювання
│   ├── VERSION-IMPLEMENTATION.md # Імплементація
│   └── ...
├── src/
│   ├── extension.ts              # Вхідна точка плагіна
│   ├── commands/                 # Команди
│   │   └── create-version.ts
│   └── services/                 # Сервіси
│       ├── version.service.ts    # Управління версіями
│       └── git.service.ts        # Git операції
├── dist/                         # Скомпільовані файли (генерується)
│   └── extension.js              # Головний бандл
├── package.json                  # Метаінформація розширення
└── tsconfig.json                 # TypeScript конфіг
```

## 🧪 Verification

```bash
./verify.sh  # ✅ 44 checks
```

## 📚 Документація

- [VERSION-COMMAND.md](docs/VERSION-COMMAND.md) - Детальний опис команди версіювання
- [TESTING.md](TESTING.md) - Тестування та перевірка
- [ARCHITECTURE.md](ARCHITECTURE.md) - Архітектура плагіна
- [VERSION-IMPLEMENTATION.md](docs/VERSION-IMPLEMENTATION.md) - Імплементація версіювання

---

**Версія:** 1.0.0  
**Автор:** Viktor Zhelizko  
**Ліцензія:** MIT
