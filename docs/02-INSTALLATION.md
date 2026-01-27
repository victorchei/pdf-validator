# 🔧 Інструкція встановлення

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
# Клонуємо проект з GitHub
git clone https://github.com/victorchei/pdf-validator.git

# Переходимо в папку проекту
cd pdf-validator
```

### Крок 2: Встановлення зовнішнього валідатора

Проект потребує модуля валідатора, який повинен бути розташований окремо:

```bash
# Переходимо в папку src
cd src

# Клонуємо репозиторій валідатора
git clone <URL-репозиторію-валідатора> validator

# Повертаємось в корінь проекту
cd ..
```

**Важливо**: Папка `validator` повинна містити код, який експортує функцію `check()` та необхідні типи.

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

- **URL**: http://localhost:3000
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
│   ├── validator/              # 🔴 ПОТРІБНО ДОДАТИ (зовнішній модуль)
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
# Переконайтесь, що папка validator існує в src/
ls -la src/validator/

# Якщо не існує, клонуйте репозиторій валідатора
cd src
git clone <URL-валідатора> validator
cd ..
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
