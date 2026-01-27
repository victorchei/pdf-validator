# 🏗️ Архітектура проекту

## Огляд архітектури

PDF Validator побудований на сучасній архітектурі фронтенд-додатку з чіткою розділенням відповідальності.

```
┌─────────────────────────────────────────────────────┐
│                   User Interface                     │
│           (React Components + Material-UI)           │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              State Management                        │
│        (React Hooks + useState/useEffect)           │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              Components Layer                        │
│    (App, Settings, TreeView, Feedback, etc.)       │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              Business Logic Layer                    │
│    (check function, validation logic)               │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              PDF.js Library                          │
│         (PDF parsing and analysis)                  │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Схема структури компонентів

### Ієрархія компонентів

```
┌─────────────────────────────────────────────────────┐
│                   App (Root)                        │
│        Управління станом, логіка валідації         │
│                                                      │
│  state: [errorsData, config, loading, ref]         │
│  functions: validate(), onChange()                  │
└─────────┬───────────────────────────────────────────┘
          │
    ┌─────┴─────────────────────────────┬─────────────────┬──────────────┬──────────┐
    │                                   │                 │              │          │
    ▼                                   ▼                 ▼              ▼          ▼
┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌──────────┐  ┌─────────┐
│  TopInfo    │  │  Settings    │  │  Input      │  │TreeView  │  │Feedback │
│  (읽기)      │  │ (Форма)      │  │ (Файл)      │  │ (Дерево) │  │(Форма)  │
│             │  │              │  │             │  │ помилок  │  │         │
│ Інформація  │  │ config       │  │ ref: input  │  │          │  │ Форма   │
│ про app     │  │ isMaster     │  │ onChange    │  │errorsData│  │зворотн.│
│             │  │ setConfig    │  │             │  │          │  │зв'язку │
└─────────────┘  └──────┬───────┘  └─────────────┘  └──────────┘  └─────────┘
                        │
                        ▼
                ┌──────────────────┐
                │ SettingsForm     │
                │                  │
                │ children: props  │
                │ FormInput[]      │
                └────────┬─────────┘
                         │
                         ▼
                  ┌────────────────┐
                  │  FormInput     │
                  │ (Поле форми)   │
                  │                │
                  │ label, value   │
                  │ onChange       │
                  └────────────────┘

┌─────────────────────────────────────┐
│          Authors                    │
│     (Нижній компонент додатку)      │
│                                     │
│  Інформація про розробників        │
└─────────────────────────────────────┘
```

### Опис відповідальності кожного компонента

| Компонент              | Відповідальність                             | Props                                                     | State                             |
| ---------------------- | -------------------------------------------- | --------------------------------------------------------- | --------------------------------- |
| **App**                | Головна логіка, управління станом, валідація | -                                                         | `errorsData`, `config`, `loading` |
| **TopInfo**            | Виведення інформації про додаток             | -                                                         | -                                 |
| **Settings**           | Панель налаштувань                           | `config`, `setConfig`, `isMasterDefault`                  | `open`, `value`, `groupName`      |
| **SettingsForm**       | Контейнер форми налаштувань                  | `config`, `setConfigHandler`, `groupName`, `setGroupName` | -                                 |
| **FormInput**          | Окремий вхідний елемент форми                | `value`, `label`, `children`                              | -                                 |
| **Input**              | Завантаження файлу                           | `ref`, `onChange`, `onClick`                              | -                                 |
| **ControlledTreeView** | Дерево результатів помилок                   | `errorsData`                                              | -                                 |
| **Feedback**           | Форма для зворотного зв'язку                 | -                                                         | -                                 |
| **Authors**            | Інформація про авторів                       | -                                                         | -                                 |

---

## 📊 Схема потоку даних (Data Flow)

### Циклічний потік валідації

```
┌──────────────────────────────────────────────────────────────────────┐
│                     КОРИСТУВАЧ                                       │
│  1. Завантажує PDF файл   2. Змінює налаштування   3. Вибирає групу  │
└────────────────────┬─────────────────────────────────────────────────┘
                     │
        ┌────────────┴──────────────┬────────────────┐
        │                           │                │
        ▼                           ▼                ▼
   onChange()              setConfig()         (зміна groupName)
   (Input)                 (Settings)          (Settings)
        │                           │                │
        └───────────────┬───────────┴────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────────┐
        │      App компонент оновлює стан       │
        │                                       │
        │  setLoading(true)                    │
        │  setConfig(newConfig) чи NO CHANGE  │
        └───────────────┬───────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────────┐
        │      useEffect спостерігає config      │
        │      (залежність: [config])           │
        │                                       │
        │      validate(ref.current, config)   │
        └───────────────┬───────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────────┐
        │     Читання PDF файлу                 │
        │                                       │
        │  FileReader.readAsArrayBuffer(file)  │
        │  → Promise<ArrayBuffer>              │
        └───────────────┬───────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────────┐
        │   Валідація в модулі validator       │
        │                                       │
        │  check(newFileData, newConfig)       │
        │  → Promise<ErrorsType>               │
        │  (зовнішній модуль)                  │
        └───────────────┬───────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────────┐
        │   Оновлення стану результатів        │
        │                                       │
        │  setErrorsData(data)                 │
        │  setLoading(false)                   │
        └───────────────┬───────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────────┐
        │   Рендеринг ControlledTreeView        │
        │                                       │
        │  errorsData передаються як props     │
        │  Дерево помилок відображається       │
        └───────────────┬───────────────────────┘
                        │
                        ▼
                ┌─────────────────┐
                │  КОРИСТУВАЧ     │
                │  БАЧИТЬ         │
                │  РЕЗУЛЬТАТИ     │
                └─────────────────┘
