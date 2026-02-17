import { Button, Form, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as yup from "yup";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';

// --- Imports de tus hooks de RTK Query ---
import { useCreatePaymentMutation, useCreateReinvestmentMutation } from '../../../store/api/investment_plans/plansApiSlice';
import { useGetUserQuery } from '../../../store/api/auth/authApiSlice';
// ⚠️ **IMPORTANTE**: Reemplaza esto con tu hook real para crear una reinversión

import CreateDepositModal from './DepositModal';


// ====================================================================
// 1. FORMULARIO DE REINVERSIÓN (El nuevo que estamos creando)
// ====================================================================
function ReinvestmentForm() {
  const { t } = useTranslation();
  const { data: user } = useGetUserQuery(); // Para obtener los saldos
  
  // ⚠️ **IMPORTANTE**: Usa tu hook de mutación para la reinversión
  const [createReinvestment, { isLoading, isSuccess, isError, error }] = useCreateReinvestmentMutation();

  const reinvestmentOptions = [
    { value: "balance", label: t("Saldo") },
    { value: "utility", label: t("Utilidades") },
  ];

  // Esquema de validación con Yup
  const schema = yup.object({
    amount: yup
      .number()
      .required(t("Amount is required"))
      .typeError(t("Amount is invalid"))
      .positive(t("Amount must be positive"))
      // Validación personalizada para no exceder el saldo disponible
      .test(
        'max-amount',
        t("Amount cannot be greater than the available balance"),
        function (value) {
          const { type } = this.parent;
          if (!user || !value) return true; // Pasa si el usuario no ha cargado o no hay valor
          
          if (type === 'balance') {
            return value <= user.balance;
          }
          if (type === 'utility') {
            return value <= user.utility_balance;
          }
          return true;
        }
      ),
    type: yup.string().required(t("Reinvestment type is required")),
  }).required();

  type ReinvestmentForm = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReinvestmentForm>({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      type: 'balance' // Valor por defecto
    }
  });

  // Observa el tipo seleccionado para mostrar el saldo dinámicamente
  const type = useWatch({ control, name: "type" });

  // Manejo de errores de la API
  useEffect(() => {
    if (isError) {
      const errorMessage = (error as FetchBaseQueryError)?.data as string || 'An error occurred';
      toast.error(errorMessage?.detail || errorMessage);
    }
  }, [isError, error]);

  // Manejo de éxito de la API
  useEffect(() => {
    if (isSuccess) {
      reset();
      toast.success(t("Reinvestment made successfully!"));
    }
  }, [isSuccess, reset, t]);
  
  // Función que se ejecuta al enviar el formulario
  function handleReinvestmentSubmit(data: ReinvestmentForm) {
    createReinvestment(data);
  }

  return (
    <Form className='col-xl-6 col-md-8 mx-auto border p-4 rounded-2' onSubmit={handleSubmit(handleReinvestmentSubmit)}>
      <h5 className='mb-4 text-center'>{t("Re-Investment panel")}</h5>
      
      {/* Radio Buttons para seleccionar el tipo de reinversión */}
      <Form.Group controlId="reinvestmentType" className='mt-4'>
        <Form.Label>{t("Reinvest From")}</Form.Label>
        <div className='d-flex gap-4'>
          {reinvestmentOptions.map(option => (
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

      {/* Mostrar el saldo disponible según el tipo seleccionado */}
      <div className='mt-4 bg-light p-2 rounded'>
        {type === "balance" ? (
          <p className='mb-0'>{t("Available Balance:")} <span className='fw-bold'>${user?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'} USD</span></p>
        ) : type === "utility" ? (
          <p className='mb-0'>{t("Available Utilities:")} <span className='fw-bold'>${user?.utility_balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'} USD</span></p>
        ) : (
          <p className='mb-0 text-muted'>{t("Please select a reinvestment type")}</p>
        )}
      </div>

      {/* Campo para la cantidad */}
      <Form.Group className='mt-4'>
        <Form.Label>{t("Amount to reinvest")}</Form.Label>
        <Form.Control
          {...register("amount")}
          placeholder={"$"}
          isInvalid={!!errors?.amount}
          type="number"
          step="0.01"
        />
        <Form.Control.Feedback type="invalid">{errors?.amount?.message}</Form.Control.Feedback>
      </Form.Group>

      {/* Botón de envío */}
      <Button className='col-12 mt-4' type='submit' disabled={isLoading}>
        {isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {t("Processing...")}
          </>
        ) : (
          t("Make Reinvestment")
        )}
      </Button>
    </Form>
  );
}


// ====================================================================
// 2. FORMULARIO DE DEPÓSITO (Tu código original, ligeramente adaptado)
// ====================================================================
function NormalDepositForm() {
  const { t } = useTranslation();

  const schema = yup.object({
    amount: yup.number().required(t("Amount is required")).typeError(t("Amount is invalid")).positive(t("Amount must be positive")),
  }).required();

  const { register, formState: { errors }, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  type PaymentForm = yup.InferType<typeof schema>;

  const [createPayment, { isLoading, isSuccess, isError, error, data }] = useCreatePaymentMutation();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (isError) {
      const errorMessage = (error as FetchBaseQueryError)?.data as string || 'An error occurred';
      toast.error(errorMessage);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess) {
      reset();
      toast.success(t("Deposit transaction made successfully!"));
      if (data) {
        setOpenModal(true);
      }
    }
  }, [isSuccess, data, reset, t]);

  function handleSubmitPayment(formData: PaymentForm) {
    createPayment(formData);
  }

  return (
    <>
      <Form className='col-xl-6 col-md-8 mx-auto border p-4 rounded-2' onSubmit={handleSubmit(handleSubmitPayment)}>
        <h5 className='mb-4 text-center'>{t("Create a new deposit")}</h5>
        <Form.Group className='mt-4'>
          <Form.Label>{t("Deposit Amount")}</Form.Label>
          <Form.Control
            {...register("amount")}
            placeholder={"$"}
            isInvalid={!!errors?.amount}
            type="number"
            step="0.01"
          />
          <Form.Control.Feedback type="invalid">{errors?.amount?.message}</Form.Control.Feedback>
        </Form.Group>
        <Button className='col-12 mt-4' type='submit' disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {t("Loading...")}
            </>
          ) : (
            t("Create deposit")
          )}
        </Button>
      </Form>
      {(data && openModal) && (
        <CreateDepositModal
          activeModal={openModal}
          handleCloseModal={() => setOpenModal(false)}
          data={data}
          onGenerateNewTransaction={() => createPayment({ "amount": parseInt(data?.amount) })}
        />
      )}
    </>
  );
}


// ====================================================================
// 3. COMPONENTE PRINCIPAL QUE UNE TODO
// ====================================================================
export default function DepositsPage() {
  const [activeTab, setActiveTab] = useState('deposit');
  const { t } = useTranslation();

  return (
    <div className='row'>
      <div className="col-12">
        {/* Navegación tipo "Breadcrumb" / Pestañas */}
        <Nav variant="pills" defaultActiveKey="deposit" className="justify-content-center mb-4">
          <Nav.Item>
            <Nav.Link eventKey="deposit" onClick={() => setActiveTab('deposit')}>
              {t("Normal Deposit")}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="reinvest" onClick={() => setActiveTab('reinvest')}>
              {t("Reinvestment")}
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Renderizado condicional del formulario */}
        {activeTab === 'deposit' && <NormalDepositForm />}
        {activeTab === 'reinvest' && <ReinvestmentForm />}
      </div>
    </div>
  );
}