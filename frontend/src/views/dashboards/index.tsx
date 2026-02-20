import { Button, } from 'react-bootstrap'

import { useTranslation } from 'react-i18next'
import { useGetUserQuery } from '../../store/api/auth/authApiSlice'
import { useState } from 'react'
import PurchasePlanModal from '../investmentplans/Modals/PurchasePlan'
import TitleHelmet from '../../components/Common/TitleHelmet'
import { useGetDashboardStadisticsQuery } from '../../store/api/dashboard/useDashboardApiSlice'
import ButtonWithLink from '../../components/UiElements/Base/Buttons/ButtonWithLink'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export function copiarTexto(texto: string, succesMessage: string) {
  const textArea = document.createElement('textarea');
  textArea.value = texto;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  console.log('Texto copiado');
  toast.success(succesMessage)
}

const Dashboard = () => {
  const { t } = useTranslation()
  const { data: user } = useGetUserQuery()

  const { data } = useGetDashboardStadisticsQuery()

  const navigate = useNavigate()

  function copyLink() {
    copiarTexto(`https://app.smartsolution.fund/auth/register/${user?.ref_code}`, t("Link copied"))
  }

  return (
    <div className=''>
      <TitleHelmet title={t("Dashboard")} />
      <div className="row align-items-center">
        <div className="col-12 col-lg mb-4">
          <h3 className="fw-normal mb-0 text-secondary">{t("Welcome")},</h3>
          <h1>
            {user?.username}
          </h1>
          <div className='d-flex flex-row gap-5'>
            <Button onClick={() => navigate("/deposits")} variant='primary' className='px-5' style={{ width: "200px" }}>
              {t("Deposits")}

            </Button>
            <Button onClick={() => navigate("/withdrawals")} variant='danger' className='px-5' style={{ width: "200px" }}>
              {t("Withdrawals")}
            </Button>
          </div>
        </div>

        <div className="col-12 col-sm-4 col-lg-3 col-xl-2 mb-4">
          <div className="card adminuiux-card">
            <div className="card-body">
              <p className="text-secondary small mb-2">{t('Investment value')}</p>
              <h4 className="mb-3">${data?.investment_amount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }) || 0} USD</h4>
              <span className="badge badge-light text-bg-danger"><i className="me-1 bi bi-arrow-down-short" />{new Date(data?.withdrawable_date || "").toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-4 col-lg-3 col-xl-2 mb-4">
          <div className="card adminuiux-card">
            <div className="card-body">
              <p className="text-secondary small mb-2">{t('Earns')} de {new Date().toLocaleString('es', { month: 'long' })}</p>
              <h4 className="mb-3">${data?.daily_payment?.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }) || 0} USD</h4>
              <span className="badge badge-light text-bg-success"><i className="me-1 bi bi-arrow-down-short" />+{data?.daily_percentage.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}%</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-4 col-lg-3 col-xl-2 mb-4">
          <div className="card adminuiux-card">
            <div className="card-body">
              <p className="text-secondary small mb-2">{t('Total Profit')}</p>
              <h4 className="mb-3">${data?.total_profit.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }) || 0} USD</h4>
              <span className="badge badge-light text-bg-info"><i className="me-1 bi bi-arrow-down-short" />{data?.days_profit} {t("days")}</span>
            </div>
          </div>
        </div>


      </div>
      <ButtonWithLink label={t("Copy link")} link={`https://app.smartsolution.fund/auth/register/${user?.ref_code}`}
        onClick={() => copyLink()} />
      <div className='row align-items-center ' style={{ maxWidth: "500px" }}>

        <div className=" ">
          <div className="card">
            <div className="text-center  card-body">
              <div className="mb-2 ">
                <i className="fi fi-sr-users" style={{ fontSize: 64 }}></i>

              </div>
              <div>
                <h6 className="fw-semibold mb-1 fs-1">{data?.direct_users || 0}</h6>
                <p className="fs-13 fw-light text-muted mb-">{t("Direct users")}</p>
              </div>
            </div>
          </div>
          {/* <div className="col-6  mt-0">
            <div className="card">
              <div className="text-center  card-body">
                <div className="mb-2 ">
                  <i className="fi fi-sr-users-alt" style={{ fontSize: 64 }}></i>

                </div>
                <div>
                  <h6 className="fw-semibold mb-1 fs-1">{data?.indirect_users || 0}</h6>
                  <p className="fs-13 fw-light text-muted mb-3">{t("Indirect users")}</p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      {/* <PurchasePlanModal activeModal={investActive} handleCloseModal={() => setInvestActive(false)} /> */}
    </div>
  )
}

export default Dashboard
