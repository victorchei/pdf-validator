import { Stack } from '@mui/material'
import { GlobalWorkerOptions } from 'pdfjs-dist'
import React, { useEffect, useState } from 'react'
import { groupsConfig } from 'src/config/groupsConfig'
import { StartConfig, getStartConfig } from 'src/helpers/getStartConfig'
import { ErrorsType } from 'src/validator/src/types'
import '../style/index.css'
import { check } from '../validator'
import styles from './App.module.css'
import { Authors } from './Authors'
import ControlledTreeView from './ControlledTreeView'
import { Feedback } from './Feedback'
import { Settings } from './Settings'
import { TopInfo } from './TopInfo'
import { VersionSelector } from './VersionSelector'
GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [errorsData, setErrorsData] = useState<ErrorsType>({})
  const [dragOver, setDragOver] = useState(false)
  const isMasterDefault = true
  const [config, setConfig] = useState<StartConfig>(getStartConfig(isMasterDefault, groupsConfig[0]))
  const ref = React.useRef<HTMLInputElement>(null)

  const validateFile = async (file: File, currentConfig: StartConfig) => {
    const reader = new FileReader()
    const newFileData = await new Promise<ArrayBuffer>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as ArrayBuffer)
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })

    const { isFrame, frameConfig, ...rest } = currentConfig
    const newConfig = isFrame ? { ...rest, frameConfig } : rest

    const data = await check(newFileData, newConfig)
    setErrorsData(data)
  }

  const validate = async (inputElement: HTMLInputElement, currentConfig: StartConfig) => {
    if (inputElement.files && inputElement.files.length > 0) {
      await validateFile(inputElement.files[0], currentConfig)
    }
  }

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const inputElement = e.target as HTMLInputElement
    await validate(inputElement, config)
    setLoading(false)
  }

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type === 'application/pdf') {
      setLoading(true)
      await validateFile(file, config)
      setLoading(false)
    }
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(true)
  }

  const onDragLeave = () => {
    setDragOver(false)
  }

  useEffect(() => {
    if (ref.current) {
      validate(ref.current, config)
    }
  }, [config])

  return (
    <Stack direction="column" justifyContent="space-between" className="App">
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <div className={styles.section}>
            <TopInfo />
          </div>
          {/* Version selector moved below title for better UX */}
          <div className={styles.section}>
            <Stack direction="row" justifyContent="center" alignItems="center">
              <VersionSelector />
            </Stack>
          </div>
          {/* Old layout - VersionSelector in header caused UI issues
          <div className={styles.section}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <TopInfo />
              <VersionSelector />
            </Stack>
          </div>
          */}
          <div className={styles.section}>
            <Settings isMasterDefault={isMasterDefault} config={config} setConfig={setConfig} />
          </div>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={styles.section}
            sx={{
              mb: { xs: 1, sm: 1.5 },
              mt: { xs: 0.5, sm: 1 },
            }}
          >
            <label htmlFor="file-input" className={styles.uploadLabel}>
              Завантажте дипломну роботу у форматі ПДФ
            </label>
            <div className={styles.fileInputWrapper}>
              <input
                ref={ref}
                id="file-input"
                type="file"
                accept="application/pdf"
                onChange={onChange}
                onClick={() => {
                  if (ref.current) {
                    ref.current.value = ''
                    setErrorsData({})
                  }
                }}
              />
            </div>
            <div
              className={`${styles.dropZone} ${dragOver ? styles.dropZoneDragOver : ''}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => ref.current?.click()}
            >
              <svg className={styles.dropZoneIcon} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="4" width="40" height="56" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M20 4V0h28l8 8v-4H20z" fill="none" />
                <polyline points="36,4 36,16 48,16" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="20" y1="28" x2="44" y2="28" stroke="currentColor" strokeWidth="2" />
                <line x1="20" y1="36" x2="44" y2="36" stroke="currentColor" strokeWidth="2" />
                <line x1="20" y1="44" x2="36" y2="44" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </Stack>
          <div className={styles.section}>
            {loading ? (
              <div style={{ textAlign: 'center', fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>Loading...</div>
            ) : (
              <ControlledTreeView errorsData={errorsData} />
            )}
          </div>
          <div className={styles.section}>
            <Feedback />
          </div>
        </div>
      </div>
      <Authors />
    </Stack>
  )
}
