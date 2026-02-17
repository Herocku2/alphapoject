import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import { toast } from 'react-hot-toast'
import AuthMinmal from './AuthMinmal'
import TitleHelmet from '../../../components/Common/TitleHelmet'
import AuthLayout from '../../../Layouts/AuthLayout'
import { useTranslation } from 'react-i18next'
import { useResetPasswordMutation, useSendOTPMutation } from '../../../store/api/auth/authApiSlice'
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from 'react-hook-form'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

const ForgotPassword = () => {
  const { t } = useTranslation()

  let schema = yup
    .object({
      email: yup.string().email(t("Invalid email")).required(t("Email is required")),
    })
    .required();

  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const [sendOTP, { isLoading, isSuccess, isError, error, data }] = useSendOTPMutation()
  const [resetPassword, { isLoading: isLoading2, isSuccess: isSuccess2, isError: isError2, error: error2, data: data2 }] = useResetPasswordMutation()

  const schema2 = yup
    .object({
      email: yup.string().email(t("Invalid email")).required(t("Email is required")),
      password: yup.string().required(t("Password is required")).min(8, t("The password must be at least 8 characters long."))
        .max(20, t("The password can only contain a maximum of 20 characters.")),
      password2: yup.string().required(t("Password confirmation is required")),
      otp: yup.string().required(t("OTP is required")),
    })
    .required();

  if (isSuccess) {
    schema = schema.concat(schema2)
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });


  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
    setValue,
    control
  } = useForm({
    resolver: yupResolver(schema2),
    mode: "all",
  });

  const [password, password2] = useWatch({ control, name: ["password", "password2"] })

  function handleOTP(data: { email: string }) {
    sendOTP(data.email)
    setValue("email", data.email)
  }

  function handleResetPassword(data: {}) {
    if (password !== password2) {
      toast.error(t('Passwords do not match'))
      return
    }
    resetPassword(data)
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data)
    }
  }, [isSuccess, data])

  useEffect(() => {
    if (isError2) {
      // Check if the error is a FetchBaseQueryError
      if ('data' in (error2 as FetchBaseQueryError)) {
        toast.error((error2 as FetchBaseQueryError).data as string);
      } else {
        toast.error('An error occurred');
      }
    }
  }, [isError2, error2]);

  useEffect(() => {
    if (isSuccess2) {
      toast.success(t("Password changed successfully"))
      navigate("/")
    }
  }, [isSuccess2])

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
      <TitleHelmet title="Forgot Password" />
      <AuthLayout>
        <AuthMinmal>
          <div className="mb-12">
            <h4 className="fw-bold mb-3">{t("Forgot Password")}</h4>
            <p className="fs-16 lead">
              {t("If you forgot your password, well, then we'll email you a verfsication code to reset your password.")}
            </p>
          </div>
          <Form onSubmit={!isSuccess ? handleSubmit(handleOTP) : handleSubmit2(handleResetPassword)}>
            <Form.Group className="mb-3">
              <Form.Control
                {...register("email")}
                placeholder="Email"
                isInvalid={!!errors?.email}
                disabled={isSuccess}
              />
              <Form.Control.Feedback type="invalid">{errors?.email?.message}</Form.Control.Feedback>
            </Form.Group>
            {
              isSuccess && (
                <div>
                  <Form.Group className="mb-3">
                    <Form.Control
                      {...register2("otp")}
                      placeholder="Otp code"
                      isInvalid={!!errors2?.otp}
                    />
                    <Form.Control.Feedback type="invalid">{errors2?.otp?.message}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3 position-relative">
                    <Form.Control
                      {...register2("password")}
                      placeholder="New password"
                      type={showPassword ? 'text' : 'password'}
                      isInvalid={!!errors2?.password}
                    />

                    <Form.Control.Feedback type="invalid">{errors2?.password?.message}</Form.Control.Feedback>
                    <span
                      className="btn btn-icon position-absolute translate-middle top-50"
                      style={{ right: '-1rem' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fi ${showPassword ? 'fi-rr-eye-crossed' : 'fi-rr-eye'}`}></i>
                    </span>
                  </Form.Group>
                  <Form.Group className="mb-3 position-relative">
                    <Form.Control
                      {...register2("password2")}
                      placeholder="Confirm password"
                      type={showPassword ? 'text' : 'password'}
                      isInvalid={!!errors2?.password2}
                    />
                    <span
                      className="btn btn-icon position-absolute translate-middle top-50"
                      style={{ right: '-1rem' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fi ${showPassword ? 'fi-rr-eye-crossed' : 'fi-rr-eye'}`}></i>
                    </span>
                    <Form.Control.Feedback type="invalid">{errors2?.password2?.message}</Form.Control.Feedback>
                  </Form.Group>
                  <div className='text-end'>
                    <a className="link-secondary" href='#' onClick={() => handleOTP({email: watch("email")})}>
                      Enviar codigo de nuevo
                    </a>
                  </div>
                </div>
              )
            }
            <div className="d-grid gap-2 my-4">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={isLoading || isLoading2}
                className="text-white"
              >
                {(isLoading || isLoading2) ? (
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
                    {!isSuccess ? t('Send code') : "Cambiar contraseña"}
                  </div>

                )}
              </Button>
            </div>
            <div>
              <Link to="/auth/login" className="link-primary">
                {t("Return to login")}
              </Link>
            </div>
          </Form>
        </AuthMinmal>
      </AuthLayout>
    </div>
  )
}

export default ForgotPassword
