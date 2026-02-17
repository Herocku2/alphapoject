import { ThemeSettings, useThemeContext } from '@/common/context'

const DarkLight = () => {
  const toggleDarkMode = () => {
    if (settings.theme === 'dark') {
      updateSettings({ theme: ThemeSettings.theme.light })
    } else {
      updateSettings({ theme: ThemeSettings.theme.dark })
    }
  }

  const { settings, updateSettings } = useThemeContext()
  return (
    <div>
      <div className="header-btn" style={{ cursor: 'pointer' }}>
        <div id="light-dark-mode" onClick={toggleDarkMode} style={{
          fontSize: '24px',
          padding: '8px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}>
          {
            settings.theme === 'dark' ? (
              <i className="fi fi-rr-sun" style={{ fontSize: '24px' }}></i>
            ) : (
              <i className="dark-light-icon-toggle fi fi-rr-moon" style={{ fontSize: '24px' }} />
            )
          }

        </div>
      </div>
    </div>
  )
}

export default DarkLight
