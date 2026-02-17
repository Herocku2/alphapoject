import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// All layouts containers
import DefaultLayout from '../Layouts/Default'
import VerticalLayout from '../Layouts/Vertical'
import HorizontalLayout from '../Layouts/Horizontal'

import { authProtectedFlattenRoutes, publicProtectedFlattenRoutes } from './index'
import { ThemeSettings, useThemeContext } from '../common/context'
import { useSelector } from 'react-redux'
interface IRoutesProps {}

const ThemeRoutes = (props: IRoutesProps) => {
  const { settings } = useThemeContext()

  const Layout =
    settings.layout.type === ThemeSettings.layout.type.vertical ? VerticalLayout : HorizontalLayout
  const { isAuthenticated } = useSelector((states : {base: BaseStatuses}) => states.base)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if(location.pathname == "/"){
      navigate("/auth/login")
    }
  }, [location])
  

  return (
    <div>
      <Routes>
        <Route>
          {publicProtectedFlattenRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<DefaultLayout {...props}>{route.element}</DefaultLayout>}
              key={idx}
            />
          ))}
        </Route>

        <Route>
          {authProtectedFlattenRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                isAuthenticated === false ? (
                  <Navigate
                    to={{
                      pathname: '/auth/login/',
                      search: 'next=' + route.path,
                    }}
                  />
                ) : (
                  <Layout {...props}>{route.element}</Layout>
                )
              }
              key={idx}
            />
          ))}
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </div>
  )
}

export default ThemeRoutes
