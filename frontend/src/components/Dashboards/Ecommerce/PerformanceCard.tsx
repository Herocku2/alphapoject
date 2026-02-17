// PerformanceCard.tsx

import colors from '../../../constants/colors'
import { Button, Card, Stack } from 'react-bootstrap'
import { CircularProgressbar } from 'react-circular-progressbar'
import { useThemeContext } from '../../../common'
import { useTranslation } from 'react-i18next'

const PerformanceCard = () => {
  const { settings } = useThemeContext()
  const selectedColor = settings.color as keyof typeof colors
  const themeColor = colors[selectedColor] || selectedColor

  const {t} = useTranslation()

  return (
    <Card>
      <Card.Body>
        <Stack direction="horizontal" className="justify-content-between">
          <div className="py-2">
            <h5>{t("Investment progress")}</h5>
            <p className="fs-13 text-muted text-truncate col">{t("Your current investment")}</p>
            <div className="mt-16">
              <h3 className="fs-14 text-muted mb-1">
                <span>Sales</span>
                <span className={`fs-18 fw-bold text-primary mb-2 d-inline-block`}>$5.65K</span>
              </h3>
              <Button variant="primary" className="btn-md">
                View Reports
              </Button>
            </div>
          </div>
          <CircularProgressbar
            value={60}
            text={`${60}%`}
            styles={{
              root: {
                height: '8rem',
                width: '8rem',
              },
              path: {
                stroke: themeColor,
                strokeWidth: '0.375rem',
                strokeLinecap: 'round',
              },
              trail: {
                stroke: '#EDEFF1',
                strokeWidth: '0.15rem',
              },
              text: {
                fontSize: '1rem',
                fontWeight: 'bold',
                fill: themeColor,
              },
            }}
          />
        </Stack>
      </Card.Body>
    </Card>
  )
}

export default PerformanceCard
