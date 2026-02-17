import { useTranslation } from 'react-i18next'
import TitleHelmet from '../../components/Common/TitleHelmet'
import { Card } from 'react-bootstrap'
import DepositsForm from './deposits/DepositsForm'
import DeposistsTable from './deposits/DepositsTable'
import DepositsPage from './deposits/DepositsForm'
export default function Deposits() {

    const { t } = useTranslation()

    

    return (
        <div>
            <TitleHelmet title={t("My deposits")} />
            <Card className="mb-4">
                <Card.Header className="py-3 pe-3 d-flex align-items-center justify-content-between">
                    <div>
                        <h4 className="fw-bold">{t("My Deposits")}</h4>
                        <p className="fs-13 text-muted mb-0">{t("All your deposits.")}</p>
                    </div>
                </Card.Header>
                <Card.Body>
                    {/* <DepositsForm /> */}
                    <DepositsPage />
                    <DeposistsTable />
                </Card.Body>
            </Card>
            
        </div>
    )
}
