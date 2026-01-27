# 📚 API та типи даних

Детальний опис всіх типів даних та інтерфейсів, які використовуються в проекті.

---

## 🔍 ErrorsType — Структура результатів валідації

### Визначення

```typescript
type ErrorsType = {
  [errorCategory: string]: {
    [ruleKey: string]: string[]
  }
}
```

### Опис

Основна структура для зберігання результатів валідації PDF документа. Являє собою об'єкт, де:

- **Ключ першого рівня** — категорія помилки (наприклад, `"frame"`, `"referenceList"`)
- **Ключ другого рівня** — конкретне правило помилки (наприклад, `"rule0"`, `"rule1"`)
- **Значення** — масив текстових описів конкретних помилок

### Приклад структури

```typescript
const errorsData: ErrorsType = {
  frame: {
    rule0: ['Рамка відсутня на сторінці 1', 'Рамка невірного розміру на сторінці 5'],
    rule1: ['Товщина лінії рамки = 1.5pt вместо 2pt'],
  },

  referenceList: {
    rule1: ['Кількість джерел = 10, повинно бути 15+'],
    rule3: ['Джерело № 5 без номеру в списку'],
  },

  pagesFidelity: {
    rule1: ['Розділ "Розділ 2" не знайдено в змісті'],
  },
}
```

### Коли об'єкт порожній

Якщо в PDF немає помилок, `errorsData` буде:

```typescript
const errorsData: ErrorsType = {}
```

### Перевірка на наявність помилок

```typescript
// Чи є якісь помилки взагалі?
const hasErrors = Object.keys(errorsData).length > 0

// Чи є помилки в конкретній категорії?
const hasFrameErrors = errorsData.frame && Object.keys(errorsData.frame).length > 0

// Скільки всього помилок?
const totalErrors = Object.values(errorsData).reduce((sum, rules) => {
  return sum + Object.values(rules).reduce((rulSum, errors) => rulSum + errors.length, 0)
}, 0)
```

### Ітерація через помилки

```typescript
// Перебір усіх категорій та їх помилок
Object.entries(errorsData).forEach(([category, rules]) => {
  console.log(`Категорія: ${category}`)

  Object.entries(rules).forEach(([rule, errors]) => {
    console.log(`  Правило: ${rule}`)
    errors.forEach((error) => {
      console.log(`    - ${error}`)
    })
  })
})

// Результат:
// Категорія: frame
//   Правило: rule0
//     - Рамка відсутня на сторінці 1
//   Правило: rule1
//     - Товщина лінії рамки невірна
// ...
```

---

## 🔧 StartConfig — Конфігурація валідації

### Визначення

```typescript
interface StartConfig {
  // Точна структура залежить від модуля validator
  // Але типово включає:

  isMaster?: boolean // Це магістерська чи бакалаврська робота
  isFrame?: boolean // Перевіряти рамку?
  frameConfig?: FrameConfig // Конфіг для рамки (опціонально)

  // ...інші налаштування залежно від modualю validator
  [key: string]: any
}
```

### Приклад конкретної конфігурації

```typescript
const config: StartConfig = {
  isMaster: true,

  isFrame: true,
  frameConfig: {
    width: 25, // мм
    height: 25, // мм
    thickness: 2, // pt
  },

  // Налаштування для інших типів перевірок
  checkReferences: true,
  checkContent: true,
  checkAbbreviations: true,

  // Група спеціальності (встановлюється через getStartConfig)
  groupName: 'КТ',
}
```

### Як отримати конфіг

```typescript
import { getStartConfig } from 'src/helpers/getStartConfig'

// Отримати конфіг для магістра групи КТ
const config = getStartConfig(true, 'КТ')

// Отримати конфіг для бакалавра групи ІПЗ
const config = getStartConfig(false, 'ІПЗ')
```

### FrameConfig — Конфіг рамки

```typescript
interface FrameConfig {
  width: number // Ширина рамки в mm
  height: number // Висота рамки в mm
  thickness: number // Товщина лінії в pt
  color?: string // Колір лінії (опціонально)
  // ...інші параметри рамки
}
```

