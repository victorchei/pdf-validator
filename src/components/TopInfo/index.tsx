import { Box, Chip, Typography } from '@mui/material'
import React from 'react'

const APP_VERSION = '0.2.0'
const APP_DATE = '27.01.2026' // Остання версія з CHANGELOG: [0.2.0] - 2026-01-27

export const TopInfo = () => {
  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: '4rem',
            textAlign: 'center',
            m: 2,
            mb: 0,
            '@media (max-width: 900px)': {
              fontSize: '3rem',
            },
            '@media (max-width: 600px)': {
              fontSize: '2rem',
            },
          }}
        >
          Сервіс для перевірки дипломних робіт
        </Typography>
        <Chip
          label={`v${APP_VERSION}`}
          color="primary"
          variant="outlined"
          size="small"
          sx={{ height: 24, fontSize: '0.75rem' }}
        />
      </Box>
      <Typography sx={{ textAlign: 'center', fontSize: '0.85rem', color: '#666', mb: 3 }}>
        Остання версія: {APP_DATE}
      </Typography>
      <Typography sx={{ margin: '0 32px', textAlign: 'center' }}>
        Даний сервіс розроблено для валідації магістерських і бакалаврських робіт у форматі <b>ПДФ.</b>
        <br />
        Реалізовані сервіси перевірки змісту, списку літератури, посилання на літературу, технічних рамок.
        <br />
        Очікується додавання перевірки підписів до рисунків і таблиць.
      </Typography>
      <Typography sx={{ margin: '8px 32px', textAlign: 'center' }}>
        Для базової перевірки достатньо вказати кваліфікацію.
      </Typography>
    </div>
  )
}
