import React, { useEffect, useState, useRef } from 'react'
import { Button, Modal } from 'react-bootstrap' // No need for Form here
import { useTranslation } from 'react-i18next'
import { useVerifyPaymentMutation } from '../../../store/api/investment_plans/plansApiSlice'
import QRCode from "react-qr-code";
import toast from 'react-hot-toast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';


type PurchasePlanModalProps = {
    handleCloseModal: () => void
    activeModal: boolean
    data: TransactionResponse | null // data can be null initially
    onGenerateNewTransaction: () => void; // New prop for generating new transaction
}

const CreateDepositModal: React.FC<PurchasePlanModalProps> = ({ handleCloseModal, activeModal, data, onGenerateNewTransaction }) => {
    const { t } = useTranslation()

    const [verifyPayment, { isLoading: isLoadingVerification, isSuccess: isSuccessVerification, isError: isErrorVerification,
        data: verificationData, error: errorVerification }] = useVerifyPaymentMutation()

    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0); // Time left in seconds
    const [isExpired, setIsExpired] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Effect for handling successful verification
    useEffect(() => {
        if (isSuccessVerification) {
            toast.success(verificationData)
            handleCloseModal()
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }, [isSuccessVerification, verificationData, handleCloseModal]);

    // Effect for handling verification errors
    useEffect(() => {
        const e = errorVerification;
        if (isErrorVerification && e) {
            if ('data' in (e as FetchBaseQueryError)) {
                toast.error((e as FetchBaseQueryError).data as string);
            } else {
                toast.error('An error occurred');
            }
        }
    }, [isErrorVerification, errorVerification]);

    // Effect for handling the countdown timer
    useEffect(() => {
        if (activeModal && data?.created_date) {
            const createdDate = new Date(data.created_date);
            const expirationTime = createdDate.getTime() + (30 * 60 * 1000); // 30 minutes in milliseconds

            const calculateTimeLeft = () => {
                const now = new Date().getTime();
                const difference = expirationTime - now;

                if (difference <= 0) {
                    setTimeLeft(0);
                    setIsExpired(true);
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }
                } else {
                    setTimeLeft(Math.round(difference / 1000)); // Convert ms to seconds
                    setIsExpired(false);
                }
            };

            // Initial calculation
            calculateTimeLeft();

            // Set up interval for every second
            timerRef.current = setInterval(calculateTimeLeft, 1000);
        } else {
            // Clear interval if modal is closed or data is not available
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            setTimeLeft(0);
            setIsExpired(false);
        }

        // Cleanup on unmount or modal close
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [activeModal, data?.created_date]);

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const copyToClipboard = () => {
        if (data?.receiver_wallet) {
            navigator.clipboard.writeText(data.receiver_wallet);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    function handleVerifyPayment() {
        if (data?.id && !isExpired) { // Prevent verification if expired
            verifyPayment({
                id: data.id,
            });
        } else if (isExpired) {
            toast.error(t("This transaction has expired. Please generate a new one."));
        }
    }

    return (
        <Modal show={activeModal} onHide={handleCloseModal}>
            <Modal.Body>
                <div>
                    <div className="d-flex flex-wrap justify-content-between px-lg-4 px-0">
                        <div>
                            <h2 className="fw-bold mb-3">{t("Increase my investment")}</h2>
                        </div>
                    </div>
                    <div className='px-lg-5 mx-auto'>
                        {(data) && (
                            <div className='d-grid justify-content-center text-center'>
                                {isExpired ? (
                                    <div className="alert alert-danger text-center mt-6" role="alert">
                                        {t("This transaction has expired.")}
                                    </div>
                                ) : (
                                    <div>
                                        <QRCode value={data.receiver_wallet} className='mx-auto' />
                                        <div className="mt-4 d-flex flex-wrap align-items-center justify-content-center">
                                            <span className="fw-bold me-2">{data.receiver_wallet}</span>
                                            <Button onClick={copyToClipboard} variant="outline-secondary" size="sm">
                                                {copied ? t("Copied!") : t("Copy")}
                                            </Button>
                                        </div>
                                        <div className='mt-2'>
                                            <span>{t("Please send ")} <span className='fw-bold'><h5>{data.amount?.toLocaleString('en-US', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3
})}</h5></span>
                                                {" "} USDT (BEP20)</span>
                                            <p>{t("and then click on verify payment to confirm transaction.")}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-3">
                                    {!isExpired && (
                                        <h4 className="fw-bold text-danger">
                                            {t("Time left:")} {formatTime(timeLeft)}
                                        </h4>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='d-flex justify-content-center col-12 mt-4 gap-3'>
                        {isExpired ? (
                            <Button className='col-xl-6 col-12' onClick={onGenerateNewTransaction}>
                                {t("Generate new transaction")}
                            </Button>
                        ) : (
                            <Button className='col-xl-6 col-12' type='submit' onClick={handleVerifyPayment} disabled={isLoadingVerification}>
                                {isLoadingVerification ? (
                                    <div>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        {t("Loading...")}
                                    </div>
                                ) : (
                                    t("Verify payment")
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default CreateDepositModal