---

## 📋 ERROR_TYPE — Перелік типів помилок

### Enum визначення

```typescript
enum ERROR_TYPE {
  frame = 'frame',
  referenceList = 'referenceList',
  pagesFidelity = 'pagesFidelity',
  picturesAndTables = 'picturesAndTables',
  referenceOrder = 'referenceOrder',
  abbreviation = 'abbreviation',
  addition = 'addition',
}
```

### Опис кожного типу

| Тип              | Константа                      | Опис                                      |
| ---------------- | ------------------------------ | ----------------------------------------- |
| Рамка            | `ERROR_TYPE.frame`             | Помилки в оформленні рамки документа      |
| Список джерел    | `ERROR_TYPE.referenceList`     | Помилки в бібліографічному списку         |
| Зміст            | `ERROR_TYPE.pagesFidelity`     | Помилки в таблиці розділів та змісту      |
| Підписи          | `ERROR_TYPE.picturesAndTables` | Помилки в підписах до рисунків та таблиць |
| Порядок посилань | `ERROR_TYPE.referenceOrder`    | Помилки в порядку цитування в тексті      |
| Абревіатури      | `ERROR_TYPE.abbreviation`      | Помилки в скороченнях та абревіатурах     |
| Додатки          | `ERROR_TYPE.addition`          | Помилки в оформленні додатків             |

### Використання

```typescript
import { ERROR_TYPE } from 'src/validator/src/config/enums'

// Перевірити, чи є помилки рамки
if (errorsData[ERROR_TYPE.frame]) {
  console.log('Знайдені помилки рамки')
}

// Отримати опис помилки
const description = errorMapper.title[ERROR_TYPE.referenceList]
// → 'Помилки в списку використаних джерел'
```

---

## 🔑 Ключі помилок (Error Keys)

### FRAME_ERROR_KEYS

```typescript
enum FRAME_ERROR_KEYS {
  rule0 = 'rule0', // Рамка загалом
  rule1 = 'rule1', // Розміри рамки
  rule2 = 'rule2', // Товщина ліній
  rule3 = 'rule3', // Колір лінії
  // ... інші правила
}
```

### REF_LIST_KEYS

```typescript
enum REF_LIST_KEYS {
  rule0 = 'rule0', // Назва розділу
  rule1 = 'rule1', // Кількість джерел
  rule2 = 'rule2', // Порядок джерел
  rule3 = 'rule3', // Нумерація джерел
  rule4 = 'rule4', // Обов'язкові атрибути
  rule5 = 'rule5', // Інші обов'язкові атрибути
}
```

### PAGES_FIDELITY_ERROR_KEYS

```typescript
enum PAGES_FIDELITY_ERROR_KEYS {
  rule1 = 'rule1', // Оформлення змісту
  rule2 = 'rule2', // Регістр букв
  rule3 = 'rule3', // Нумерація розділів
  // ...
}
```

### REF_ORDER_ERROR_KEYS

```typescript
enum REF_ORDER_ERROR_KEYS {
  rule1 = 'rule1', // Формат чисел
  rule2 = 'rule2', // Розділові знаки перед
  rule3 = 'rule3', // Після крапки чи коми
  rule4 = 'rule4', // Розділові знаки після
  rule5 = 'rule5', // Порядок вживання
  rule6 = 'rule6', // Джерела без посилань
}
```

### PICTURES_TABLES_ERROR_KEYS

```typescript
enum PICTURES_TABLES_ERROR_KEYS {
  rule0 = 'rule0', // Оформлення підписів
  rule1 = 'rule1', // Посилання на рисунки
  // ...
}
```

### ABBR_ERROR_KEYS

```typescript
enum ABBR_ERROR_KEYS {
  rule0 = 'rule0', // Перша згадка скорочення
  rule1 = 'rule1', // Розшифровка скорочення
  // ...
}
```

---

## 🔄 Функція check() — Основна валідаційна функція

