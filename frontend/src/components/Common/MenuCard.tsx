import { Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const MenuCard = () => {

  const {t} = useTranslation()

  return (
    <Card className="nav-card text-center mx-3 my-6">
      <Card.Body className="text-primary">
        <i
          className="fi fi-rr-rocket-lunch fs-1 mb-6 d-inline-block"
          style={{ transform: 'rotate(320deg)' }}
        ></i>
        <h6 className="fs-16 text-uppercase text-primary fw-bold mb-2">{t("Support Center")}</h6>
        <p className="fs-13 fw-lighter mb-4">
          {t("If you have a question or a request please contact us by telegram.")}
        </p>
        <a className="btn btn-primary w-100">
          Get Support
        </a>
      </Card.Body>
    </Card>
  )
}

export default MenuCard
