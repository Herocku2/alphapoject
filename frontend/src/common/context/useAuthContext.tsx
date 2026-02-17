import { ReactNode, Suspense, useEffect, } from 'react'
import { useRefreshTokenMutation } from '../../store/api/auth/authApiSlice'
import { useDispatch } from 'react-redux'
import { setIsAuthenticated } from '../../store/base'
import { Preloader, PreloaderFull } from '../../components/Misc/Preloader'




export function AuthProvider({ children }: { children: ReactNode }) {

  const [refreshToken, { isSuccess, isLoading, isError }] = useRefreshTokenMutation()

  const dispatch = useDispatch()

  useEffect(() => {
    const refreshTokenStorage = localStorage.getItem("refresh")
    refreshToken({ refresh: refreshTokenStorage })
  }, [refreshToken])

  useEffect(() => {
    if (isSuccess) {
      dispatch(setIsAuthenticated(true))
    } else if (isError) {
      dispatch(setIsAuthenticated(false))
    }
  }, [isSuccess, dispatch, isError])


  return (
    <div>
      {isLoading ? (
        <PreloaderFull />
      ) : (
        <Suspense fallback={<Preloader />}>
          {children}
        </Suspense>
      )}
    </div>
  )
}