### Сигнатура

```typescript
async function check(fileData: ArrayBuffer, config: StartConfig): Promise<ErrorsType>
```

### Параметри

| Параметр   | Тип           | Опис                                     |
| ---------- | ------------- | ---------------------------------------- |
| `fileData` | `ArrayBuffer` | Вміст PDF файлу у форматі бінарних даних |
| `config`   | `StartConfig` | Конфігурація для валідації               |

### Повернене значення

```typescript
// Promise, який розв'язується на ErrorsType
// Якщо помилок немає, повертає {}
Promise<ErrorsType>
```

### Приклад використання

```typescript
import { check } from 'src/validator'

const validatePDF = async (file: File, config: StartConfig) => {
  // 1. Читаємо файл
  const fileData = await file.arrayBuffer()

  // 2. Запускаємо валідацію
  try {
    const errors = await check(fileData, config)

    // 3. Обробляємо результати
    if (Object.keys(errors).length === 0) {
      console.log('PDF валідний! Помилок не знайдено')
    } else {
      console.log('Знайдені помилки:', errors)
    }

    return errors
  } catch (error) {
    console.error('Помилка при валідації:', error)
    throw error
  }
}
```

### Як це використовується в App

```typescript
const validate = async (inputElement: HTMLInputElement, currentConfig: StartConfig) => {
  if (inputElement.files && inputElement.files.length > 0) {
    // Читаємо файл
    const file = inputElement.files[0]
    const reader = new FileReader()

    const newFileData = await new Promise<ArrayBuffer>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as ArrayBuffer)
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })

    // Обробляємо конфіг
    const { isFrame, frameConfig, ...rest } = currentConfig
    const newConfig = isFrame ? { ...rest, frameConfig } : rest

    // Запускаємо валідацію
    const data = await check(newFileData, newConfig)
    setErrorsData(data)
  }
}
```

---

## 🎭 React Types

### React.Dispatch

```typescript
// Функція для оновлення стану
type SetState<T> = React.Dispatch<React.SetStateAction<T>>

// Приклад використання
const setConfig: SetState<StartConfig> = setConfig
```

### React.ChangeEvent

```typescript
// Подія з HTML елемента
type FileInputChange = React.ChangeEvent<HTMLInputElement>
type SelectChange = React.ChangeEvent<HTMLSelectElement>

// Використання
const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
}
```

### React.Ref

```typescript
// Посилання на DOM елемент
type InputRef = React.Ref<HTMLInputElement>

const ref = React.useRef<HTMLInputElement>(null)
```

---

## 📊 Типи даних в таблиці

| Назва              | Розташування                    | Тип         | Використання          |
| ------------------ | ------------------------------- | ----------- | --------------------- |
| `ErrorsType`       | `validator/src/types.ts`        | `type`      | Результати валідації  |
| `StartConfig`      | `validator/src/types.ts`        | `interface` | Конфіг валідації      |
| `ERROR_TYPE`       | `validator/src/config/enums.ts` | `enum`      | Категорії помилок     |
| `FRAME_ERROR_KEYS` | `validator/src/config/enums.ts` | `enum`      | Ключі помилок рамки   |
| `REF_LIST_KEYS`    | `validator/src/config/enums.ts` | `enum`      | Ключі помилок списку  |
| `*_ERROR_KEYS`     | `validator/src/config/enums.ts` | `enum`      | Ключі для інших типів |

---

## ✅ Контрольний список типизації

При роботі з типами слід пам'ятати:

- [ ] Завжди типізуйте параметри функцій
- [ ] Визначайте типи повернення функцій
- [ ] Використовуйте `interface` для об'єктів з помічніми назвами полів
- [ ] Використовуйте `type` для простих типів або об'єднань
- [ ] Додавайте `?` для опціональних полів
- [ ] Документуйте складні типи коментарями
- [ ] Перевіряйте типи перед використанням (`TypeScript strict mode`)

---

**Статус**: ✅ Актуально  
**Останнє оновлення**: Січень 2026
