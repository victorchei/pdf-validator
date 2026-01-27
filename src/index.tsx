import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App'
import { theme } from './theme'

const container = document.getElementById('root') as HTMLElement

const root = createRoot(container)

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/pdf-validator">
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
