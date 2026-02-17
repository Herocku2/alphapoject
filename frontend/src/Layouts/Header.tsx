
import { useViewport } from '../hooks'
import { useState } from 'react'
import MegaMenu from './MegaMenu'
import { ThemeSettings, useThemeContext } from '../common'
import { DarkLight, Languages, Profile, useThemeCustomizer } from '../components'

type HeaderProps = {
  toggleMenu?: () => void
  navOpen?: boolean
}

const Header = ({ toggleMenu, navOpen }: HeaderProps) => {
  const { width } = useViewport()
  const { sidenavType } = useThemeCustomizer()
  const { updateSidebar } = useThemeContext()


  const handleLeftMenuCallBack = () => {
    if (width < 768) {
      if (sidenavType === 'full') {
        showLeftSideBarBackdrop()
        document.getElementsByTagName('html')[0].classList.add('sidebar-enable')
      } else {
        updateSidebar({ size: ThemeSettings.sidebar.size.full })
      }
    } else if (sidenavType === 'iconbar') {
      updateSidebar({ size: ThemeSettings.sidebar.size.default })
    } else if (sidenavType === 'full') {
      showLeftSideBarBackdrop()
      document.getElementsByTagName('html')[0].classList.add('sidebar-enable')
    } else if (sidenavType === 'fullscreen') {
      updateSidebar({ size: ThemeSettings.sidebar.size.default })
      document.getElementsByTagName('html')[0].classList.add('sidebar-enable')
    } else {
      updateSidebar({ size: ThemeSettings.sidebar.size.iconbar })
    }
  }

  function showLeftSideBarBackdrop() {
    const backdrop = document.createElement('div')
    backdrop.id = 'custom-backdrop'
    backdrop.className = 'offcanvas-backdrop fade show'
    document.body.appendChild(backdrop)

    backdrop.addEventListener('click', function () {
      document.getElementsByTagName('html')[0].classList.remove('sidebar-enable')
      hideLeftSideBarBackdrop()
    })
  }

  function hideLeftSideBarBackdrop() {
    const backdrop = document.getElementById('custom-backdrop')
    if (backdrop) {
      document.body.removeChild(backdrop)
      document.body.style.removeProperty('overflow')
    }
  }

  return (
    <div>
      <header className="header-navbar">
        <div className="header-inner px-2 px-md-3">
          {/* header-left */}
          <div className="header-left d-flex align-items-center">
            
            <div className="button-toggle-menu">
              <button className="header-btn" onClick={handleLeftMenuCallBack}>
                <i className="fi fi-rr-menu-burger"></i>
              </button>
            </div>
            <button
              className={`navbar-toggle ${navOpen ? 'open' : ''}`}
              data-bs-toggle="collapse"
              data-bs-target="#topnav-menu-content"
              onClick={toggleMenu}
            >
              <div className="lines">
                <span />
                <span />
                <span />
              </div>
            </button>
            <MegaMenu />
          </div>
          {/* header-right */}
          <div className="header-right d-flex align-items-center justify-content-center">
            {/* <Search /> */}
            <DarkLight />
            <Languages />
            {/* <span className="d-none d-sm-flex">
              <Activity />
              <Helpdesk />
              <Applications />
            </span> */}
            {/* <Notifications /> */}
            <Profile />
           
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header
