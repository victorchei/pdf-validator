import { createTheme } from '@mui/material/styles'
import { brandTokens } from './brandTokens'

export const theme = createTheme({
  palette: {
    primary: { main: brandTokens.primary.blue },
    secondary: { main: brandTokens.primary.green },
    error: { main: brandTokens.accent.red },
    warning: { main: brandTokens.accent.orange },
    text: { primary: brandTokens.neutral.text },
    background: {
      default: brandTokens.neutral.white,
      paper: brandTokens.neutral.white,
    },
  },
  typography: {
    fontFamily: brandTokens.font.family,
    fontWeightRegular: brandTokens.font.weightRegular,
    fontWeightBold: brandTokens.font.weightBold,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: brandTokens.primary.blue,
          '&:hover': { backgroundColor: brandTokens.neutral.darkBlue },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': { color: brandTokens.primary.green },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: brandTokens.primary.green,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlinedPrimary: {
          borderColor: brandTokens.primary.blue,
          color: brandTokens.primary.blue,
        },
      },
    },
  },
})
