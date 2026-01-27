# 🆘 Розв'язання проблем (Troubleshooting)

Рішення для типових проблем, які можуть виникнути при розробці та використанні PDF Validator.

---

## 🚨 Проблеми при встановленні

### npm install падає з помилками

#### Проблема

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

#### Рішення

```bash
# Спосіб 1: Встановити з флагом legacy-peer-deps
npm install --legacy-peer-deps

# Спосіб 2: Очистити кеш та переінстальовувати
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Спосіб 3: Оновити npm до останньої версії
npm install -g npm@latest
npm install
```

---

### "command not found: node" або "node is not installed"

#### Проблема

```
zsh: command not found: node
```

#### Рішення

```bash
# Перевірити встановлення
node --version
npm --version

# Якщо не встановлено:
# Завантажити з https://nodejs.org/
# Вибрати LTS версію (v18+)

# Або встановити через Homebrew (macOS)
brew install node

# Або через package manager (Linux)
sudo apt-get install nodejs npm
```

---

### "Cannot find module 'src/validator'"

#### Проблема

```
Cannot find module 'src/validator' or its corresponding type declarations.
```

#### Рішення

```bash
# 1. Перевірити, чи існує папка
ls -la src/validator/

# 2. Клонувати репозиторій валідатора
cd src
git clone <URL-репозиторію-валідатора> validator
cd ..

# 3. Перевірити структуру
src/validator/
├── src/
│   ├── types.ts
│   ├── config/
│   └── ...
└── package.json
```

---

## ⚠️ Проблеми при запуску

### "Port 3000 is already in use"

#### Проблема

```
Something is already running on port 3000
```

#### Рішення

```bash
# Спосіб 1: Знайти та закрити процес
lsof -i :3000
kill -9 <PID>

# Спосіб 2: Запустити на іншому порту
PORT=3001 npm start
# або
PORT=8080 npm start

# Спосіб 3: Перезапустити ПК (ядерний варіант)
```

---

### "TypeError: Cannot read property 'files' of undefined"

#### Проблема

```
Помилка при завантаженні файлу
```

#### Рішення

```typescript
// Перевірити обробник onChange
const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  // ✅ Правильно: перевіряємо наявність
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0]
    // ...
  }
}
```

---

### Сторінка завантажується, але через довгий час

#### Проблема

```
Додаток повільно стартує
```

#### Рішення

```bash
# 1. Перевірити розмір bundle
npm run build
# Дивіться розмір build/static/

# 2. Перевірити, що немає важких імпортів на верхньому рівні
// ❌ Неправильно
import { heavyLibrary } from 'heavy-lib'

// ✅ Правильно (lazy loading)
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))

# 3. Включити code splitting
# Це вже сконфігурено в react-scripts
```

---

## 🐛 Проблеми з валідацією PDF

### "PDF files not being validated"

#### Проблема

```
Файл завантажується, але валідація не запускається
```

#### Рішення

```typescript
// Перевірити, що check функція експортується з validator
import { check } from 'src/validator'

// Перевірити структуру config
console.log('Config:', config)

// Перевірити, що FileReader читає корректно
const validate = async (...) => {
  console.log('File data size:', newFileData.byteLength)
  const data = await check(newFileData, newConfig)
  console.log('Validation result:', data)
}
```

---

### "All PDFs show validation errors"

#### Проблема

```
Навіть коректні PDF-ки показують помилки
```

#### Рішення

```bash
# 1. Перевірити версію PDF.js
npm list pdfjs-dist
# Повинна бути 3.11.174+

# 2. Перевірити, що worker завантажується
# Chrome DevTools → Network → ищите pdf.worker.js
# Повинен бути 200 status

# 3. Перевірити GlobalWorkerOptions
// В App.tsx
GlobalWorkerOptions.workerSrc =
  '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js'
```

---

## 🎨 Проблеми з UI/Стилізацією

### "Стилі не завантажуються правильно"

#### Проблема

```
MUI компоненти не мають стилів
```

#### Рішення

```typescript
// Перевірити, що Material-UI встановлена
npm list @mui/material

// Перевірити імпорти в App.tsx
import { Stack, Button } from '@mui/material'

// Перевірити, що global styles імпортовані
import '../style/index.css'

// Перевірити, що CSS файл існує
ls -la src/style/index.css
```

---

### "Темна тема не працює"

#### Проблема

```
Тема не змінюється при натисканні на switch
```

#### Рішення

```typescript
// Перевірити, що тема передається в компоненти
// (якщо реалізована)
const [isDark, setIsDark] = useState(false)

// Перевірити ThemeProvider
import { ThemeProvider, createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
  },
})

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

---

## 🔐 Проблеми з Git/GitHub

### "Permission denied (publickey)"

#### Проблема

```
fatal: Could not read from remote repository.
```

#### Рішення

```bash
# 1. Перевірити SSH ключ
ssh -T git@github.com

# 2. Генерувати новий SSH ключ
ssh-keygen -t ed25519 -C "your@email.com"

# 3. Додати ключ в GitHub
# GitHub Settings → SSH and GPG keys → New SSH key

