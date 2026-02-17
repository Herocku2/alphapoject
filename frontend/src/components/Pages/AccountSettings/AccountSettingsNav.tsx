import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Card, Nav } from 'react-bootstrap'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { CircularProgressbar } from 'react-circular-progressbar'
import colors from '../../../constants/colors'
import 'react-circular-progressbar/dist/styles.css'
import { useThemeContext } from '../../../common'
import { useTranslation } from 'react-i18next'

const AccountSettingsNav = () => {
  const { settings } = useThemeContext()
  const selectedColor = settings.color as keyof typeof colors
  const themeColor = colors[selectedColor] || selectedColor
  const location = useLocation()
  const navigate = useNavigate()
  
  const [activeKey, setActiveKey] = React.useState<string>(location.pathname)

  const {t} = useTranslation()

  const handleSelect = (selectedKey: string | null) => {
    if (selectedKey) {
      setActiveKey(selectedKey)
      navigate(selectedKey)
    }
  }

  interface profileType {
    label: string
    to: string
    icon: string
  }

  const AccountSettingsNavs: profileType[] = [
    {
      icon: 'fi fi-rr-user',
      label: t('Account'),
      to: '/profile',
    },
    {
      icon: 'fi fi-rr-lock',
      label: t('Security'),
      to: '/security',
    },
  ]


  return (
    <div>
      <Card className="mb-3 mb-md-4">
        <Card.Body className="py-6 d-md-flex align-items-center">
          <div className="d-flex align-items-center">
            <div
              className="position-relative flex-shrink-0 me-4"
              style={{ width: '5rem', height: '5rem' }}
            >
              <div className="position-absolute w-100 h-100 rounded-circle d-flex align-items-center justify-content-center ">
                <i className="fi fi-rr-user-gear text-primary fs-2"></i>
              </div>
              <div className="position-absolute">
                <CircularProgressbar
                  value={100}
                  styles={{
                    path: {
                      stroke: themeColor,
                      strokeWidth: '0.375rem',
                      strokeLinecap: 'round',
                    },
                    trail: {
                      stroke: '#EDEFF1',
                      strokeWidth: '0.375rem',
                    },
                    text: {
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      fill: themeColor,
                    },
                  }}
                />
              </div>
            </div>
            <div style={{ maxWidth: '280px' }}>
              <h4 className="fw-bold">{t("Account Settings")}</h4>
              <p className="fs-13 text-muted mb-0">
                {t("Set your pictures, name, bio, and others public-facing information.")}
              </p>
            </div>
          </div>

        </Card.Body>
        <PerfectScrollbar>
          <Nav
            activeKey={activeKey}
            onSelect={handleSelect}
            variant="pills"
            defaultActiveKey="/user-profile/overview"
            className="d-flex flex-row flex-nowrap flex-row px-4 py-3 border-top"
          >
            {AccountSettingsNavs.map((tab, idx) => (
              <Nav.Item key={idx}>
                <Nav.Link as={Link} to={tab.to} eventKey={tab.to} className="hstack gap-2">
                  <i className={tab.icon}></i>
                  <span>{tab.label}</span>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </PerfectScrollbar>
      </Card>
    </div>
  )
}

export default AccountSettingsNav
