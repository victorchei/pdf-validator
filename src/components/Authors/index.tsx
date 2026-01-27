import { Typography } from '@mui/material'
import React from 'react'

const LAST_VERSION = '0.2.0'
const LAST_UPDATE = '27.01.2026'

export const Authors = () => {
  return (
    <div className="authors" style={{ margin: 'auto 50px 50px 50px' }}>
      <Typography component="h3">Автори:</Typography>
      <Typography variant="body1">Желізко Віктор Вікторович</Typography>
      <Typography variant="body1">Кучерук Ольга Віталіївна</Typography>
      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
        Версія від: {LAST_UPDATE} (v{LAST_VERSION})
      </Typography>
    </div>
  )
}
