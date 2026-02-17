import React, { useEffect, useState } from 'react';
import { Form, Button, Spinner, Card, Row, Col, Image, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { useGetUserQuery } from '../../store/api/auth/authApiSlice';
import { useCreateUserTransferMutation } from '../../store/api/transfers/apiTransfersSlice';
import { useFindUserByEmailMutation } from '../../store/api/transfers/apiTransfersSlice';
import { useCreateSecretCodeMutation } from '../../store/api/withdrawals/withdrawalsApiSlice';
import TransferHistoryTable from './TransferHistoryTable';

// --- TIPOS E INTERFACES ---
interface UserData {
  balance: number;
  utility_balance: number;
  withdrawable_investment_balance: number;
}
interface TransferFormInputs {
  transfer_type: 'balance' | 'utility' | 'investment';
  receiver_username: string;
  amount: number;
  secret_code: string;
}
interface FoundUser {
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const UserTransferForm: React.FC = () => {
  const { t } = useTranslation();
  const { data: user } = useGetUserQuery<UserData>({});
  const [createUserTransfer, { isLoading, isSuccess, isError, error }] = useCreateUserTransferMutation();

  // --- ESTADOS PARA LA BÚSQUEDA ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceiver, setSelectedReceiver] = useState<FoundUser | null>(null);
  const [findUser, { data: foundUser, error: findError, isLoading: isFindingUser, reset: resetFindUser }] = useFindUserByEmailMutation();
  const [createCode, { isLoading: isLoadingCode, isSuccess: isSuccessCode, isError: isErrorCode, error: errorCode, data: dataCode }] = useCreateSecretCodeMutation();


  const schema = yup.object({
    transfer_type: yup.string().oneOf(['balance', 'utility', 'investment']).required(),
    receiver_username: yup.string().required(t("Receiver's username is required")),
    amount: yup.number().positive(t("Amount must be positive")).required(t("Amount is required"))
      .test('max-amount', t("Amount exceeds available balance"), function (value) {
        const { transfer_type } = this.parent;
        if (!user || !value) return true;
        if (transfer_type === 'balance') return value <= user.balance;
        if (transfer_type === 'utility') return value <= user.utility_balance;
        if (transfer_type === 'investment') return value <= user.investment_balance;
        return true;
      }),
    secret_code: yup.string().required(t("Secret code is required")),
  }).required();

  const { register, handleSubmit, formState: { errors }, control, reset, setValue } = useForm<TransferFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: { transfer_type: 'balance' },
  });

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (searchTerm.length > 5 && searchTerm.includes('@')) {
        findUser({ email: searchTerm });
      } else {
        toast.error(t("Please enter a valid email address."));
      }
    }
  };

  useEffect(() => {
    if (foundUser) {
      setSelectedReceiver(foundUser);
      setValue('receiver_username', foundUser.username, { shouldValidate: true });
    }
  }, [foundUser, setValue]);

  const handleRemoveReceiver = () => {
    setSelectedReceiver(null);
    setSearchTerm('');
    setValue('receiver_username', '');
    resetFindUser(); // Limpia el estado de la mutación de búsqueda (errores, data, etc.)
  };

  const onSubmit: SubmitHandler<TransferFormInputs> = (data) => {
    if (!selectedReceiver) {
      toast.error(t("Please find and select a valid receiver."));
      return;
    }
    createUserTransfer(data);
  };

  useEffect(() => {
    if (isSuccessCode && dataCode) {
      toast.success(dataCode as string);
    }
  }, [isSuccessCode, dataCode]);

  useEffect(() => {
    if (isErrorCode) {
      if ('data' in (errorCode as FetchBaseQueryError)) {
        toast.error((errorCode as FetchBaseQueryError).data as string);
      } else {
        toast.error(t('An error occurred while sending the code'));
      }
    }
  }, [isErrorCode, errorCode, t]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(t("Transfer successful!"));
      reset();
      handleRemoveReceiver();
    }
  }, [isSuccess, reset, t]);

  useEffect(() => {
    if (isError) {
      const errorMessage = (error as FetchBaseQueryError)?.data as string || t('An error occurred');
      toast.error(errorMessage);
    }
  }, [isError, error]);

  const handleSearch = () => {
    if (searchTerm.length > 5 && searchTerm.includes('@')) {
      findUser({ email: searchTerm });
    } else {
      toast.error(t("Please enter a valid email address."));
    }
  };

  return (
    <Row className="justify-content-center">
      <Col lg={8} xl={7}>
        <Card>
          <Card.Header>
            <Card.Title>{t("Send Money to Another User")}</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label>{t("Send From")}</Form.Label>
                <div>
                  <Form.Check inline type="radio" id="from_balance" value="balance" label={`${t("Referral Balance")}: $${user?.balance?.toLocaleString() || '0.00'}`} {...register("transfer_type")} />
                  <Form.Check inline type="radio" id="from_utility" value="utility" label={`${t("Utility Balance")}: $${user?.utility_balance?.toLocaleString() || '0.00'}`} {...register("transfer_type")} />
                  <Form.Check inline type="radio" id="from_investment" value="investment" label={`${t("Withdrawable Investment")}: $${user?.investment_balance?.toLocaleString() || '0.00'}`} {...register("transfer_type")} />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>{t("Receiver's Email")}</Form.Label>
                {!selectedReceiver ? (
                  <>
                    <InputGroup>
                      <Form.Control
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        isInvalid={!!errors.receiver_username || !!findError}
                        placeholder={t("Enter email to search then click on search")}
                        type="email"
                      />
                      <Button variant="primary" onClick={handleSearch} disabled={isFindingUser}>
                        {isFindingUser ? <Spinner as="span" animation="border" size="sm" /> : t("Search")}
                      </Button>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors.receiver_username?.message || (findError ? t("User not found.") : null)}
                    </Form.Control.Feedback>
                  </>
                ) : (
                  <Card body className="bg-light d-flex flex-row align-items-center">
                    <Image src={selectedReceiver.avatar} roundedCircle width={40} height={40} className="me-3" />
                    <div>
                      <div className="fw-bold">{selectedReceiver.first_name} {selectedReceiver.last_name}</div>
                      <div className="text-muted">@{selectedReceiver.username}</div>
                    </div>
                    <Button variant="link" className="ms-auto text-danger" onClick={handleRemoveReceiver}>
                      {t("Change")}
                    </Button>
                  </Card>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>{t("Amount to Send")}</Form.Label>
                <Form.Control {...register("amount")} type="number" step="0.01" isInvalid={!!errors.amount} placeholder="$0.00" />
                <Form.Control.Feedback type="invalid">{errors.amount?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>{t("Secret Code")}</Form.Label>
                <InputGroup>
                  <Form.Control
                    {...register("secret_code")}
                    isInvalid={!!errors.secret_code}
                    placeholder={t("Enter your secret code to confirm")}
                  />
                  {!isSuccessCode ? (
                    <Button variant="info" onClick={() => createCode()} disabled={isLoadingCode}>
                      {isLoadingCode ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : (
                        t("Send Code")
                      )}
                    </Button>
                  ) : (
                    <Button variant="outline-secondary" onClick={(e) => { e.preventDefault(); createCode(); }}>
                      {t("Resend")}
                    </Button>
                  )}
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.secret_code?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" disabled={isLoading || !selectedReceiver}>
                {isLoading ? <Spinner as="span" animation="border" size="sm" /> : t("Send Money")}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <div className='mt-4'></div>
      <TransferHistoryTable />
    </Row>
  );
};

export default UserTransferForm;