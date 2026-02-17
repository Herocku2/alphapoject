import Logo from '../components/Common/Logo'
import { Link } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import AppMenu from './Menu'
import { useTranslation } from 'react-i18next'
import { useGetUserQuery } from '../store/api/auth/authApiSlice'
import { MenuItemTypes } from '../constants/menu'
import { useGetDashboardStadisticsQuery } from '../store/api/dashboard/useDashboardApiSlice'
import { useEffect, useState } from 'react'
import { useThemeContext } from '../common'
import { Modal, Button } from 'react-bootstrap'

const SideBarContent = ({ setMenuOpen, menuOpen }) => {

  const { t } = useTranslation()


  const MENU_ITEMS: MenuItemTypes[] = [
    //Navigation
    {
      key: 'main',
      label: t('Main'),
      isTitle: true,
    },
    {
      key: 'Admin withdrawals',
      label: t('Admin Withdrawals'),
      isTitle: false,
      icon: 'fi fi-rr-money',
      url: "/admin-withdrawals",
      onlyAdmin: true
    },
    {
      key: 'dashboard',
      label: t('Dashboard'),
      isTitle: false,
      icon: 'fi fi-rr-dashboard',
      url: "/dashboard"
    },
    // {
    //   key: 'marketplace',
    //   label: t('Marketplace'),
    //   isTitle: false,
    //   icon: 'fi fi-rr-shop',
    //   url: "https://marketplace.capitalmarket.app/",
    //   isExternal: true
    // },
    {
      key: 'deposits',
      label: t('Deposits'),
      isTitle: false,
      icon: 'fi fi-rr-sack-dollar',
      url: "/deposits"
    },
    {
      key: 'p2p',
      label: t('P2P'),
      isTitle: false,
      icon: 'fi fi-rr-arrow-upward-growth-crypto',
      url: "/p2p"
    },
    {
      key: 'withdrawals',
      label: t('Withdrawals'),
      isTitle: false,
      icon: 'fi fi-rr-bank',
      url: "/withdrawals"
    },


    {
      key: 'profile',
      label: t('Profile'),
      isTitle: false,
      icon: 'fi fi-rr-user',
      url: "/profile"
    },

    // {
    //   key: 'binarytree',
    //   label: t('My Tree'),
    //   isTitle: false,
    //   icon: 'fi fi-tr-sitemap',
    //   url: "/network-marketing"
    // },
    {
      key: 'referrals',
      label: t('Referrals'),
      isTitle: false,
      icon: 'fi fi-rr-users-alt',
      url: "/referrals"
    },
    {
      key: 'payments',
      label: t('Payments'),
      isTitle: false,
      icon: 'fi fi-rr-checklist-task-budget',
      url: "/payments"
    },
    {
      key: 'investment-all',
      label: t('Investment Panel'),
      isTitle: false,
      icon: 'fi fi-rr-newspaper',
      url: "/investment-panel"
    },


  ]

  return (
    <div>
      <AppMenu setMenuOpen={setMenuOpen} menuOpen={menuOpen} menuItems={MENU_ITEMS} />
      <div className="clearfix" />
    </div>
  )
}
const Navigation = () => {

  const { t } = useTranslation()
  const { data: user } = useGetUserQuery()
  const { data: dashboard } = useGetDashboardStadisticsQuery()
  const [menuOpen, setMenuOpen] = useState(true)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showTradingModal, setShowTradingModal] = useState(false)
  const { settings } = useThemeContext()


  useEffect(() => {
    if (settings) {
      setMenuOpen(settings.sidebar.size == "default" || settings.sidebar.size == "full")
    }
  }, [settings])

  return (
    <div>
      <aside className="leftside-menu position-fixed top-0 bottom-0 z-1040">
        <div className="navigation-header top-0 sticky-top z-1020 px-4">
          <Link to="/">
            <Logo url={!menuOpen ? "/favicon.png": ""}/>
          </Link>
        </div>
        <SimpleBar
          id="leftside-menu-container"
          data-simplebar=""
          className="my-simplebar"
          style={{ height: 'calc(100%  - 4.5rem)' }}>
          {/* Sidemenu */}
          <SideBarContent setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
          {/* Statistics Buttons */}
          {
            menuOpen && (
              <div className='px-4 mt-4'>
                <Button 
                  variant="primary" 
                  className='w-100 mb-2'
                  onClick={() => setShowReportModal(true)}
                >
                  {t("Reporte")}
                </Button>
                <Button 
                  variant="secondary" 
                  className='w-100'
                  onClick={() => setShowTradingModal(true)}
                >
                  {t("Datos Trading")}
                </Button>
              </div>
            )
          }

        </SimpleBar>
      </aside>

      {/* Report Modal */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("Reporte")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex justify-content-between border-bottom pb-2 mb-2'>
            <span>{t("Balance")}</span>
            <span>${user?.balance?.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }) || 0} USD</span>
          </div>
          <div className='d-flex justify-content-between border-bottom pb-2 mb-2'>
            <span>{t("Earnings")}</span>
            <span>${user?.utility_balance?.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }) || 0} USD</span>
          </div>
          <div className='d-flex justify-content-between border-bottom pb-2 mb-2'>
            <span>{t("Investment")}</span>
            <span>${dashboard?.investment_amount?.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }) || 0} USD</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            {t("Cerrar")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Trading Data Modal */}
      <Modal show={showTradingModal} onHide={() => setShowTradingModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("Datos de Trading")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex justify-content-between border-bottom pb-2 mb-2'>
            <span>Broker</span>
            <span>Weltrade</span>
          </div>
          <div className='d-flex justify-content-between border-bottom pb-2 mb-2'>
            <span>{t("Cuenta MT5")}</span>
            <span>12251481</span>
          </div>
          <div className='d-flex justify-content-between border-bottom pb-2 mb-2'>
            <span>{t("Contraseña")}</span>
            <span>Smart2025$$</span>
          </div>
          <div className='d-flex justify-content-between border-bottom pb-2 mb-2'>
            <span>{t("Servidor")}</span>
            <span>Weltrade Real</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTradingModal(false)}>
            {t("Cerrar")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Navigation
