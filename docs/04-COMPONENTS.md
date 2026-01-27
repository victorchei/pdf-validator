# 🧩 Компоненти

Детальний опис всіх React компонентів проекту, їхня відповідальність, props та використання.

---

## 📍 App.tsx — Головний компонент

**Розташування**: `src/components/App.tsx`

### Відповідальність

Головний компонент додатку, який управляє всім станом програми та координує взаємодію всіх дочірніх компонентів.

### Стан (State)

```typescript
const [loading, setLoading] = useState(false)
const [errorsData, setErrorsData] = useState<ErrorsType>({})
const [config, setConfig] = useState<StartConfig>(getStartConfig(isMasterDefault, groupsConfig[0]))
const ref = React.useRef<HTMLInputElement>(null)
```

| Стан         | Тип           | Призначення                              |
| ------------ | ------------- | ---------------------------------------- |
| `loading`    | `boolean`     | Індикатор завантаження під час валідації |
| `errorsData` | `ErrorsType`  | Результати валідації PDF                 |
| `config`     | `StartConfig` | Поточні налаштування валідації           |
| `ref`        | `React.Ref`   | Посилання на Input елемент для файлу     |

### Методи

#### `validate(inputElement, currentConfig)`

```typescript
const validate = async (inputElement: HTMLInputElement, currentConfig: StartConfig) => {
  // 1. Отримуємо файл з input
  if (inputElement.files && inputElement.files.length > 0) {
    const file = inputElement.files[0]

    // 2. Читаємо файл як ArrayBuffer
    const reader = new FileReader()
    const newFileData = await new Promise<ArrayBuffer>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as ArrayBuffer)
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })

    // 3. Обробляємо конфіг (видаляємо isFrame якщо він є)
    const { isFrame, frameConfig, ...rest } = currentConfig
    const newConfig = isFrame ? { ...rest, frameConfig } : rest

    // 4. Викликаємо валідацію з модуля validator
    const data = await check(newFileData, newConfig)

    // 5. Оновлюємо стан з результатами
    setErrorsData(data)
  }
}
```

#### `onChange(e)`

```typescript
const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  setLoading(true)
  const inputElement = e.target as HTMLInputElement
  await validate(inputElement, config)
  setLoading(false)
}
```

### Effects

```typescript
useEffect(() => {
  if (ref.current) {
    validate(ref.current, config)
  }
}, [config])
```

**Залежності**: `[config]`  
**Ефект**: При зміні конфігурації перезапускає валідацію з поточним файлом

### Структура рендерингу

```typescript
<Stack direction="column">
  <TopInfo />
  <Settings config={config} setConfig={setConfig} />
  <Input ref={ref} onChange={onChange} />
  {loading ? <Loading /> : <ControlledTreeView errorsData={errorsData} />}
  <Feedback />
  <Authors />
</Stack>
```

---

## 📋 TopInfo.tsx

**Розташування**: `src/components/TopInfo/index.tsx`

### Відповідальність

Виведення інформаційної панелі на вершині додатку з описом функціональності.

### Props

Компонент не приймає жодних props.

### Типовий контент

- Заголовок додатку
- Опис функцій
- Інструкції для користувача

---

## ⚙️ Settings/index.tsx

**Розташування**: `src/components/Settings/index.tsx`

### Відповідальність

Панель для управління налаштуваннями валідації. Дозволяє користувачеві вибирати версію стандартів та групу спеціальності.

### Props

```typescript
interface Props {
  isMasterDefault: boolean // Версія за замовчуванням (master/graduate)
  config: StartConfig // Поточна конфігурація
  setConfig: Function // Функція для оновлення конфігу
}
```

### Стан

```typescript
const [open, setOpen] = React.useState(false) // Стан модального вікна
const [value, setValue] = React.useState(isMasterDefault) // Master/Graduate switch
const [groupName, setGroupName] = React.useState(groupsConfig[0]) // Вибрана група
```

### Методи

#### `setConfigHandler(config)`

```typescript
const setConfigHandler = (config: StartConfig) => {
  setConfig(config)
  handleClose() // Закриває модальне вікно
}
```

#### `onChangeHandler(_, checked)`

```typescript
const onChangeHandler = (_: any, checked: boolean) => {
  setConfig(getStartConfig(checked, groupName))
  setValue(checked)
}
```

#### `onSelectChange(event)`

```typescript
const onSelectChange = (event: SelectChangeEvent<string>) => {
  const newGroupName = event.target.value
  setGroupName(newGroupName)
  setConfig(getStartConfig(value, newGroupName))
}
```

### UI Елементи

1. **Кнопка для відкриття модалу** — "Відкрити налаштування"
2. **Modal вікно** з:
   - **Switch** — вибір Master/Graduate
   - **Select** — вибір групи
   - **SettingsForm** — детальні налаштування
3. **Кнопки** — Зберегти, Скасувати

---

## 📝 Settings/SettingsForm/index.tsx

**Розташування**: `src/components/Settings/SettingsForm/index.tsx`

### Відповідальність

Форма детальних налаштувань валідації. Дочірній компонент Settings.

### Props

```typescript
interface Props {
  config: StartConfig
  setConfigHandler: (config: StartConfig) => void
  groupName: string
  setGroupName: (groupName: string) => void
}
```

### Функціональність

