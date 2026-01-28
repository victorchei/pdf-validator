#!/usr/bin/env node

/**
 * Generate versions.json file for version selector
 * This file is used by the VersionSelector component to display available versions
 */

const fs = require('fs')
const path = require('path')

// Configuration for all versions
const VERSIONS_CONFIG = [
  {
    id: 'latest',
    version: '1.0.1',
    label: 'Поточна версія (1.0.1)',
    path: '/pdf-validator/',
    branch: 'master',
    isLatest: true,
    deployed: true,
    status: 'stable',
    releaseDate: '2026-01-28',
  },
  {
    id: 'v1.0.0',
    version: '1.0.0',
    label: 'Версія 1.0.0',
    path: '/pdf-validator/v1.0.0/',
    branch: 'v1.0.0',
    isLatest: false,
    deployed: true,
    status: 'stable',
    releaseDate: '2026-01-28',
  },
  {
    id: 'v1.0.1',
    version: '1.0.1',
    label: 'Версія 1.0.1',
    path: '/pdf-validator/v1.0.1/',
    branch: 'v1.0.1',
    isLatest: false,
    deployed: true,
    status: 'stable',
    releaseDate: '2026-01-28',
    changelog: '/pdf-validator/v1.0.1/CHANGELOG.md',
  },
  {
    id: 'v0.2.0',
    version: '0.2.0',
    label: 'Версія 0.2.0 (Beta)',
    path: '/pdf-validator/v0.2.0/',
    branch: 'v0',
    isLatest: false,
    deployed: false,
    status: 'beta',
    releaseDate: '2026-01-15',
  },
]

/**
 * Generate versions.json file
 */
function generateVersionsFile() {
  const outputDir = path.join(__dirname, '..', 'public')
  const outputPath = path.join(outputDir, 'versions.json')

  // Ensure public directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Create versions object
  const versionsData = {
    versions: VERSIONS_CONFIG,
    generated: new Date().toISOString(),
  }

  // Write to file
  fs.writeFileSync(outputPath, JSON.stringify(versionsData, null, 2), 'utf8')

  console.log('✅ Generated versions.json')
  console.log(`📍 Location: ${outputPath}`)
  console.log(`📋 Versions: ${VERSIONS_CONFIG.length}`)

  VERSIONS_CONFIG.forEach((version) => {
    const badge = version.isLatest ? '🌟' : version.status === 'beta' ? '🧪' : '📦'
    console.log(`   ${badge} ${version.version} - ${version.label}`)
  })
}

// Run the generator
try {
  generateVersionsFile()
} catch (error) {
  console.error('❌ Error generating versions.json:', error)
  process.exit(1)
}
