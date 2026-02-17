import { Pagination, Table } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useGetInvestmentHistoryQuery } from '../../../store/api/investment_plans/plansApiSlice'
import ControlledPagination from '../../../components/UiElements/Base/Pagination'

export default function DeposistsTable() {

    const { t } = useTranslation()
    const [page, setPage] = useState(1)

    const { data: history } = useGetInvestmentHistoryQuery({ page: page.toString() })


    return (
        <div className="">
            {/* <ButtonWithLink label={t("Copy link")} link={`https://office.capitalmarket.app/auth/register/${user?.ref_code}`}
                onClick={() => copyLink()} /> */}


            <Table responsive bordered className='mt-4'>
                <thead>
                    <tr>
                        <th className='text-primary'>{t("Date")}</th>
                        <th className="text-primary text-primary">{t("Amount")}</th>
                        <th className="text-primary">{t("Withdrawn")}</th>
                        <th className="text-primary">{t("Payment method")}</th>
                        <th className="text-primary text-end">{t("New investment value")}</th>
                         <th className="text-primary">{t("Hash")}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        history?.results?.map((history, indexPayment) => {

                            return (
                                <tr key={indexPayment}>
                                    <td><span className='fw-bold'>{new Date(history.date).toLocaleString()}</span></td>
                                    <td><span className=''>${history.amount.toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})} USD</span></td>
                                    <td><span className=''>${history.withdrawn_from_deposit.toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})} USD</span></td>

                                    <td><span className=''>{history.pay_with_balance ? t("Paid with balance") : t("USDT BEP20")}</span></td>
                                    <td className='text-end'><span className=''>${history.before_investment_value.toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})} USD</span></td>
                                     <td className='text-end'>
                                        {history.coinpayments_response?.information?.transaction_hash ? (
                                            <a href={"https://bscscan.com/tx/0x"+history.coinpayments_response?.information?.transaction_hash} target='_blank' className='text-primary'>{t("View")}</a>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            {/* <Pagination className="mb-0">
                <Pagination.Prev disabled={page == 1} onClick={() => setPage(page - 1)} />
                {[...Array(history?.total_pages)].map((_, index) => (
                    <Pagination.Item onClick={() => setPage(index + 1)} key={index}>{index + 1}</Pagination.Item>
                ))}
                <Pagination.Next disabled={page == history?.total_pages} onClick={() => setPage(page + 1)} />
            </Pagination> */}

             <div className="d-flex justify-content-center">
                <ControlledPagination
                    currentPage={page}
                    totalPages={history?.total_pages || 1}
                    onPageChange={setPage}
                />
            </div>
        </div>
    )
}
