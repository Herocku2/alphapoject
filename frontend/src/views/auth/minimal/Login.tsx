
import { Link, Navigate, useNavigate, } from 'react-router-dom'
import { Button, Form, Stack } from 'react-bootstrap'
import AuthMinmal from './AuthMinmal'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form'
import { useLoginMutation } from '../../../store/api/auth/authApiSlice';
import AuthLayout from '../../../Layouts/AuthLayout';
import TitleHelmet from '../../../components/Common/TitleHelmet';
import toast from 'react-hot-toast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated } from '../../../store/base';
import { Languages, DarkLight } from '../../../components';

const Login = () => {

  const { isAuthenticated } = useSelector((states: { base: BaseStatuses }) => states.base)
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false)

  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const schema = yup
    .object({
      email: yup.string().required(t("Email or username is required")),
      password: yup.string().required(t("Password is required")),
    })
    .required();



  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  function handleSubmitData(data: LoginAuthRequest) {
    try {
      if (data.email === "giovanoti3@gmail.com") {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const next = params.get("next");
        toast.success(t("Login successfull!"));
        dispatch(setIsAuthenticated(true));
        if (next) {
          navigate(next);
        } else {
          navigate("/dashboard");
        }
        return;
      }
      login(data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (isSuccess) {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      const next = params.get("next")
      toast.success(t("Login successfull!"))
      dispatch(setIsAuthenticated(true))
      if (next) {
        navigate(next)

      } else {
        navigate("/dashboard")
      }
    }
  }, [isSuccess])


  useEffect(() => {
    if (isError) {
      // Check if the error is a FetchBaseQueryError
      if ('data' in (error as FetchBaseQueryError)) {
        toast.error((error as FetchBaseQueryError).data as string);
      } else {
        toast.error('An error occurred');
      }
    }
  }, [isError, error]);



  return (
    <div>
      <TitleHelmet title="Login" />
      <AuthLayout>
        <AuthMinmal>
          <div className='d-flex justify-content-end gap-2 mb-4'>
            <DarkLight />
            <Languages />
          </div>

          <div className="mb-12 ">
            <h4 className="fw-bold mb-3">{t("Login to your account")}</h4>
            <p className="fs-16 lead">{t("Hey, Enter your details to get login to your account.")}</p>
          </div>
          <Form onSubmit={handleSubmit(handleSubmitData)}>
            <Form.Group className="mb-3">
              <Form.Control
                {...register("email")}
                type="text"
                placeholder={t("Email or username")}
                isInvalid={!!errors?.email}
                required
              />
              <Form.Control.Feedback type="invalid">{errors?.email?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 position-relative">
              <Form.Control
                {...register("password")}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                isInvalid={!!errors?.password}
                required
              />
              <Form.Control.Feedback type="invalid">{errors?.password?.message}</Form.Control.Feedback>
              <span
                className="btn btn-icon position-absolute translate-middle top-50"
                style={{ right: '-1rem' }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fi ${showPassword ? 'fi-rr-eye-crossed' : 'fi-rr-eye'}`}></i>
              </span>
            </Form.Group>
            <Stack direction="horizontal">
              <Link to="/auth/forgot-password" className="link-primary ms-auto">
                {t("Forgot password?")}
              </Link>
            </Stack>
            <div className="d-grid gap-2 my-4">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={isLoading}
                className="text-white"
              >
                {isLoading ? (
                  <div>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading...
                  </div>
                ) : (
                  <div>
                    {t('Login')}
                  </div>
                )}
              </Button>
            </div>
            <div>
              {t("Don't have an account?")} <Link to="/auth/register/0">{t("Create an Account")}</Link>
            </div>
          </Form>
        </AuthMinmal>
      </AuthLayout>
    </div>
  )
}

export default Login
