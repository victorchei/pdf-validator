import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import React from 'react'
import { groupsConfig } from 'src/config/groupsConfig'
import { StartConfig, getStartConfig } from 'src/helpers/getStartConfig'
import styles from './Settings.module.css'
import { SettingsForm } from './SettingsForm'

export const Settings = ({
  config,
  setConfig,
  isMasterDefault,
}: {
  isMasterDefault: boolean
  config: StartConfig
  setConfig: React.Dispatch<React.SetStateAction<StartConfig>>
}) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(isMasterDefault)
  const [groupName, setGroupName] = React.useState(groupsConfig[0])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const setConfigHandler = (config: StartConfig) => {
    setConfig(config)
    handleClose()
  }

  const onToggleQualification = (isMaster: boolean) => {
    setConfig(getStartConfig(isMaster, groupName))
    setValue(isMaster)
  }

  const onGroupSelect = (event: SelectChangeEvent) => {
    setGroupName(event.target.value as string)
  }

  return (
    <div>
      <Typography
        sx={{
          margin: { xs: '0 8px', sm: '0 16px' },
          textAlign: 'center',
          fontSize: { xs: '0.75rem', sm: '0.85rem' },
        }}
        color="error"
      >
        Для більш гнучкого встановлення вимог до перевірки натисніть{' '}
        <button type="button" onClick={handleOpen} className={styles.settingsLink}>
          Налаштування перевірки
        </button>
      </Typography>
      <Typography
        sx={{
          margin: { xs: '8px 8px 0', sm: '12px 16px 0' },
          textAlign: 'center',
          fontSize: { xs: '0.75rem', sm: '0.85rem' },
        }}
      >
        <span>Виберіть кваліфікацію: </span>
        <span className={styles.qualificationToggle}>
          <button
            type="button"
            className={`${styles.qualificationOption} ${!value ? styles.qualificationOptionActive : ''}`}
            onClick={() => onToggleQualification(false)}
          >
            Бакалавр
          </button>
          <button
            type="button"
            className={`${styles.qualificationOption} ${value ? styles.qualificationOptionActive : ''}`}
            onClick={() => onToggleQualification(true)}
          >
            Магістр
          </button>
        </span>
      </Typography>
      <Typography
        component="label"
        sx={{
          margin: { xs: '8px', sm: '12px' },
          textAlign: 'center',
          display: 'block',
          fontSize: { xs: '0.75rem', sm: '0.85rem' },
        }}
      >
        Виберіть групу:{' '}
        <Select
          size="small"
          value={groupName}
          onChange={onGroupSelect}
          sx={{
            background: 'background.paper',
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
          }}
        >
          {groupsConfig.map((name) => (
            <MenuItem key={name} value={name} sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </Typography>

      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className={styles.modal}>
            <SettingsForm startConfig={getStartConfig(value, groupName)} config={config} setConfig={setConfigHandler} />
          </div>
        </Modal>
      )}
    </div>
  )
}
