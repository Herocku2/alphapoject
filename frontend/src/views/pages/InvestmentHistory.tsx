
import TitleHelmet from '../../components/Common/TitleHelmet'
import { useTranslation } from 'react-i18next'
import { Card } from 'react-bootstrap'
import InvestmentHistoryTable from './investment-history/InvestmentHistoryTable'


export default function InvestmentHistory() {

  const {t} = useTranslation()

  return (
    <div>
            <TitleHelmet title={t("Investment History")} />
            <Card className="mb-4">
                <Card.Header className="py-3 pe-3 d-flex align-items-center justify-content-between">
                    <div>
                        <h4 className="fw-bold">{t("My investments history")}</h4>
                        <p className="fs-13 text-muted mb-0">{t("All your investments registry and payment method.")}</p>
                    </div>
                </Card.Header>
                <Card.Body>
                    <InvestmentHistoryTable />
                </Card.Body>
            </Card>
        </div>
  )
}
