
import TitleHelmet from '../../components/Common/TitleHelmet'
import { useTranslation } from 'react-i18next'
import { Card } from 'react-bootstrap'
import PaymentsTable from './payments/PaymentsTable'


export default function Payments() {

  const {t} = useTranslation()

  return (
    <div>
            <TitleHelmet title={t("Payments")} />
            <Card className="mb-4">
                <Card.Header className="py-3 pe-3 d-flex align-items-center justify-content-between">
                    <div>
                        <h4 className="fw-bold">{t("My Payments")}</h4>
                        <p className="fs-13 text-muted mb-0">{t("All your payments and date.")}</p>
                    </div>
                </Card.Header>
                <Card.Body>
                    <PaymentsTable />
                </Card.Body>
            </Card>
        </div>
  )
}
