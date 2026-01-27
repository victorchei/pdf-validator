# ⭐ Best Practices

Рекомендації та найкращі практики для розробки на React + TypeScript.

---

## 🎯 Принципи розробки

### 1. DRY (Don't Repeat Yourself)

❌ **Неправильно** (повторений код):

```typescript
// Component1.tsx
const formatError = (error: string) => error.toUpperCase()

// Component2.tsx
const formatError = (error: string) => error.toUpperCase()
```

✅ **Правильно** (вилучити в helper):

```typescript
// helpers/formatters.ts
export const formatError = (error: string) => error.toUpperCase()

// Component1.tsx, Component2.tsx
import { formatError } from 'src/helpers/formatters'
```

### 2. SOLID принципи

#### Single Responsibility

```typescript
// ✅ Кожен компонент має одну відповідальність
export const SettingsForm = ({ onSubmit }: Props) => {
  // Тільки форма
}

export const Settings = ({ config, setConfig }: Props) => {
  // Тільки управління налаштуваннями
}
```

#### Open/Closed

```typescript
// ✅ Розширяйте, не змінюйте
interface BaseProps {
  label: string
  value: any
}

interface SelectProps extends BaseProps {
  options: string[]
}

export const FormInput = (props: BaseProps | SelectProps) => {}
```

---

## 📝 TypeScript Best Practices

### 1. Використовуйте точні типи

❌ **Неправильно**:

```typescript
const handle = (data: any) => {
  console.log(data.name) // any дозволить все
}
```

✅ **Правильно**:

```typescript
interface User {
  name: string
  age: number
}

const handle = (data: User) => {
  console.log(data.name) // ✓ Типобезпечно
}
```

### 2. Типізуйте все

❌ **Неправильно**:

```typescript
const add = (a, b) => a + b

const result = add('5', 3) // Може повернути "53"!
```

✅ **Правильно**:

```typescript
const add = (a: number, b: number): number => a + b

const result = add('5', 3) // ❌ TypeScript помилка
```

### 3. Використовуйте union типи замість any

❌ **Неправильно**:

```typescript
const value: any = 'hello'
value.toUpperCase() // Може упасти якщо це число
```

✅ **Правильно**:

```typescript
const value: string | number = 'hello'

if (typeof value === 'string') {
  value.toUpperCase() // ✓ Безпечно
}
```

### 4. Дефініуйте типи в окремих файлах

```typescript
// types.ts
export interface User {
  id: string
  name: string
  email: string
}

// components/UserCard.tsx
import { User } from 'src/types'

export const UserCard = ({ user }: { user: User }) => {}
```

---

## ⚛️ React Best Practices

### 1. Мемоізуйте компоненти, які часто перезаходять

✅ **Правильно**:

```typescript
// Якщо компонент отримує те ж props, не перезаходить
export const HeavyComponent = React.memo(({ data }: Props) => {
  return <div>{data.name}</div>
})
```

### 2. Користуйте useCallback для функцій

❌ **Неправильно**:

```typescript
const Parent = () => {
  const [count, setCount] = useState(0)

  // Нова функція при кожному рендерингу
  const handleClick = () => setCount(c => c + 1)

  // Child буде перезаходити кожного разу!
  return <Child onClick={handleClick} />
}
```

✅ **Правильно**:

```typescript
const Parent = () => {
  const [count, setCount] = useState(0)

  // Функція мемоізуватиметься
  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, [])  // Порожній масив = незмінна функція

  return <Child onClick={handleClick} />
}
```

### 3. Користуйте useMemo для важких обчислень

```typescript
const Component = ({ items }: Props) => {
  // Обчислення відбуватиметься тільки при зміні items
  const sorted = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name))
  }, [items])

  return <div>{sorted.map(item => <Item key={item.id} item={item} />)}</div>
}
```

### 4. Правильно управляйте побічними ефектами

❌ **Неправильно** (infinite loop):

```typescript
const Component = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/data').then(setData)
    // Залежність не вказана!
    // fetchData викличеться при кожному рендеринку
  })
}
```

✅ **Правильно**:

```typescript
const Component = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    let mounted = true // Запобігти утікам пам'яті

    fetch('/api/data').then((res) => {
      if (mounted) setData(res)
    })

    return () => {
      mounted = false // Cleanup функція
    }
  }, []) // Виконати один раз при монтуванні
}
```

### 5. Не змінюйте стан напряму

❌ **Неправильно** (mutation):

```typescript
const [user, setUser] = useState({ name: 'John', age: 30 })

user.age = 31 // ❌ Це неправильно!
setUser(user)
```

✅ **Правильно** (create new object):

```typescript
const [user, setUser] = useState({ name: 'John', age: 30 })

setUser({ ...user, age: 31 }) // ✓ Новий об'єкт
```

---

## 🔧 Код та структура

### 1. Назвіть змінні та функції правильно

```typescript
// ❌ Погані назви
const d = new Date()
const process = (x) => x * 2
const u = getUserData()

// ✅ Хороші назви
const currentDate = new Date()
const double = (number) => number * 2
const userData = getUserData()
```

### 2. Максимальна довжина функції

✅ **Правильно** (функція 20-30 рядків):

```typescript
const validatePDF = async (file: File, config: Config) => {
  // Max 20-30 рядків кода
  // Якщо більше - вилучити в окремі функції
}
```

❌ **Неправильно** (функція 200+ рядків):

```typescript
const processEverything = async (...) => {
  // 200+ рядків кода
  // Дуже складно для розуміння та тестування
}
```

### 3. Максимум 3 рівнів вкладеності

❌ **Неправильно** (4+ рівні):

```typescript
if (user) {
  if (user.profile) {
    if (user.profile.settings) {
      if (user.profile.settings.notifications) {
        // Занадто вкладено!
      }
    }
  }
}
```

✅ **Правильно** (ранній return):

```typescript
if (!user) return
if (!user.profile) return
if (!user.profile.settings) return

// Тільки бізнес логіка нижче
notifyUser(user.profile.settings.notifications)
```

### 4. Структура папок

```
src/
├── components/          # React компоненти
│   ├── common/         # Загальні компоненти
│   └── features/       # Компоненти функцій
├── hooks/              # Custom hooks
├── utils/              # Утиліти та helper функції
├── types/              # TypeScript типи
├── config/             # Конфігурація
├── services/           # API сервіси
├── styles/             # Глобальні стилі
└── App.tsx             # Root компонент
```

---

## 🧪 Тестування

### 1. Написуйте тесты для бізнес логіки

```typescript
// ✅ Тестувати функції та hook'и
describe('formatError', () => {
  it('should uppercase error message', () => {
    expect(formatError('error')).toBe('ERROR')
  })
})

// ❌ Не тестувати деталі реалізації
describe('Component', () => {
  it('uses useState', () => {
    // Це деталь реалізації!
  })
})
```

### 2. Використовуйте AAA паттерн (Arrange-Act-Assert)

```typescript
test('calculates total correctly', () => {
  // Arrange - підготовка
  const items = [{ price: 10 }, { price: 20 }]

  // Act - виконання
  const total = calculateTotal(items)

  // Assert - перевірка
  expect(total).toBe(30)
})
```

### 3. Тестуйте граничні випадки

```typescript
describe('divide', () => {
  it('returns correct result', () => {
    expect(divide(10, 2)).toBe(5)
  })

  it('throws error on zero divisor', () => {
    expect(() => divide(10, 0)).toThrow()
  })

  it('handles negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5)
  })
})
```

---

## 🛡️ Безпека

### 1. Не передавайте sensitive дані в об'єкти вибору (query params)

❌ **Неправильно**:

```typescript
const handleSubmit = (password: string) => {
  window.location.href = `/login?password=${password}` // Хто завгодно може бачити!
}
```

✅ **Правильно**:

```typescript
const handleSubmit = (password: string) => {
  // Передавайте в body POST запиту
  fetch('/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}
```

### 2. Санітизуйте вводи користувача