```

---

## 🔄 Детальний Data Flow диаграма

### Вхідні та вихідні потоки компонентів

```
┌────────────────────────────────────────────────────────────────┐
│                      APP COMPONENT                             │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ STATE                                                    │ │
│  │ ├─ errorsData: ErrorsType = {}                          │ │
│  │ ├─ config: StartConfig                                  │ │
│  │ ├─ loading: boolean = false                             │ │
│  │ └─ ref: React.Ref<HTMLInputElement>                     │ │
│  └──────────────────────────────────────────────────────────┘ │
│                          │                                      │
│  ┌───────────────────────┴───────────────────────────────────┐ │
│  │ FUNCTIONS                                                 │ │
│  │ ├─ validate(inputElement, config)                        │ │
│  │ │  └─ await check(newFileData, config)                   │ │
│  │ │     → setErrorsData(data)                              │ │
│  │ └─ onChange(e: React.ChangeEvent<HTMLInputElement>)      │ │
│  │    ├─ setLoading(true)                                   │ │
│  │    ├─ validate(...)                                      │ │
│  │    └─ setLoading(false)                                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐
│  │ PROPS PASSED DOWN ───────────────────────────────────────► │
│  │                                                            │
│  │  TopInfo ← no props                                       │
│  │                                                            │
│  │  Settings ←                                               │
│  │    ├─ config: StartConfig                                │
│  │    ├─ setConfig: setState                                │
│  │    └─ isMasterDefault: boolean                           │
│  │                                                            │
│  │  Input ←                                                  │
│  │    ├─ ref: React.Ref                                     │
│  │    ├─ onChange: Function                                 │
│  │    └─ onClick: Function                                  │
│  │                                                            │
│  │  ControlledTreeView ←                                     │
│  │    └─ errorsData: ErrorsType                             │
│  │                                                            │
│  │  Feedback ← no props                                      │
│  │                                                            │
│  │  Authors ← no props                                       │
│  └────────────────────────────────────────────────────────────┘
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐
│  │ DATA FLOW UP (Callbacks) ◄──────────────────────────────── │
│  │                                                            │
│  │  Settings → setConfig(newConfig)                         │
│  │    └─ App { config } ← newConfig                         │
│  │                                                            │
│  │  Input → onChange()                                       │
│  │    └─ App { errorsData, loading } ← data                 │
│  └────────────────────────────────────────────────────────────┘
└────────────────────────────────────────────────────────────────┘
```

---

## 📈 Графік залежностей компонентів

### Залежності рендеринга

```
App
├── useEffect([config]) → validate()
├── useEffect(initial) → validate()
└── useState → errorsData, config, loading

TopInfo
└── (no dependencies)

Settings
├── useState → open, value, groupName
├── props: config, setConfig, isMasterDefault
└── triggers: setConfig() on change

SettingsForm
├── props: config, setConfigHandler, groupName, setGroupName
└── children: FormInput[]
    └── onChange → setConfigHandler()

FormInput
├── props: value, label, children
└── optional: Select children

Input
├── props: ref, onChange, onClick
└── triggers: onChange() → validate()

ControlledTreeView
├── props: errorsData
├── computed: blocks = Object.entries(errorsData).filter()
└── renders: TreeItem hierarchy

Feedback
└── (no dependencies)

Authors
└── (no dependencies)
```

---

## 🔌 Потік валідації в деталях

### Крок за кроком

```
КРОК 1: Користувач вибирає файл
┌─────────────────┐
│ <Input type="file" onChange={onChange} />
└────────┬────────┘
         │
КРОК 2: onChange тригерується
┌────────────────────────────────────────┐
│ async function onChange() {            │
│   setLoading(true)                     │
│   await validate(inputElement, config) │
│   setLoading(false)                    │
│ }                                      │
└────────┬───────────────────────────────┘
         │
