import { useState } from 'react'
import { Pagination, Table } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useGetBinaryPaymentsQuery } from '../../../store/api/payments/paymentsApiSlice'

export default function BinaryPayments() {

    const [page, setPage] = useState(1)

    const { t } = useTranslation()

    const {data: payments} = useGetBinaryPaymentsQuery({page: page})

    return (
        <div>
            <Table responsive bordered className='mt-4'>
                <thead>
                    <tr>
                        <th>{t("Date")}</th>
                        <th className="">{t("Left side")}</th>
                        <th className="">{t("Right side")}</th>
                        <th className="text-end">{t("Amount")}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        payments?.results?.map((payment, indexPayment) => {
                            return (
                                <tr key={indexPayment}>
                                    <td><span className='fw-bold'>{new Date(payment.date).toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}</span></td>
                                    <td className=''>{parseFloat(payment.left_points).toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}</td>
                                    <td className=''><span className=''>${parseFloat(payment.right_points).toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})} USD</span></td>
                                    <td className='text-end'><span className='fw-bold'>${parseFloat(payment.amount).toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})} USD</span></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
                <Pagination className="mb-0">
                    <Pagination.Prev disabled={page == 1} onClick={() => setPage(page -1)} />
                    {[...Array(payments?.total_pages)].map((_, index) => (
                        <Pagination.Item onClick={() => setPage(index + 1)} key={index}>{index + 1}</Pagination.Item>
                    ))}
                    <Pagination.Next  disabled={page == payments?.total_pages} onClick={() => setPage(page + 1)}  />
                </Pagination>
        </div>
    )
}
