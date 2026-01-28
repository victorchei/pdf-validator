import { Box, Chip, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styles from './VersionSelector.module.css'

interface Version {
  id: string
  version: string
  label: string
  path: string
  branch: string
  isLatest: boolean
  deployed?: boolean
  status: 'stable' | 'beta' | 'alpha'
  releaseDate: string
}

interface VersionsData {
  versions: Version[]
  generated: string
}

export const VersionSelector: React.FC = () => {
  const [versions, setVersions] = useState<Version[]>([])
  const [currentVersion, setCurrentVersion] = useState<string>('latest')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVersions()
    detectCurrentVersion()
  }, [])

  const fetchVersions = async () => {
    try {
      const response = await fetch('/pdf-validator/versions.json')
      if (response.ok) {
        const data: VersionsData = await response.json()
        // Filter only deployed versions and show up to 10 most recent
        const deployedVersions = data.versions.filter((v: Version) => v.deployed !== false)
        const recentVersions = deployedVersions.slice(0, 10)
        setVersions(recentVersions)
      }
    } catch (error) {
      console.error('Failed to load versions:', error)
    } finally {
      setLoading(false)
    }
  }

  const detectCurrentVersion = () => {
    const path = window.location.pathname
    const match = path.match(/\/(v\d+\.\d+\.\d+)/)

    if (match) {
      setCurrentVersion(match[1])
    } else {
      setCurrentVersion('latest')
    }
  }

  const handleVersionChange = (versionId: string) => {
    const version = versions.find((v) => v.id === versionId)
    if (version) {
      window.location.href = version.path
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      stable: { label: 'Stable', color: 'success' as const },
      beta: { label: 'Beta', color: 'warning' as const },
      alpha: { label: 'Alpha', color: 'error' as const },
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.stable
  }

  if (loading || versions.length === 0) {
    return null
  }

  return (
    <Box className={styles.container}>
      <FormControl size="small" className={styles.formControl}>
        <InputLabel id="version-selector-label">Версія</InputLabel>
        <Select
          labelId="version-selector-label"
          id="version-selector"
          value={currentVersion}
          label="Версія"
          onChange={(e) => handleVersionChange(e.target.value)}
          className={styles.select}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 400,
                overflow: 'auto',
              },
            },
          }}
        >
          {versions.map((version) => (
            <MenuItem key={version.id} value={version.id}>
              <Box className={styles.menuItem}>
                <span>{version.label}</span>
                {version.isLatest && <Chip label="Latest" size="small" color="primary" className={styles.chip} />}
                {!version.isLatest && (
                  <Chip
                    label={getStatusBadge(version.status).label}
                    size="small"
                    color={getStatusBadge(version.status).color}
                    className={styles.chip}
                  />
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
