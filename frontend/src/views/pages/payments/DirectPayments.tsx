import { useState } from 'react'
import { Pagination, Table } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useGetDirectPaymentsQuery } from '../../../store/api/payments/paymentsApiSlice'
import ControlledPagination from '../../../components/UiElements/Base/Pagination'

export default function DirectPayments() {

    const [page, setPage] = useState(1)

    const { t } = useTranslation()

    const { data: payments } = useGetDirectPaymentsQuery({ page: page.toString() })

    return (
        <div>
            <Table responsive bordered className='mt-4'>
                <thead>
                    <tr>
                        <th className='text-primary'>{t("Date")}</th>
                        <th className="text-primary">{t("User")}</th>
                        <th className="text-primary">{t("Investment")}</th>
                        <th className="text-primary">{t("Level")}</th>
                        <th className="text-primary text-end">{t("Amount")}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        payments?.results?.map((payment, indexPayment) => {
                            return (
                                <tr key={indexPayment}>
                                    <td><span className='fw-bold'>{new Date(payment.date).toLocaleString()}</span></td>
                                    <td className=''><span className='fw-bold'>{payment.user_username}</span><br /> {payment.user_email}</td>
                                    <td className=''><span className=''>${payment.investment_amount} USD</span></td>
                                    <td className=''><span className=''>{payment.level}</span></td>
                                    <td className='text-end'><span className='fw-bold'>${payment.amount} USD</span></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            {/* <Pagination className="mt-5">
                <Pagination.Prev  disabled={page == 1} onClick={() => setPage(page -1)} />
                {[...Array(payments?.total_pages)].map((_, index) => (
                    <Pagination.Item onClick={() => setPage(index + 1)} key={index}>{index + 1}</Pagination.Item>
                ))}
                <Pagination.Next  disabled={page == payments?.total_pages} onClick={() => setPage(page + 1)}  />
            </Pagination> */}
            <div className="d-flex justify-content-center">
                <ControlledPagination
                    currentPage={page}
                    totalPages={payments?.total_pages || 1}
                    onPageChange={setPage}
                />
            </div>
        </div>
    )
}
