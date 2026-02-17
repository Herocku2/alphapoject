// src/components/WithdrawalProcessor.tsx
import React, { useState, useEffect } from 'react';
import { Button, Modal, Table, Spinner, Alert, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { type Address, type BaseError } from 'viem';
import { usePayWithdrawalsMutation, useRefuseWithdrawalsMutation } from '../../../store/api/withdrawals/withdrawalsApiSlice';

// --- TYPES & CONSTANTS ---

// Define la estructura de tus retiros
interface Withdrawal {
    id: number | string;
    user: string;
    amount: string;
    wallet_address: string;
}

// Define las props para este componente todo-en-uno
interface WithdrawalProcessorProps {
    selectedWithdrawals: Withdrawal[];
    disabled?: boolean;
}

// Un tipo para nuestra máquina de estados, para manejar todos los casos
type TransactionStatus = 'idle' | 'waitingForWallet' | 'confirming' | 'updatingBackend' | 'success' | 'error' | 'dropped';

// Usa el ABI completo y 'as const' para un tipado estricto
const distributeContractAbi = [{ "inputs": [{ "internalType": "address", "name": "usdtAddress", "type": "address" }, { "internalType": "address", "name": "usdcAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "token", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "EmergencyWithdrawal", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "currentOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferStarted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "SpenderApproved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TokensDistributed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "inputs": [], "name": "USDC", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "USDT", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "acceptOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approveSpender", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "recipients", "type": "address[]" }, { "internalType": "uint256[]", "name": "wholeNumbers", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "decimals", "type": "uint256[]" }], "name": "distributeUSDC", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "recipients", "type": "address[]" }, { "internalType": "uint256[]", "name": "wholeNumbers", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "decimals", "type": "uint256[]" }], "name": "distributeUSDT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }], "name": "emergencyWithdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getPendingOwner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isPaused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "recoverTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

// Es una buena práctica usar una variable de entorno para la dirección del contrato
const CONTRACT_ADDRESS = "0x3670bF104cb86917F51Ed662534b08d6ceEA4b07" as Address | undefined;

// --- COMPONENT ---

const WithdrawalProcessor: React.FC<WithdrawalProcessorProps> = ({
    selectedWithdrawals,
    setSelectedWithdrawals,
    disabled = false,
    refuseFiat=false,
    setRefuseFiat
}) => {
    // --- STATE & HOOKS ---
    const { t } = useTranslation();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showRefuseModal, setShowRefuseModal] = useState(false);
    const [status, setStatus] = useState<TransactionStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [refuseMessage, setRefuseMessage] = useState("")
    const { isConnected, address } = useAccount();
    const { open } = useWeb3Modal();
    const [payWithdrawals] = usePayWithdrawalsMutation();
    const [refuseWithdrawals, { isLoading: isLoadingRefusing, isSuccess: isSuccessRefusing }] = useRefuseWithdrawalsMutation()

    // El hook 'useWriteContract' ahora también nos da una función 'reset' para reintentar.
    const { data: hash, isPending, error: writeError, writeContract, reset } = useWriteContract();

    // Obtenemos también el error del recibo, es importante para detectar el 'dropped'.
    const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({ hash });

    // --- MÁQUINA DE ESTADOS CENTRALIZADA ---
    useEffect(() => {
        const finalError = writeError || receiptError;
        if (finalError) {
            const message = (finalError as BaseError)?.shortMessage || finalError.message;
            if (message.includes('dropped') || message.includes('replaced')) {
                setStatus('dropped');
            } else {
                setStatus('error');
            }
            setErrorMessage(message);
            return;
        }
        if (isPending) {
            setStatus('waitingForWallet');
            return;
        }
        if (isConfirming) {
            setStatus('confirming');
            return;
        }
        if (hash) {
            setStatus('updatingBackend');
            const withdrawalIds = selectedWithdrawals.map(w => w.id);
            payWithdrawals({ withdrawalIds: withdrawalIds, hash: hash })
                .unwrap()
                .then(() => {
                    setStatus('success');
                    setSelectedWithdrawals([])
                    setTimeout(() => setShowConfirmModal(false), 2000); // Cierra el modal tras 2s de éxito
                })
                .catch((err) => {
                    setStatus('error');
                    setErrorMessage(`El pago en la blockchain fue exitoso (Hash: ${hash?.slice(0, 10)}...), pero falló la actualización en el servidor. Por favor, contacta a soporte.`);
                });
        }
    }, [isPending, isConfirming, isConfirmed, writeError, receiptError, hash, payWithdrawals, selectedWithdrawals, t]);

    // --- HANDLERS ---
    const handleInitiatePayment = () => {
        if (!isConnected) {
            open();
        } else {
            setStatus('idle');
            setErrorMessage(null);
            reset(); // Reseteamos el estado de la transacción anterior
            setShowConfirmModal(true);
        }
    };

    const handleRefusePayments = () => {
        setShowRefuseModal(true)
    };

    const handleConfirmPayment = () => {
        if (!CONTRACT_ADDRESS || !address) return;
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: distributeContractAbi,
            functionName: 'distributeUSDT',
            args: [
                selectedWithdrawals.map(w => w.wallet_address as Address),
                selectedWithdrawals.map(w => BigInt(Math.trunc(parseFloat(w.amount)))),
                selectedWithdrawals.map((withdrawal) => {
                    // Parte decimal convertida a BigInt
                    const amount = parseFloat(withdrawal.amount);
                    const decimalPart = (amount - Math.trunc(amount)).toFixed(3);
                    return BigInt(decimalPart * 1000); // Escala la parte decimal como BigInt (asumiendo 18 decimales)
                }),
            ],
            account: address
        });
    };

    const handleRefuseBackendPayments = () => {
        const withdrawalIds = selectedWithdrawals.map(w => w.id);
        refuseWithdrawals({ withdrawalIds: withdrawalIds, msg: refuseMessage })
    }

    const handleRetry = () => {
        setStatus('idle');
        setErrorMessage(null);
        reset(); // Resetea el estado del hook para permitir un nuevo intento
        handleConfirmPayment(); // Intenta la transacción de nuevo
    };

    const handleCloseModal = () => {
        if (status === 'confirming' || status === 'waitingForWallet' || status === 'updatingBackend') return;
        setShowConfirmModal(false);
    };

    const handleCloseRefuseModal = () => {
        setSelectedWithdrawals([])
        setRefuseFiat(false)
        setShowRefuseModal(false)
    };

    useEffect(() => {
        if(refuseFiat){
            handleRefusePayments()
        }
    }, [refuseFiat])

    // --- UI LOGIC ---
    const isProcessing = ['waitingForWallet', 'confirming', 'updatingBackend'].includes(status);

    const getAlert = () => {
        switch (status) {
            case 'success':
                return <Alert variant="success">{t('Pago completado exitosamente!')}</Alert>;
            case 'dropped':
                return <Alert variant="warning"><strong>{t('Transacción Descartada')}</strong>. {t('La red está congestionada o la tarifa de gas fue muy baja. Por favor, intenta de nuevo.')}</Alert>;
            case 'error':
                return <Alert variant="danger"><strong>{t('Error')}</strong>: {errorMessage}</Alert>;
            default:
                return null;
        }
    };

    const getFooter = () => {
        if (status === 'success') {
            return <Button variant="success" onClick={handleCloseModal}>{t('Hecho')}</Button>;
        }

        if (status === 'dropped' || status === 'error') {
            return (
                <div className='d-flex gap-4'>
                    <Button variant="secondary" onClick={handleCloseModal}>{t('Cerrar')}</Button>
                    <Button variant="primary" onClick={handleRetry}>{t('Reintentar Pago')}</Button>
                </div>
            );
        }

        return (
            <div className='d-flex gap-4'>
                <Button variant="secondary" onClick={handleCloseModal} disabled={isProcessing}>{t('Cancelar')}</Button>
                <Button variant="primary" onClick={handleConfirmPayment} disabled={isProcessing || !CONTRACT_ADDRESS}>
                    {isProcessing ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                    {status === 'waitingForWallet' && t('Esperando en la billetera...')}
                    {status === 'confirming' && t('Procesando transacción...')}
                    {status === 'updatingBackend' && t('Finalizando en servidor...')}
                    {status === 'idle' && t('Confirmar y Pagar')}
                </Button>
            </div>
        );
    };

   useEffect(() => {
    if(isSuccessRefusing){
        handleCloseRefuseModal()
    }
   }, [isSuccessRefusing])

    return (
        <div className='d-flex gap-4'>
            <Button onClick={handleInitiatePayment} disabled={disabled || selectedWithdrawals.length === 0}>
                {isConnected ? t('Pagar Retiros Seleccionados') : t('Conectar Billetera para Pagar')}
            </Button>
            <Button variant='danger' onClick={handleRefusePayments} disabled={disabled || selectedWithdrawals.length === 0} >
                Rechazar Retiros Seleccionados
            </Button>

            <Modal show={showConfirmModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('Confirmar Pago de Retiros')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {getAlert()}

                    <p>{t('Estás a punto de procesar los siguientes retiros a través de una transacción en la blockchain:')}</p>
                    <Table striped bordered hover size="sm" responsive>
                        <thead>
                            <tr>
                                <th>{t('Usuario')}</th>
                                <th>{t('Monto')}</th>
                                <th>{t('Dirección de Billetera')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedWithdrawals.map((w) => (
                                <tr key={w.id}>
                                    <td>{w.user || 'N/A'}</td>
                                    <td>${parseFloat(w.amount)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>{w.wallet_address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <p className="mt-3 text-end fw-bold">
                        {t('Monto Total a Pagar:')} ${
                            selectedWithdrawals.reduce((sum, w) => sum + parseFloat(w.amount || '0'), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        }
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    {getFooter()}
                </Modal.Footer>
            </Modal>
            <Modal show={showRefuseModal} onHide={handleCloseRefuseModal} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('Rechazar Retiros')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {getAlert()}

                    <p>{t('Estás a punto de rechazar los siguientes retiros con mensaje:')}</p>
                    <Table striped bordered hover size="sm" responsive>
                        <thead>
                            <tr>
                                <th>{t('Usuario')}</th>
                                <th>{t('Monto')}</th>
                                <th>{t('Dirección de Billetera')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedWithdrawals.map((w) => (
                                <tr key={w.id}>
                                    <td>{w.user || 'N/A'}</td>
                                    <td>${parseFloat(w.amount)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>{w.wallet_address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Form.Group className="my-5" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Mensaje de rechazo</Form.Label>
                        <Form.Control as="textarea" rows={3} value={refuseMessage} onChange={e => setRefuseMessage(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRefuseModal} disabled={isProcessing}>{t('Cancelar')}</Button>
                    <Button variant="primary" onClick={handleRefuseBackendPayments}>
                        Cancelar retiros
                        {isLoadingRefusing ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default WithdrawalProcessor;