// Всі кольори відповідають CSS змінним у src/style/variables.css
export const brandTokens = {
  primary: {
    blue: '#224A98', // --color-primary-blue
    green: '#4CAD3B', // --color-primary-green
  },
  accent: {
    red: '#E53E23', // --color-accent-red
    orange: '#EE781C', // --color-accent-orange
  },
  neutral: {
    darkBlue: '#004D85', // --color-dark-blue
    text: '#404248', // --color-text
    link: '#0366D6', // --color-link
    white: '#FFFFFF', // --color-white
    bgLight: '#F5F7FA', // --color-bg-light
  },
  font: {
    family: "'Montserrat', Arial, sans-serif",
    weightRegular: 400,
    weightBold: 700,
  },
} as const
