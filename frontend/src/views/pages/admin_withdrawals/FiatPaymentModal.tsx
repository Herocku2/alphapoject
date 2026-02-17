import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useProcessFiatWithdrawalMutation } from '../../../store/api/withdrawals/withdrawalsApiSlice';
// ⚠️ IMPORTANTE: Necesitarás crear esta mutación en tu slice de API

interface FiatPaymentModalProps {
    show: boolean;
    onHide: () => void;
    withdrawal: Withdrawal | null; // El retiro a procesar
    onSuccess: () => void; // Función para ejecutar al tener éxito
}

const FiatPaymentModal: React.FC<FiatPaymentModalProps> = ({ show, onHide, withdrawal, onSuccess, setRefuseFiat }) => {
    const { t } = useTranslation();
    const [paymentProof, setPaymentProof] = useState<File | null>(null);

    // ⚠️ IMPORTANTE: Este es el hook para la nueva mutación de tu API
    const [processFiatWithdrawal, { isLoading, isSuccess, isError, error }] = useProcessFiatWithdrawalMutation();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setPaymentProof(event.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!withdrawal || !paymentProof) {
            toast.error(t('Please select a payment proof file.'));
            return;
        }

        const formData = new FormData();
        formData.append('withdrawal_id', withdrawal.id.toString());
        formData.append('payment_proof_file', paymentProof);

        await processFiatWithdrawal(formData);
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(t('FIAT withdrawal processed successfully!'));
            onSuccess(); // Llama a la función de éxito (limpiar selección, etc.)
            onHide(); // Cierra el modal
        }
        if (isError) {
            // Asumiendo que 'error' tiene un formato similar a tus otros errores
            const errorMessage = (error as any)?.data?.detail || t('An error occurred');
            toast.error(errorMessage);
        }
    }, [isSuccess, isError, error,]);
    
    // Resetea el archivo cuando el modal se cierra o cambia el retiro
    useEffect(() => {
        if (!show) {
            setPaymentProof(null);
        }
    }, [show]);

    if (!withdrawal) return null;


    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t('Process FIAT Withdrawal')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>{t('User')}:</strong> {withdrawal.user}</p>
                <p><strong>{t('Country')}:</strong> {withdrawal.bank_country}</p>
                <p><strong>{t('Amount')}:</strong> ${withdrawal.amount.toLocaleString()}</p>
                <p><strong>{t('Bank Name')}:</strong> {withdrawal.bank_bank_name}</p>
                <p><strong>{t('Account Number')}:</strong> {withdrawal.bank_account_number}</p>
                 <p><strong>{t('Swift Code')}:</strong> {withdrawal.bank_swift_code}</p>
                <hr />
                <p>{t('Are you sure you want to confirm this payment? Please upload the payment proof.')}</p>
                
                <Form.Group controlId="paymentProof" className="mb-3">
                    <Form.Label>{t('Payment Proof (Image or PDF)')}</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} accept="image/*,.pdf" />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                {/* <Button variant="secondary" onClick={onHide} disabled={isLoading}>
                    {t('Cancel')}
                </Button> */}
                 <Button variant="danger" onClick={() => {setRefuseFiat(true); setTimeout(() => onHide(), 100)}} disabled={isLoading}>
                    {t('Refuse')}
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={!paymentProof || isLoading}>
                    {isLoading ? <Spinner as="span" animation="border" size="sm" /> : t('Confirm Payment')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FiatPaymentModal;