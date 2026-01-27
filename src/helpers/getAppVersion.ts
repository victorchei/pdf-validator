const packageJson = require('../../package.json')

export const getAppVersion = (): string => {
  return packageJson.version
}

export const getBuildDate = (): string => {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  return `${day}.${month}.${year}`
}