КРОК 3: FileReader читає файл
┌────────────────────────────────────────┐
│ const reader = new FileReader()        │
│ reader.readAsArrayBuffer(file)         │
│ → Promise<ArrayBuffer>                 │
└────────┬───────────────────────────────┘
         │
КРОК 4: Трансформація конфігу
┌────────────────────────────────────────┐
│ const { isFrame, frameConfig, ...} =   │
│         currentConfig                  │
│ const newConfig = isFrame ?            │
│   { ...rest, frameConfig }             │
│   : rest                               │
└────────┬───────────────────────────────┘
         │
КРОК 5: Валідація (внутрішній модуль)
┌────────────────────────────────────────┐
│ const data = await check(              │
│   newFileData,                         │
│   newConfig                            │
│ )                                      │
│ → ErrorsType {                         │
│   [category]: {                        │
│     [rule]: [errors]                   │
│   }                                    │
│ }                                      │
└────────┬───────────────────────────────┘
         │
КРОК 6: Оновлення стану
┌────────────────────────────────────────┐
│ setErrorsData(data)                    │
│ → App state = { errorsData: data }     │
└────────┬───────────────────────────────┘
         │
КРОК 7: React рендер
┌────────────────────────────────────────┐
│ {loading ? (                           │
│   <div>Loading...</div>                │
│ ) : (                                  │
│   <ControlledTreeView                  │
│     errorsData={errorsData}            │
│   />                                   │
│ )}                                     │
└────────┬───────────────────────────────┘
         │
КРОК 8: Дерево помилок побудоване
┌────────────────────────────────────────┐
│ ControlledTreeView:                    │
│ blocks = Object.entries(errorsData)    │
│ blocks.map([key, value] => (           │
│   <TreeItem nodeId={key}               │
│     label={errorMapper.title[key]}     │
│   >                                    │
│     Object.entries(value).map(...)     │
│   </TreeItem>                          │
│ ))                                     │
└────────┬───────────────────────────────┘
         │
КРОК 9: Користувач бачить результати
┌─────────────────────────────────────┐
│ ✅ Дерево помилок відображено       │
└─────────────────────────────────────┘
```

---

## 🔀 Потік налаштувань

### Зміна конфігурації

```
КОРИСТУВАЧ ВЗАЄМОДІЄ З SETTINGS
            │
            ▼
┌──────────────────────────────┐
│ <Switch onChange={...}>      │
│ eller                        │
│ <Select onChange={...}>      │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Settings handleChange:               │
│  setConfig(                          │
│   getStartConfig(checked, groupName) │
│  )                                   │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ App.setConfig() → оновлює стан       │
│ config = newConfig                   │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ useEffect залежність [config]        │
│ срабатывает                          │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ validate(ref.current, newConfig)     │
│ с новыми параметрами                │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ check(fileData, newConfig)           │
│ → новые результаты валидации         │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ setErrorsData(newData)               │
│ ControlledTreeView обновляется       │
└──────────────────────────────────────┘
```

---

## 📦 Типи даних та їх трансформація

### ErrorsType структура

```
ErrorsType = {
  frame?: {
    rule0?: string[]
    rule1?: string[]
    rule2?: string[]
    ...
  },
  referenceList?: {
    rule0?: string[]
    rule1?: string[]
    ...
  },
  pagesFidelity?: {
    rule1?: string[]
    rule2?: string[]
    ...
  },
  picturesAndTables?: {
    rule0?: string[]
    ...
  },
  referenceOrder?: {
    rule1?: string[]
    ...
  },
  abbreviation?: {
    rule0?: string[]
    ...
  },
  addition?: {
    rule0?: string[]
    ...
  }
}

ПРИКЛАД РЕАЛЬНОЇ СТРУКТУРИ:
{
  frame: {
    rule0: [
      "Недостатня рамка на сторінці 1",
      "Невірна товщина лінії рамки"
    ],
    rule1: [
      "Неправильна відстань від краю"
    ]
  },
  referenceList: {
    rule4: [
      "Джерело № 5 не має розміщення"
    ]
  }
}
```

### StartConfig структура

```
StartConfig = {
  // Залежить від модуля validator
  // Встановлюється функцією getStartConfig()
  // Приклад можливих полів:
  {
    isMaster: boolean,
    frameConfig: FrameConfig | undefined,
    // ...інші налаштування валідації
  }
}
```

---

## 🎯 Висновки архітектури

✅ **Сильні сторони**:

- Чітка розділення відповідальності
- Простий потік даних (батько → діти через props)
- Локалізований стан в компонентах
- Легко тестувати

⚠️ **Можливі покращення**:

⚠️ **Можливі покращення**:

- Додати Context API для глобального стану
- Вилучити валідацію в custom hook
- Мемоізувати компоненти для оптимізації
- Додати error boundaries

---

**Статус**: ✅ Актуально  
**Останнє оновлення**: Січень 2026
