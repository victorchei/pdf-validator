export const logger = {
  info: (message: string) => {
    console.log(`[PDF Validator] ℹ️  ${message}`)
  },

  success: (message: string) => {
    console.log(`[PDF Validator] ✅ ${message}`)
  },

  warning: (message: string) => {
    console.log(`[PDF Validator] ⚠️  ${message}`)
  },

  error: (message: string) => {
    console.error(`[PDF Validator] ❌ ${message}`)
  },

  debug: (message: string) => {
    console.debug(`[PDF Validator] 🔧 ${message}`)
  },
}
