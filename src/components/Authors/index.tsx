import { Typography } from '@mui/material'
import React from 'react'
import { getAppVersion, getBuildDate } from 'src/helpers/getAppVersion'
import styles from './Authors.module.css'

export const Authors = () => {
  const version = getAppVersion()
  const buildDate = getBuildDate()

  return (
    <div className={styles.authors}>
      <Typography component="h3" sx={{ fontSize: '0.95rem', fontWeight: 'bold', mb: 0.5 }}>
        Основна розробка:
      </Typography>
      <Typography variant="body1" sx={{ fontSize: '0.9rem', mb: 1 }}>
        Желізко Віктор Вікторович
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>
        Автори ідеї:
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
        Желізко Віктор Вікторович, Кучерук Ольга Віталіївна
      </Typography>
      <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: '0.75rem', mt: 1 }}>
        Версія: v{version} | Дата білду: {buildDate}
      </Typography>
    </div>
  )
}
