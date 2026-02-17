import { Route, Navigate, RouteProps } from 'react-router-dom'
import { useSelector } from 'react-redux'

/**
 * Private Route forces the authorization before the route can be accessed
 * @param {*} param0
 * @returns
 */

const PrivateRoute = ({ component: Component, roles, ...rest }: any) => {
  const { isAuthenticated } = useSelector((states: {base: BaseStatuses}) => states.base)
  return (
    <Route
      {...rest}
      render={(props: RouteProps) => {
        if (!isAuthenticated) {
          return (
            <Navigate
              to={{
                pathname: '/auth/login',
              }}
            />
          )
        }
        return <Component {...props} />
      }}
    />
  )
}

export default PrivateRoute
