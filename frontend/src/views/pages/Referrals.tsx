import { Card } from 'react-bootstrap'
import TitleHelmet from '../../components/Common/TitleHelmet'
import { useTranslation } from 'react-i18next'
import ReferralsTable from './referrals/ReferralsTable'

export default function Referrals() {

    const { t } = useTranslation()

    

    return (
        <div>
            <TitleHelmet title={t("Referrals")} />
            <Card className="mb-4">
                <Card.Header className="py-3 pe-3 d-flex align-items-center justify-content-between">
                    <div>
                        <h4 className="fw-bold">{t("My Referrals")}</h4>
                        <p className="fs-13 text-muted mb-0">{t("All your referrals.")}</p>
                    </div>

                </Card.Header>
                <Card.Body>
                    <ReferralsTable />
                </Card.Body>
            </Card>
        </div>
    )
}
