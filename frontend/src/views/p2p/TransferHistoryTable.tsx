import React, { useState } from 'react';
import { Table, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useGetTransferHistoryQuery } from '../../store/api/transfers/apiTransfersSlice';
import { useGetUserQuery } from '../../store/api/auth/authApiSlice';
import ControlledPagination from '../../components/UiElements/Base/Pagination';

const TransferHistoryTable: React.FC = () => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    
    // Obtenemos el usuario actual para saber quién es en cada transacción
    const { data: currentUser } = useGetUserQuery({});
    const { data: historyData, isLoading, isError, isFetching } = useGetTransferHistoryQuery(currentPage);

    const getBadgeVariant = (type: string) => {
        if (type.includes('Utility')) return 'info';
        if (type.includes('Referral')) return 'primary';
        if (type.includes('Investment')) return 'success';
        return 'secondary';
    }

    if (isLoading) return <Spinner animation="border" />;
    if (isError) return <Alert variant="danger">{t("Failed to load transfer history.")}</Alert>;

    return (
        <Card>
            <Card.Header>
                <Card.Title>{t("Transfer History")}</Card.Title>
            </Card.Header>
            <Card.Body>
                {isFetching && <Spinner animation="border" size="sm" />}
                <Table responsive striped bordered hover>
                    <thead>
                        <tr>
                            <th>{t('Date')}</th>
                            <th>{t('Description')}</th>
                            <th>{t('Type')}</th>
                            <th className="text-end">{t('Amount')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyData?.results && historyData.results.length > 0 ? (
                            historyData.results.map(tx => {
                                const isSent = tx.sender_username === currentUser?.username;
                                return (
                                    <tr key={tx.id}>
                                        <td>{new Date(tx.timestamp).toLocaleString()}</td>
                                        <td>
                                            {isSent 
                                                ? <span>{t('Sent to')} <strong>@{tx.receiver_username}</strong></span>
                                                : <span>{t('Received from')} <strong>@{tx.sender_username}</strong></span>
                                            }
                                        </td>
                                        <td>
                                            <Badge bg={getBadgeVariant(tx.transfer_type_display)}>
                                                {t(tx.transfer_type_display)}
                                            </Badge>
                                        </td>
                                        <td className={`text-end fw-bold ${isSent ? 'text-danger' : 'text-success'}`}>
                                            {isSent ? '-' : '+'} ${parseFloat(tx.amount).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center">{t('No transfers found.')}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card.Body>
            {historyData && historyData.total_pages > 1 && (
                <Card.Footer className="d-flex justify-content-center">
                    <ControlledPagination 
                        currentPage={currentPage}
                        totalPages={historyData.total_pages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </Card.Footer>
            )}
        </Card>
    );
};

export default TransferHistoryTable;