- Виводить детальні параметри конфігурації
- Розроблена з використанням `react-hook-form`
- Валідує введені значення

### Дочірні компоненти

```
SettingsForm
├── FormInput[] (динамічна кількість)
│   ├── label
│   ├── value
│   └── onChange handler
└── Submit button
```

---

## 🎨 FormInput.tsx

**Розташування**: `src/components/Settings/SettingsForm/FormInput.tsx`

### Відповідальність

Окремий елемент форми введення з підтримкою різних типів вводу.

### Props

```typescript
interface Props {
  value: string | number
  label: string
  children?: React.ReactNode // Додаткові елементи (опціонально)
  onChange?: (value: any) => void
}
```

### Використання

```typescript
<FormInput
  value={config.someProperty}
  label="Назва параметру"
  onChange={(newValue) => handleChange(newValue)}
/>
```

---

## 📂 ControlledTreeView.tsx

**Розташування**: `src/components/ControlledTreeView.tsx`

### Відповідальність

Відображення результатів валідації в форматі ієрархічного дерева помилок.

### Props

```typescript
interface Props {
  errorsData: ErrorsType
}

type ErrorsType = {
  [errorCategory: string]: {
    [ruleKey: string]: string[]
  }
}
```

### Логіка рендерингу

```typescript
export default function ControlledTreeView({ errorsData }: Props) {
  // 1. Фільтруємо категорії, які мають помилки
  const blocks = Object.entries(errorsData).filter(([key, value]) => value)

  // 2. Рендеримо дерево
  return (
    <TreeView>
      {blocks.map(([key, value]) => (
        // Категорія помилки (рівень 1)
        <TreeItem nodeId={key} label={errorMapper.title[key]}>
          {Object.entries(value).map(([item, arr]) => (
            // Правило помилки (рівень 2)
            <TreeItem nodeId={key + item} label={errorMapper[key][item]}>
              {arr.map((error) => (
                // Конкретна помилка (рівень 3)
                <TreeItem nodeId={error} label={error} />
              ))}
            </TreeItem>
          ))}
        </TreeItem>
      ))}
    </TreeView>
  )
}
```

### Структура дерева

```
🌳 Помилки при оформленні рамки (категорія)
├── 📋 Неправильна назва (правило)
│   ├── Рамка відсутня на сторінці 1
│   └── Невірна товщина лінії
├── 📋 Неправильна відстань
│   └── Відстань від краю = 20мм вместо 25мм
│
🌳 Помилки в списку джерел
├── 📋 Кількість джерел
│   └── Джерел повинно бути 15+ вместо 10
```

---

## 💬 Feedback/index.tsx

**Розташування**: `src/components/Feedback/index.tsx`

### Відповідальність

Форма для отримання зворотного зв'язку від користувачів.

### Props

Компонент не приймає props.

### Функціональність

- Форма для введення відзивів
- Відправка зворотного зв'язку
- Контакти для зв'язку

---

## 👥 Authors/index.tsx

**Розташування**: `src/components/Authors/index.tsx`

### Відповідальність

Виведення інформації про розробників проекту.

### Props

Компонент не приймає props.

### Контент

- Імена та прізвища автора/авторів
- Дата розробки
- Контактна інформація (опціонально)

---

## 🗂️ Матриця компонент-функцій

| Компонент          | Навігація | Форми | Стан   | Props |
| ------------------ | --------- | ----- | ------ | ----- |
| App                | ❌        | ❌    | ✅✅✅ | -     |
| TopInfo            | ❌        | ❌    | ❌     | -     |
| Settings           | ❌        | ✅✅  | ✅     | 3     |
| SettingsForm       | ❌        | ✅✅  | ❌     | 4     |
| FormInput          | ❌        | ✅    | ❌     | 4     |
| Input              | ❌        | ✅    | ❌     | 3     |
| ControlledTreeView | ❌        | ❌    | ❌     | 1     |
| Feedback           | ❌        | ✅    | ❌     | -     |
| Authors            | ❌        | ❌    | ❌     | -     |

---

## 🔧 Best Practices для компонентів

### 1. PropTypes або TypeScript

✅ **Правильно** (TypeScript):

```typescript
interface Props {
  config: StartConfig
  setConfig: React.Dispatch<React.SetStateAction<StartConfig>>
}

export const MyComponent = ({ config, setConfig }: Props) => {}
```

### 2. Управління FocusΛ

✅ **Правильно** (useRef для input):

```typescript
const ref = React.useRef<HTMLInputElement>(null)
if (ref.current) {
  ref.current.value = ''
}
```

### 3. Обробка помилок

✅ **Правильно** (try-catch в async функціях):

```typescript
try {
  await validate(inputElement, config)
} catch (error) {
  console.error('Validation error:', error)
}
```

### 4. Нейминг обробників подій

✅ **Правильно**:

```typescript
const handleChange = (value: string) => {}
const handleSubmit = (e: FormEvent) => {}
const onChangeHandler = () => {}
```

### 5. Умовний рендеринг

✅ **Правильно**:

```typescript
{loading ? <LoadingSpinner /> : <ControlledTreeView />}
{errorsData && Object.keys(errorsData).length > 0 && <TreeView />}
```

---

**Статус**: ✅ Актуально  
**Останнє оновлення**: Січень 2026