# 4. Або використовувати HTTPS замість SSH
# git clone https://github.com/victorchei/pdf-validator.git
# замість
# git clone git@github.com:victorchei/pdf-validator.git
```

---

### "branch 'master' set up to track 'origin/develop'"

#### Проблема

```
Ви на develop гілці замість master
```

#### Рішення

```bash
# Правильна гілка для роботи - develop
git checkout develop
git pull origin develop

# Лише merge в master для деплою
git checkout master
git merge develop
git push origin master
```

---

### GitHub Actions workflow падає

#### Проблема

```
Workflow завершується з помилкою
```

#### Рішення

```bash
# 1. Перевірити логи
# GitHub → Actions → вибрати workflow → view logs

# 2. Типові причини:
# - npm install падає → перевірити залежності
# - npm run build падає → перевірити код на помилки
# - Deploy падає → перевірити gh-pages налаштування

# 3. Локально повторити步步
npm ci
npm run build

# 4. Перевірити gh-pages гілка
git branch -a | grep gh-pages
```

---

## TypeScript помилки

### "Type 'X' is not assignable to type 'Y'"

#### Проблема

```
TypeScript компайл помилка
```

#### Рішення

```typescript
// Перевірити типи
const myVar: MyType = value // ❌ Тип не збігається

// Привести до правильного типу
const myVar: MyType = value as MyType // Тимчасово

// Або правильно задати тип
const myVar = value as unknown as MyType // Краще
```

---

### "React.FC is deprecated"

#### Проблема

```
Warning: React.FC is deprecated
```

#### Рішення

```typescript
// ❌ Старий спосіб
export const MyComponent: React.FC<Props> = ({ prop }) => {}

// ✅ Новий спосіб (React 18+)
interface Props {
  prop: string
}

export const MyComponent = ({ prop }: Props) => {}
```

---

## 💾 Проблеми з браузером

### "Offline mode - No webpack compiled successfully"

#### Проблема

```
Додаток перестав працювати після перезавантаження
```

#### Рішення

```bash
# 1. Очистити кеш браузера
# Chrome: Ctrl+Shift+Delete

# 2. Жорстко перезавантажити
# Chrome: Ctrl+Shift+R (Cmd+Shift+R на Mac)

# 3. Очистити LocalStorage (якщо використовується)
// F12 → Console
localStorage.clear()
sessionStorage.clear()
```

---

### "Blank white screen"

#### Проблема

```
Додаток запускається, але показує білий екран
```

#### Рішення

```bash
# 1. Перевірити консоль браузера
# F12 → Console tab

# 2. Типові помилки:
# - ReferenceError: X is not defined
# - Cannot find module
# - Network error при завантаженні ресурсу

# 3. Перевірити логи
# F12 → Console → дивіться помилки

# 4. Перевірити Network tab
# F12 → Network → шукайте 404 помилки

# 5. Перезавантажити:
npm start
```

---

## 📱 Мобільні проблеми

### "Додаток не працює на мобільному"

#### Рішення

```bash
# 1. Тестувати мобільне локально
npm start

# 2. Відкрити в браузері
# Desktop: http://localhost:3000
# Mobile: http://<your-ip>:3000
# (замініть <your-ip> на вашу IP)

# 3. Перевірити viewport
<meta name="viewport"
      content="width=device-width, initial-scale=1" />

# 4. Тестувати в Chrome DevTools
# F12 → Toggle device toolbar (Ctrl+Shift+M)
```

---

## 📊 Проблеми з продуктивністю

### "Додаток работает повільно"

#### Рішення

```bash
# 1. Вимірювання продуктивності
npm run build
npx lighthouse http://localhost:3000

# 2. Перевірити розмір bundle
npm run build
# Дивіться build/static/js

# 3. Оптимізація:
# - Видаліти невиконувані пакети
npm uninstall unused-package

# - Lazy loading компонентів
const HeavyComponent = React.lazy(() =>
  import('./HeavyComponent')
)

# - Мемоізування компонентів
export default React.memo(MyComponent)

# 4. Аналізувати bundle
npx bundle-analyzer
```

---

## 🔗 Корисні ресурси

### Офіційна документація

- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Material-UI**: https://mui.com/
- **PDF.js**: https://mozilla.github.io/pdf.js/

### Комунітет

- **Stack Overflow**: https://stackoverflow.com/questions/tagged/reactjs
- **GitHub Discussions**: https://github.com/victorchei/pdf-validator/discussions
- **React GitHub Issues**: https://github.com/facebook/react/issues

### Інструменти

- **Chrome DevTools**: F12 в браузері
- **VS Code Debugger**: https://code.visualstudio.com/docs/editor/debugging
- **React DevTools**: https://react.dev/learn/react-developer-tools

---

## 📝 Як отримати допомогу

Якщо проблема не розв'язана:

1. **Перевірте документацію** → див. інші файли в `/docs`
2. **Пошукайте в Google** → перший результат часто має рішення
3. **Перевірте GitHub Issues** → можливо, це вже було
4. **Задайте питання** → GitHub Discussions або Issues
5. **Залишите коментар** → в pull request або issue

---

**Статус**: ✅ Актуально  
**Останнє оновлення**: Січень 2026
