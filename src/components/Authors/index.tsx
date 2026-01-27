import { Typography } from '@mui/material'
import React from 'react'
import { getAppVersion, getBuildDate } from 'src/helpers/getAppVersion'
import styles from './Authors.module.css'

export const Authors = () => {
  const version = getAppVersion()
  const buildDate = getBuildDate()

  return (
    <div className={styles.authors}>
      <div className={styles.authorColumn}>
        <Typography component="h3" className={styles.heading}>
          Основна розробка:
        </Typography>
        <Typography variant="body1" className={styles.name}>
          Желізко Віктор Вікторович
        </Typography>
        <Typography variant="body2" className={styles.version}>
          Версія: v{version} | Дата білду: {buildDate}
        </Typography>
      </div>
      <div className={styles.authorColumn}>
        <Typography component="h3" className={styles.heading}>
          Автори ідеї:
        </Typography>
        <Typography variant="body2" className={styles.secondary}>
          Желізко Віктор Вікторович, Кучерук Ольга Віталіївна
        </Typography>
      </div>
    </div>
  )
}
