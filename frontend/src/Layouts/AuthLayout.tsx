import {  Suspense, ReactNode, useEffect } from 'react'
import { PreloaderFull } from '../components/Misc/Preloader'
import { changeHTMLAttribute } from '../utils'
import { useThemeContext } from '../common'

interface AuthLayoutProps {
  children?: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {

  const { settings } = useThemeContext()


  useEffect(() => {
    changeHTMLAttribute('data-color-scheme', settings.color)
    changeHTMLAttribute('data-bs-theme', settings.theme)
    changeHTMLAttribute('data-theme-font', settings.font)
    changeHTMLAttribute('data-content-skin', settings.layout.contentSkin)
  }, [settings])

  return (
    <Suspense fallback={<PreloaderFull />}>
      <Suspense fallback={<div />}>
        <div className="wrapper">{children}</div>
      </Suspense>
    </Suspense>
  )
}

export default AuthLayout
