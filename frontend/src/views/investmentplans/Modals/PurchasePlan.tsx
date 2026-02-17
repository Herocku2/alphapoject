import React, { useEffect } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useCreatePaymentMutation, useVerifyPaymentMutation } from '../../../store/api/investment_plans/plansApiSlice'
import QRCode from "react-qr-code";
import toast from 'react-hot-toast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import * as yup from "yup"
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetUserQuery } from '../../../store/api/auth/authApiSlice';

type PurchasePlanModalProps = {
    handleCloseModal: () => void
    activeModal: boolean
}


const PurchasePlanModal: React.FC<PurchasePlanModalProps> = ({ handleCloseModal, activeModal, }) => {

    const { t } = useTranslation()

    const [createPayment, { isLoading, isSuccess, data, error }] = useCreatePaymentMutation()

    const schema = yup.object({
        amount: yup.number().required(t("Invest amount is required")).typeError(t("Amount is invalid")),
        payPasive: yup.boolean().optional()
    })

    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        setValue,
        trigger
    } = useForm({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const [verifyPayment, { isLoading: isLoadingVerification, isSuccess: isSuccessVerification, isError: isErrorVerification,
        data: verificationData, error: errorVerification }] = useVerifyPaymentMutation()

    const [amount, payPasive] = useWatch({ control, name: ['amount', 'payPasive'] })

    useEffect(() => {
        if (isSuccess) {
            if (payPasive) {
                toast.success(t("Transaction successfully, investment increased!"))
                handleCloseModal()
            } else {
                toast.success(t("Transaction created successfully!"))
            }

        }
    }, [isSuccess])

    const { data: user } = useGetUserQuery()

    useEffect(() => {
        if (payPasive) {
            setValue("amount", user?.balance || 0)
            trigger("amount")
        }
    }, [payPasive])

    useEffect(() => {
        if (isSuccessVerification) {
            toast.success(verificationData)
            handleCloseModal()

        }
    }, [isSuccessVerification])

    useEffect(() => {
        const e = errorVerification || error
        if (e) {
            // Check if the error is a FetchBaseQueryError
            if ('data' in (e as FetchBaseQueryError)) {
                toast.error((e as FetchBaseQueryError)?.data as string);
            } else {
                toast.error('An error occurred');
            }
        }
    }, [isErrorVerification, errorVerification, error]);


    function handleCreatePayment() {
        if (payPasive) {
            createPayment({ amount: amount, payPasive: payPasive })

            return
        }
        if (!isSuccess) {
            createPayment({ amount: amount })
        } else {
            if (data?.result.txn_id) {
                verifyPayment({
                    txn_id: data?.result.txn_id,
                })
            }

        }

    }

    return (
        <Modal show={activeModal} onHide={handleCloseModal} >

            <Modal.Body>
                <Form onSubmit={handleSubmit(handleCreatePayment)} className='mb-8'>
                    <div className="flex-row d-flex flex-wrap justify-content-between px-lg-4 px-0">
                        <div>
                            <h2 className="fw-bold mb-3">{t("Increase my investment")}</h2>
                        </div>
                    </div>
                    <div className='px-lg-5  mx-auto '>
                        {
                            (isSuccess && !payPasive)  && (
                                <div className='d-grid justify-content-center text-center'>
                                    <QRCode value={data.result?.address} className='mx-auto' />
                                    <p className='mt-2'><span className='fw-bold'>{data.result.address}</span></p>
                                    <div className='mt-2'>
                                        <span>{t("Please send ")} <span className='fw-bold'>{data.result?.amount}</span>
                                            {" "} USDT (BEP20)</span>
                                        <p >{t("and then click on verify payment to confirm transaction.")}</p>

                                    </div>
                                    <a className='text-primary' target='_blank' href={data?.result.checkout_url}>{t("Click here for view more information.")}</a>
                                </div>
                            )
                        }
                    </div>
                    <div className='row'>


                        {
                            (!isSuccess || payPasive) && (
                                <div className='mt-6  col-12 '>
                                    <Form.Group className="mb-3 col-xl-6 col-12 mx-auto">
                                        <Form.Label>{t("Investment amount")}</Form.Label>
                                        <Form.Control
                                            {...register("amount")}
                                            placeholder={"$"}
                                            isInvalid={!!errors?.amount}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors?.amount?.message}</Form.Control.Feedback>
                                    </Form.Group >
                                    {
                                        (user && user?.balance > 0) && (
                                            <Form.Group className="mb-3 col-xl-6 col-12 mx-auto">
                                                <Form.Check type="checkbox" id="check-api-terms-conditions">
                                                    <Form.Check.Input
                                                        {...register("payPasive")}
                                                    />
                                                    <Form.Check.Label>
                                                        {t("Pay with my pasive balance")}
                                                    </Form.Check.Label>
                                                </Form.Check>
                                            </Form.Group >
                                        )
                                    }

                                </div>
                            )
                        }

                        <div className='d-flex justify-content-center  col-12  mt-6 gap-3'>

                            <Button className='col-xl-6 col-12' type='submit'>
                                {(isLoading || isLoadingVerification) ? (
                                    <div>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Loading...
                                    </div>
                                ) : (
                                    <div> {
                                        isSuccess ? (
                                            <div>
                                                {t("Verify payment")}
                                            </div>
                                        ) : (
                                            <div>
                                                {t("Invest")}
                                            </div>
                                        )
                                    } </div>

                                )}
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>

        </Modal>
    )
}

export default PurchasePlanModal