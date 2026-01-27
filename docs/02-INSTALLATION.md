# 🔧 Інструкція встановлення

## Версіонування проекту

Проект дотримується [Semantic Versioning](https://semver.org/lang/uk/).

**Поточна версія**: **0.2.0** (27 січня 2026)

- Версія відображається на UI у вигляді badge поруч із заголовком
- Повна історія змін: див. [CHANGELOG.md](../CHANGELOG.md)
- Версійність можна перевірити в `src/components/TopInfo/index.tsx` (константа `APP_VERSION`)

## Передумови

Перед тим як почати, переконайтесь, що у вас встановлено наступне:

### Обов'язкові вимоги

- **Node.js**: версія **≥18.0.0** ([завантажити](https://nodejs.org/))
- **npm**: версія **≥8.0.0** (йде з Node.js)
- **Git**: для клонування репозиторію ([завантажити](https://git-scm.com/))

### Перевірка версій

```bash
# Перевіряємо версії
node --version    # має бути v18.0.0 або вище
npm --version     # має бути 8.0.0 або вище
git --version     # будь-яка сучасна версія
```

## Встановлення проекту

### Крок 1: Клонування репозиторію

```bash
# Клонуємо проект з GitHub разом із submodules
git clone --recurse-submodules https://github.com/victorchei/pdf-validator.git

# Переходимо в папку проекту
cd pdf-validator
```

> **Примітка**: Прапорець `--recurse-submodules` автоматично клонує модуль валідатора (`src/validator`) з приватного репозиторію `victorchei/validator`. Для цього потрібен доступ до цього репо.

### Крок 2: Якщо клонували без `--recurse-submodules`

```bash
# Ініціалізуємо та завантажуємо submodule вручну
git submodule update --init --recursive
```

**Важливо**: Папка `src/validator` — це git submodule, який містить код з функцією `check()` та необхідні типи. Вона повинна бути заповнена перед запуском проекту.

### Крок 3: Встановлення залежностей

```bash
# Встановлюємо всі залежності npm
npm install

# Або скорочена версія
npm i
```

Це встановить всі пакети, перелічені в `package.json`:

- React та React DOM
- Material-UI компоненти
- TypeScript
- PDF.js для роботи з PDF
- React Router для навігації
- Інші утиліти

## Запуск проекту

### Режим розробки

```bash
npm start
```

- **URL**: <http://localhost:3000>
- **Автоматичне перезавантаження**: Так, при змінах в коді
- **Hot Module Replacement**: Доступно для швидкої розробки

### Виробничий білд

```bash
npm run build
```

Створює оптимізований білд в папці `build/`:

Створює оптимізований білд в папці `build/`:

- Мініфікація коду
- Оптимізація розміру
- Готово до деплою

### Тестування

```bash
npm test
```

Запускає Jest тести з покриттям:

```bash
npm test -- --coverage
```

## Структура проекту після встановлення

```
pdf-validator/
├── public/
│   └── index.html              # Головна HTML сторінка
├── src/
│   ├── components/             # React компоненти
│   │   ├── App.tsx
│   │   ├── ControlledTreeView.tsx
│   │   ├── TopInfo/
│   │   ├── Settings/
│   │   ├── Authors/
│   │   └── Feedback/
│   ├── config/                 # Конфігурації
│   │   ├── errorsConfig.ts
│   │   └── groupsConfig.ts
│   ├── helpers/                # Допоміжні функції
│   ├── style/                  # CSS стилі
│   ├── validator/              # 🔗 Git submodule (victorchei/validator)
│   └── index.tsx               # Точка входу
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions для деплою
├── package.json                # Залежності та скрипти
├── tsconfig.json               # Конфігурація TypeScript
└── docs/                        # 📚 Документація
```

## Розв'язання проблем при встановленні

### Помилка: "command not found: node"

```bash
# Перевірте встановлення Node.js
node --version

# Якщо не встановлено, завантажте з https://nodejs.org/
```

### Помилка: "npm ERR! code ERESOLVE"

```bash
# Спробуйте встановлення з флагом legacy-peer-deps
npm install --legacy-peer-deps
```

### Помилка: "Cannot find module 'src/validator'"

```bash
# Переконайтесь, що submodule ініціалізований
git submodule status

# Якщо показує '-' перед хешем — submodule не завантажений
git submodule update --init --recursive

# Перевірте що папка validator не порожня
ls -la src/validator/
```

### Помилка при запуску: "Port 3000 is already in use"

```bash
# Використовуйте інший порт
PORT=3001 npm start

# Або закрийте програму, яка займає порт 3000
```

### Чорний екран при відкритті додатку

Дайте застосунку кілька секунд на завантаження. Перевірте консоль браузера (F12) на наявність помилок.

## Встановлення для розробки з VSCode

### Рекомендовані розширення

1. **ES7+ React/Redux/React-Native snippets** — для швидкої розробки React
2. **Prettier** — форматування коду
3. **ESLint** — перевірка коду
4. **Thunder Client** або **REST Client** — для тестування API

### Налаштування VSCode

Створіть файл `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Перший запуск

Після успішного встановлення:

1. ✅ Переконайтесь, що `npm start` запустився без помилок
2. ✅ Відкрийте <http://localhost:3000> в браузері
3. ✅ Завантажте тестовий PDF файл для перевірки
4. ✅ Перевірте, що валідація працює

## Оновлення залежностей

```bash
# Перевірка застарілих пакетів
npm outdated

# Оновлення всіх пакетів до останніх версій
npm update

# Оновлення конкретного пакету
npm install package-name@latest
```

## Наступні кроки

- Читайте [Архітектуру](./03-ARCHITECTURE.md) для розуміння структури
- Ознайомтесь з [Компонентами](./04-COMPONENTS.md)
- Почніть розробку за [гайдом розробника](./07-DEVELOPMENT.md)

---

**Статус**: ✅ Актуально  
**Останнє оновлення**: Січень 2026
