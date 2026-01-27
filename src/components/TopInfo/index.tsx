import { Typography } from '@mui/material'
import React from 'react'
import styles from './TopInfo.module.css'

export const TopInfo = () => {
  return (
    <div className={styles.container}>
      <Typography component="h1" className={styles.title}>
        Сервіс для перевірки дипломних робіт
      </Typography>

      <Typography className={styles.description}>
        Сервіс для валідації робіт у форматі <b>ПДФ.</b> Перевірка змісту, літератури, посилань, рамок.
      </Typography>
      <Typography className={styles.instruction}>Для базової перевірки вкажіть кваліфікацію.</Typography>
    </div>
  )
}