```typescript
// ✅ Перевіряйте вводи
import { sanitize } from 'isomorphic-dompurify'

const userInput = "<script>alert('xss')</script>"
const safe = sanitize(userInput)
```

### 3. Не кешіруйте sensitive дані

❌ **Неправильно**:

```typescript
localStorage.setItem('password', password) // ❌ Небезпечно!
```

✅ **Правильно**:

```typescript
// Використовуйте session storage для сессії
sessionStorage.setItem('token', token)

// Або зберігайте в пам'яті
const [token, setToken] = useState('')
```

---

## ♻️ Екологічність коду

### 1. Видаляйте невиконуваний код

❌ **Неправильно**:

```typescript
// Закоментований код
// const oldFunction = () => {}

const newFunction = () => {}
```

✅ **Правильно** (Git зберіг історію):

```typescript
const newFunction = () => {}
// Git можна подивитися історію
```

### 2. Експортуйте тільки необхідне

❌ **Неправильно**:

```typescript
export const myComponent = () => {}
export const _internalHelper = () => {} // Приватні функції
```

✅ **Правильно**:

```typescript
export const myComponent = () => {}

const _internalHelper = () => {} // Приватні функції без export
```

### 3. Уникайте глобального стану

❌ **Неправильно**:

```typescript
let globalUser = null // ❌ Глобальний стан

export const setUser = (user) => {
  globalUser = user
}
```

✅ **Правильно** (React стан):

```typescript
export const useUser = () => {
  const [user, setUser] = useState(null)
  return { user, setUser }
}
```

---

## 📚 Документація

### 1. Документуйте складні функції

```typescript
/**
 * Валідує PDF файл за встановленими правилами
 *
 * @param fileData - Вміст PDF у форматі ArrayBuffer
 * @param config - Конфігурація для валідації
 * @returns Promise з результатами валідації
 * @throws Error якщо PDF невалідний
 *
 * @example
 * const result = await check(fileData, config)
 * console.log(result.frame)  // помилки рамки
 */
export async function check(fileData: ArrayBuffer, config: StartConfig): Promise<ErrorsType> {
  // ...
}
```

### 2. Використовуйте JSDoc

```typescript
/**
 * @interface
 * @property {string} name - Ім'я користувача
 * @property {number} age - Вік користувача
 */
interface User {
  name: string
  age: number
}
```

### 3. Додавайте типові приклади

```typescript
/**
 * Форматує дату в український формат
 *@example
 * const result = await check(fileData, config)
 * console.log(result.frame)  // помилки рамки
 */
export async function check(fileData: ArrayBuffer, config: StartConfig): Promise<ErrorsType> {
  // ...
}
```

### 2. Використовуйте JSDoc

```typescript
/**
 * @interface
 * @property {string} name - Ім'я користувача
 * @property {number} age - Вік користувача
 */
interface User {
  name: string
  age: number
}
```

### 3. Додавайте типові приклади

```typescript
/**
 * Форматує дату в український формат
 *
 * @example
 * formatDate(new Date('2026-01-27'))  // '27 січня 2026'
 */
export const formatDate = (date: Date): string => {}
```

---

## 🎯 Контрольний список перед commit'ом

- [ ] Код працює локально (`npm start` без помилок)
- [ ] Усі тести проходять (`npm test`)
- [ ] Немає `console.log` в коді
- [ ] Немає `any` типів без причини
- [ ] Немає `// @ts-ignore` без пояснення
- [ ] Код відформатований (`prettier`)
- [ ] Немає linting помилок (`eslint`)
- [ ] Назви змінних та функцій зрозумілі
- [ ] Складні участки документовані
- [ ] Не додано dead code

---

## 📚 Корисні ресурси

- **React Best Practices**: <https://react.dev/learn>
- **TypeScript Handbook**: <https://www.typescriptlang.org/docs/handbook/>
- **Clean Code**: <https://en.wikipedia.org/wiki/Code_smell>
- **SOLID Principles**: <https://en.wikipedia.org/wiki/SOLID>
- **Refactoring**: <https://refactoring.guru/>

---

**Статус**: ✅ Актуально  
**Останнє оновлення**: Січень 2026
