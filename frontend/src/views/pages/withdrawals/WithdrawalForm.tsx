import { Alert, Button, Card, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as yup from "yup";
import { useCreateSecretCodeMutation, useCreateWithdrawalMutation } from '../../../store/api/withdrawals/withdrawalsApiSlice';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useGetUserQuery } from '../../../store/api/auth/authApiSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';

export default function WithdrawalForm() {

  const { t } = useTranslation();

  // Opciones para los radio buttons de tipo de retiro
  const withdrawalOptions = [
    { value: "2", label: t("Saldo Ref.") },
    { value: "1", label: t("Utilidades") },
    { value: "3", label: t("Inversión") }
  ];

  const [createCode, { isLoading: isLoadingCode, isSuccess: isSuccessCode, isError: isErrorCode, error: errorCode, data: dataCode }] = useCreateSecretCodeMutation();
  const [createWithdrawal, { isLoading, isSuccess, isError, error }] = useCreateWithdrawalMutation();
  const { data: user } = useGetUserQuery();

  // Esquema de validación con Yup
  const schema = yup
    .object({
      amount: yup
        .number()
        .required(t("Amount is required"))
        .typeError(t("Amount is invalid"))
        .positive(t("Amount must be positive")),
      method: yup.string().oneOf(['crypto', 'fiat']).required(), // NUEVO: Campo para el método
      wallet_address: yup.string().required(t("Wallet address USDT BEP20 is required.")),
      // used_code: yup.string().required(t("Secret code is required.")), // DISABLED: OTP code no longer required
      type: yup.string().required(t("Withdrawal type is required.")).typeError("Debes de seleccionar un tipo de retiro")
    })
    .required();

  type WithdrawalForm = yup.InferType<typeof schema>;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
    reset
  } = useForm<WithdrawalForm>({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      method: 'crypto',
    }
  });

  // Observa el valor del campo 'type' para mostrar el balance correspondiente
  const [type, method] = useWatch({ control, name: ["type", "method"] });

  // Efecto para establecer la wallet del usuario cuando se carga
  useEffect(() => {
    if (user?.usdt_wallet) {
      setValue("wallet_address", user.usdt_wallet, { shouldValidate: true });
    } else {
      // Opcional: limpiar el campo si el usuario no tiene wallet
      setValue("wallet_address", "", { shouldValidate: true });
    }
  }, [user, setValue]);

  // Manejadores de notificaciones de éxito y error
  useEffect(() => {
    if (isSuccessCode) {
      toast.success(dataCode);
    }
  }, [isSuccessCode, dataCode]);

  useEffect(() => {
    if (isErrorCode) {
      if ('data' in (errorCode as FetchBaseQueryError)) {
        toast.error((errorCode as FetchBaseQueryError).data as string);
      } else {
        toast.error('An error occurred');
      }
    }
  }, [isErrorCode, errorCode]);

  useEffect(() => {
    if (isError) {
      if ('data' in (error as FetchBaseQueryError)) {
        toast.error((error as FetchBaseQueryError).data as string);
      } else {
        toast.error('An error occurred');
      }
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess) {
      reset();
      toast.success(t("Withdrawal made successfully!"));
    }
  }, [isSuccess, reset, t]);

  // Función para manejar el envío del formulario
  function handleSubmitWithdrawal(data: WithdrawalForm) {
    createWithdrawal(data);
  }

  return (
    <div className='row'>
      <Form className='col-xl-6 col-md-6 mx-auto border p-4 rounded-2' onSubmit={handleSubmit(handleSubmitWithdrawal)}>
        <p className='text-warning'>
          {
            (type == "3" && method != "fiat") ? (
              <>
                <>
                  {t("Investment Withdrawals are processing 72 hours")}
                </>
              </>
            ) : (method == "fiat") ? (

              <>
                {t("Withdrawals are processing 72 hours")}
              </>

            ) : (
              <>
                {t("Withdrawals are processing 24 hours")}
              </>
            )
          }
        </p>
        <p>{t("Withdrawals are only available on Thursdays and Fridays")}</p>

        {/* === CAMBIO: Select a Radio Button === */}
        <Form.Group controlId="withdrawalType" className='mt-4'>
          <Form.Label>{t("Withdrawal Type")}</Form.Label>
          <div className='d-flex gap-3'>
            {withdrawalOptions.map(option => (
              <Form.Check
                key={option.value}
                type="radio"
                id={`type-${option.value}`}
                label={option.label}
                value={option.value}
                {...register("type")}
                isInvalid={!!errors.type}
              />
            ))}
          </div>
          {errors.type && <span className='text-danger d-block mt-1'>{errors.type.message}</span>}
        </Form.Group>

        <div className='mt-4'></div>
        {
          (type === "2") ? (
            <p>{t("Saldo")} <span className='fw-bold'>${user?.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span></p>
          ) : (type === "1") ? (
            <p>{t("Utilidad")} <span className='fw-bold'>${user?.utility_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span></p>
          ) : (type === "3") ? (
            <p>{t("Inversión")} <span className='fw-bold'>${user?.investment_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span></p>
          ) : (
            <p className='mt-4'>{t("Please select a withdrawal type.")}</p>
          )
        }

        {/* NUEVO: MÉTODO DE RETIRO (CRYPTO O FIAT) */}
        <Form.Group controlId="withdrawalMethod" className='mt-4'>
          <Form.Label>{t("Withdrawal Method")}</Form.Label>
          <div className='d-flex flex-wrap gap-3'>
            <Form.Check type="radio" id="method-crypto" label="Crypto" value="crypto" {...register("method")} />
            <Form.Check type="radio" id="method-fiat" label="FIAT" value="fiat" {...register("method")} />
          </div>
        </Form.Group>



        <Form.Group className='mt-4'>
          <Form.Label>{t("Amount")}</Form.Label>
          <Form.Control
            {...register("amount")}
            placeholder={"$"}
            isInvalid={!!errors?.amount}
          />
          <Form.Control.Feedback type="invalid">{errors?.amount?.message}</Form.Control.Feedback>
        </Form.Group>

        {/* === CAMBIO: Select a Input de solo lectura === */}
        {method === 'crypto' && (
          <Form.Group controlId="walletAddress" className='mt-4'>
            <Form.Label>{t("Wallet")}</Form.Label>
            <Form.Control type="text" readOnly {...register("wallet_address")} isInvalid={!!errors.wallet_address} placeholder={t("Your wallet address will appear here")} />
            <Form.Control.Feedback type="invalid">{errors.wallet_address?.message}</Form.Control.Feedback>
          </Form.Group>
        )}

        {method === 'fiat' && (
          <div className='mt-4'>
            <Form.Label>{t("Bank Destination")}</Form.Label>
            {user && (user.bank_name || user.bank_account_number) ? (
              <Card body className="bg-light">
                <p className="mb-1"><strong>{t("Bank Name")}:</strong> {user.bank_name}</p>
                <p className="mb-1"><strong>{t("Account Number")}:</strong> {user.bank_account_number}</p>
                <p className="mb-0"><strong>{t("Country")}:</strong> {user.bank_country}</p>
              </Card>
            ) : (
              <Alert variant="warning">
                {t("Please complete your bank information in your profile before requesting a FIAT withdrawal.")}
              </Alert>
            )}
          </div>
        )}

        {/* DISABLED: OTP code generation and input
        <div className=' mt-4 d-flex justify-content-center'>
          {
            !isSuccessCode ? (
              <Button variant='info' className='mx-auto' onClick={() => createCode()}>
                {isLoadingCode ? (
                  <div>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Loading...
                  </div>
                ) : (
                  <div>{t("Generate secret code")}</div>
                )}
              </Button>
            ) : (
              <a href="#" onClick={(e) => { e.preventDefault(); createCode(); }} className='link-opacity-100'>{t("Try again")}</a>
            )
          }
        </div>

        <Form.Group controlId="secretCode" className='mt-4'>
          <Form.Label>{t("Secret code")}</Form.Label>
          <Form.Control
            {...register("used_code")}
            placeholder={t("Code")}
            isInvalid={!!errors?.used_code}
          />
          <Form.Control.Feedback type="invalid">{errors?.used_code?.message}</Form.Control.Feedback>
        </Form.Group>
        */}

        <Button className='col-12 mt-4' type='submit' disabled={isLoading}>
          {isLoading ? (
            <div>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Loading...
            </div>
          ) : (
            <div>{t("Submit")}</div>
          )}
        </Button>
      </Form>
    </div >
  );
}