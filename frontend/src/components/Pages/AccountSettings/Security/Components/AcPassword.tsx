import { Form, Row, Col, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useChangePasswordMutation, } from '../../../../../store/api/auth/authApiSlice';
import toast from 'react-hot-toast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const AcPassword = () => {

  const { t } = useTranslation()

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const schema = yup
    .object({
      current_password: yup.string().required(t("Current password is required")),
      password: yup.string().required(t("Password is required")).min(8, t("The password must be at least 8 characters long."))
        .max(20, t("The password can only contain a maximum of 20 characters.")),
      password2: yup
        .string()
        .oneOf([yup.ref("password"), null], t("Passwords dont match.")),
    })
    .required();

  type ChangePasswordForm = yup.InferType<typeof schema>;

  const { register, handleSubmit, formState: { errors },  } = useForm<ChangePasswordForm>({
    resolver: yupResolver(schema),
    mode: "all",
  });
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const [changePassword, { isSuccess, isError, error, isLoading }] = useChangePasswordMutation()

  function handleChangePassword(data: ChangePasswordForm) {
    changePassword(data)
  }

  useEffect(() =>{
    if(isSuccess){
      toast.success(t("Password updated successfully"))
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
  }, [isError]);

  console.log(errors);

  return (
    <div>
      <Form onSubmit={handleSubmit(handleChangePassword)}>
        <div className="mb-6 mb-md-12">
          <h5 className="fw-semibold">{t("Password")}</h5>
          <p>{t("Change password on your account")}</p>
        </div>

        <Form.Group className='row mb-4'>
          <Col md={3}>
            <Form.Label className="fw-medium">{t("Current Password")}</Form.Label>
          </Col>
          <Col md={9} xl={8} xxl={6} className=' position-relative'>
            <Form.Control type={showPassword ? "text" : "password"} placeholder="Current Password"
              isInvalid={!!errors?.current_password}
              {...register("current_password")} />
            <Form.Control.Feedback type='invalid'>{errors?.current_password?.message}</Form.Control.Feedback>
            <span
              className="btn btn-icon position-absolute translate-middle top-50"
              style={{ right: '1rem' }}
              onClick={handleTogglePasswordVisibility}
            >
              <i className={`fi ${showPassword ? 'fi-rr-eye-crossed' : 'fi-rr-eye'}`}></i>
            </span>
          </Col>

        </Form.Group>
        <Form.Group className='row mb-4'>
          <Col md={3}>
            <Form.Label className="fw-medium">{t("New Password")}</Form.Label>
          </Col>
          <Col md={9} xl={8} xxl={6}>
            <Form.Control
              {...register("password")}
              isInvalid={!!errors?.password}
              type={showPassword ? "text" : "password"} placeholder="New Password" />
            <Form.Control.Feedback type='invalid'>{errors?.password?.message}</Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group className='row mb-4'>
          <Col md={3}>
            <Form.Label className="fw-medium">{t("Confirm Password")}</Form.Label>
          </Col>
          <Col md={9} xl={8} xxl={6}>
            <Form.Control
              {...register("password2")}
              isInvalid={!!errors?.password2}
              type={showPassword ? "text" : "password"} placeholder="Confirm Password" />
            <Form.Control.Feedback type='invalid'>{errors?.password2?.message}</Form.Control.Feedback>
          </Col>
        </Form.Group>


        <Row className="g-md-4 mb-4">
          <Col md={3}></Col>
          <Col md={9} xl={8} xxl={6}>
            <h6>{t("Password Requirements:")}</h6>
            <ul className="ps-1 ms-2 mb-0">
              <li className="mb-1">{t("At least one lowercase character")}</li>
              <li className="mb-1">{t("Minimum 8 characters long - the more, the better")}</li>
              <li>{t("At least one number, symbol, or whitespace character")}</li>
            </ul>
          </Col>
        </Row>
        <Button type='submit'>
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
            t('Change Password')
          )}
        </Button>
      </Form>
    </div>
  )
}

export default AcPassword
