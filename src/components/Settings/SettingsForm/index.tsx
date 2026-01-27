import { Button, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { StartConfig } from 'src/helpers/getStartConfig'
import { CheckConfig } from 'src/validator/src/types'
import { FormInput } from './FormInput'

const firstViewConfig = [
  { label: 'Мін к-сть літ. джерел', name: 'refListMinLen', type: 'number' },
  { label: 'Мін к-сть підрозділів в розділі', name: 'chapterSizeMin', type: 'number' },
  { label: 'Макс к-сть підрозділів в розділі', name: 'chapterSizeMax', type: 'number' },
  { label: 'Обовязкові висновки до підрозділу?', name: 'isChapterConclusionRequired', type: 'switch' },
  { label: 'Чи є рамка?', name: 'isFrame', type: 'switch' },
] as const

const frameFormConfig = [
  { label: 'Номер сторінки великої рамки', name: 'mainFramePageNum', type: 'number' },
  { label: 'Велика рамка поле 1 (Розробив) має бути заповненим?', name: 'maidField1', type: 'switch' },
  { label: 'Велика рамка поле 2 (Керівник) має бути заповненим?', name: 'maidField2', type: 'switch' },
  { label: 'Велика рамка поле 3 має бути заповненим?', name: 'maidField3', type: 'switch' },
  { label: 'Поле 4 має бути заповненим?', name: 'maidField4', type: 'switch' },
  { label: 'Поле 5 має бути заповненим?', name: 'maidField5', type: 'switch' },
  { label: 'Значення обовязкового поля 6 проф. код(велика рамка)', name: 'maidField6', type: 'text' },
  { label: 'Поле 7 Тип роботи має бути заповненим?', name: 'maidField7', type: 'switch' },
  { label: 'Поле 8 Арк. має бути заповненим?', name: 'maidField8', type: 'switch' },
  { label: 'Поле 9 Аркушів має бути заповненим?', name: 'maidField9', type: 'switch' },
  { label: 'Поле 10 Група має бути заповненим?', name: 'maidField10', type: 'switch' },
  { label: 'Поле 1 Розробив малої рамки Розробив має бути заповненим?', name: 'smallField1', type: 'switch' },
  { label: 'Поле 2 Керівник малої рамки Керівник має бути заповненим?', name: 'smallField2', type: 'switch' },
  { label: 'Значення обовязкового поля 3 проф. код(мала рамка)', name: 'smallField3', type: 'text' },
  { label: 'Поле малої рамки 4 Арк. має бути заповненим?', name: 'smallField4', type: 'switch' },
] as const

export const SettingsForm = ({
  startConfig,
  config,
  setConfig,
}: {
  startConfig: StartConfig
  config: StartConfig
  setConfig: React.Dispatch<React.SetStateAction<CheckConfig>>
}) => {
  const {
    refListMinLen,
    isChapterConclusionRequired,
    chapterSize: [chapterSizeMin, chapterSizeMax] = [0, 0],
    isFrame,
    frameConfig,
  } = config

  const defaultValues = {
    refListMinLen,
    isChapterConclusionRequired,
    chapterSizeMin,
    chapterSizeMax,
    isFrame,
    ...frameConfig,
  }

  const { control, handleSubmit, watch } = useForm({
    mode: 'onChange',
    defaultValues: defaultValues as Required<typeof defaultValues>,
  })

  const showFrameConfig = watch('isFrame')

  const onSubmit = async (data: typeof defaultValues) => {
    setConfig((state) => {
      return {
        ...state,
        refListMinLen: data.refListMinLen,
        isChapterConclusionRequired: data.isChapterConclusionRequired,
        chapterSize: [data.chapterSizeMin, data.chapterSizeMax],
        isFrame: data.isFrame,
        frameConfig: {
          mainFramePageNum: data.isFrame ? +data.mainFramePageNum : +startConfig.frameConfig.mainFramePageNum,
          maidField1: data.isFrame ? data.maidField1 : startConfig.frameConfig.maidField1,
          maidField2: data.isFrame ? data.maidField2 : startConfig.frameConfig.maidField2,
          maidField3: data.isFrame ? data.maidField3 : startConfig.frameConfig.maidField3,
          maidField4: data.isFrame ? data.maidField4 : startConfig.frameConfig.maidField4,
          maidField5: data.isFrame ? data.maidField5 : startConfig.frameConfig.maidField5,
          maidField6: data.isFrame ? data.maidField6 : startConfig.frameConfig.maidField6,
          maidField7: data.isFrame ? data.maidField7 : startConfig.frameConfig.maidField7,
          maidField8: data.isFrame ? data.maidField8 : startConfig.frameConfig.maidField8,
          maidField9: data.isFrame ? data.maidField9 : startConfig.frameConfig.maidField9,
          maidField10: data.isFrame ? data.maidField10 : startConfig.frameConfig.maidField10,
          smallField1: data.isFrame ? data.smallField1 : startConfig.frameConfig.smallField1,
          smallField2: data.isFrame ? data.smallField2 : startConfig.frameConfig.smallField2,
          smallField3: data.isFrame ? data.smallField3 : startConfig.frameConfig.smallField3,
          smallField4: data.isFrame ? data.smallField4 : startConfig.frameConfig.smallField4,
        },
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ position: 'sticky', zIndex: 1, top: 0, paddingTop: '16px', backgroundColor: 'var(--color-white)' }}
      >
        <Typography color="error" sx={{ textAlign: 'center', fontSize: '0.75rem' }}>
          Зразок налаштувань. Форма може бути сконфігурована будь-яким чином. На порталі університету будуть доступні
          дані студента і кафедри. Ці дані можна використовувати для автоматичного заповнення полів. Дана форма має бути
          доступна для налаштування адміністратору сайту.
        </Typography>
        <Button type="submit" variant="contained">
          Застосувати
        </Button>
      </Stack>
      <Divider sx={{ margin: '10px 0' }} />
      <Typography sx={{ textAlign: 'center', fontSize: '1.5rem', m: 2 }}>Загальні налаштування</Typography>
      <Stack direction="column" spacing="6px">
        {firstViewConfig.map((item) => (
          <FormInput key={item.name} label={item.label} name={item.name} control={control} type={item.type} />
        ))}
      </Stack>

      {showFrameConfig && (
        <>
          <Divider sx={{ margin: '10px 0' }} />
          <Typography sx={{ textAlign: 'center', fontSize: '1.5rem', m: 2 }}>Налаштування перевірки рамок</Typography>
          <Stack direction="column" spacing="6px">
            {frameFormConfig.map((item) => (
              <FormInput key={item.name} label={item.label} name={item.name} control={control} type={item.type} />
            ))}
          </Stack>
        </>
      )}
    </form>
  )
}
