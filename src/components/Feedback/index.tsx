import { Button, Typography } from '@mui/material'
import React from 'react'
import styles from './Feedback.module.css'

export const Feedback = () => {
  return (
    <div className={styles.container}>
      <Typography className={styles.feedbackText}>
        Якщо Ви знайшли баги в нашому сервісі або у Вас є пропозиції щодо його вдосконалення, будь ласка, задекларуйте
        проблему на GitHub
      </Typography>
      <div className={styles.buttonContainer}>
        <Button
          variant="contained"
          color="secondary"
          target="_blank"
          href="https://github.com/victorchei/pdf-validator/issues"
          className={styles.feedbackButton}
        >
          ДЕКЛАРУВАННЯ ПРОБЛЕМ
        </Button>
      </div>
    </div>
  )
}
