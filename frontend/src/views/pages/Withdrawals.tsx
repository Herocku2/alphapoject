import { useTranslation } from 'react-i18next'
import TitleHelmet from '../../components/Common/TitleHelmet'
import { Card } from 'react-bootstrap'
import WithdrawalsTable from './withdrawals/WithdrawalsTable'
import WithdrawalForm from './withdrawals/WithdrawalForm'

export default function Withdrawals() {

    const { t } = useTranslation()

    

    return (
        <div>
            <TitleHelmet title={t("My investment")} />
            <Card className="mb-4">
                <Card.Header className="py-3 pe-3 d-flex align-items-center justify-content-between">
                    <div>
                        <h4 className="fw-bold">{t("My Withdrawals")}</h4>
                        <p className="fs-13 text-muted mb-0">{t("All your withdrawals.")}</p>
                    </div>
                </Card.Header>
                <Card.Body>
                    <WithdrawalForm />
                    <WithdrawalsTable />
                </Card.Body>
            </Card>
        </div>
    )
}
