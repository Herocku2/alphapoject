import { useState } from 'react'
import { Pagination, Table } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import {  useGetBinaryPointsQuery } from '../../../store/api/payments/paymentsApiSlice'

export default function BinaryPoints() {

    const [page, setPage] = useState(1)

    const { t } = useTranslation()

    const {data: payments} = useGetBinaryPointsQuery({page: page})

    return (
        <div>
            <Table responsive bordered className='mt-4'>
                <thead>
                    <tr>
                        <th>{t("Date")}</th>
                        <th className="">{t("Points")}</th>
                        <th className="">{t("Side")}</th>
                        <th className="">{t("Level")}</th>
                        <th className="text-end">{t("Detail")}</th>
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
                                    <td className=''>{parseFloat(payment.points).toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}</td>
                                    <td className=''><span className=''>{payment.side}</span></td>
                                    <td className=''><span className='fw-bold'>{payment.level}</span></td>
                                    <td className='text-end'><span className='fw-bold'>{payment.detail}</span></td>
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
                    <Pagination.Next disabled={page == payments?.total_pages} onClick={() => setPage(page + 1)} />
                </Pagination>
        </div>
    )
}
