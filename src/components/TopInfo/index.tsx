import { Box, Typography } from '@mui/material'
import React from 'react'
import styles from './TopInfo.module.css'

export const TopInfo = () => {
  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="h1" component="h1" className={styles.title}>
          Сервіс для перевірки дипломних робіт
        </Typography>
      </Box>

      <Typography sx={{ margin: '0 16px', textAlign: 'center', fontSize: '0.85rem', lineHeight: 1.4 }}>
        Сервіс для валідації робіт у форматі <b>ПДФ.</b> Перевірка змісту, літератури, посилань, рамок.
      </Typography>
      <Typography sx={{ margin: '4px 16px 8px', textAlign: 'center', fontSize: '0.8rem' }}>
        Для базової перевірки вкажіть кваліфікацію.
      </Typography>
    </div>
  )
}
