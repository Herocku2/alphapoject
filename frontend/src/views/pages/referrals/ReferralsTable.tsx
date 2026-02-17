import { Pagination, Table } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useGetReferralsQuery } from '../../../store/api/tree/treeApiSlice'
import ButtonWithLink from '../../../components/UiElements/Base/Buttons/ButtonWithLink'
import { useGetUserQuery } from '../../../store/api/auth/authApiSlice'
import { useState } from 'react'
import { copiarTexto } from '../../dashboards'
import ControlledPagination from '../../../components/UiElements/Base/Pagination'
export default function ReferralsTable() {

    const { t } = useTranslation()
    const [page, setPage] = useState(1)
    const { data: referrals } = useGetReferralsQuery({ page: page.toString() })
    const { data: user } = useGetUserQuery()

    function copyLink() {
        copiarTexto(`https://app.smartsolution.fund/auth/register/${user?.ref_code}`, t("Link copied"))

    }



    return (
        <div className="">
            <ButtonWithLink label={t("Copy link")} link={`https://app.smartsolution.fund/auth/register/${user?.ref_code}`}
                onClick={() => copyLink()} />
            <Table responsive bordered className='mt-4'>
                <thead>
                    <tr>
                        <th className='text-primary'>{t("User")}</th>
                        <th className="text-primary">{t("Phone")}</th>
                        <th className="text-primary">{t("Registration date")}</th>
                        <th className="text-primary">{t("Status")}</th>
                        {/* {
                            user?.is_fundator && (
                                <th className="text-end">{t("Actions")}</th>
                            )
                        } */}

                    </tr>
                </thead>
                <tbody>
                    {
                        referrals?.results?.map((referral, indexReferral) => {
                            return (
                                <tr key={indexReferral}>
                                    <td><span className='fw-bold'>{referral.referred_username}</span><br /> {referral.referred_email}</td>
                                    <td className="">{referral.referred_phone_number || t("No phone number")}</td>
                                    <td className="text-dark ">{new Date(referral.date).toLocaleDateString()}</td>
                                    <td className="text-dark fw-semibold ">{referral.status ? t("Active") : t("Inactive")}</td>


                                    {/* {
                                        (user?.is_fundator) && (
                                            (!referral.is_master_code) ? (
                                                <td className="text-dark fw-semibold text-end">
                                                    <Button onClick={() => handleOpenMasterConfirmation(referral.id)}>
                                                        {isLoading ? (
                                                            <div>
                                                                <span
                                                                    className="spinner-border spinner-border-sm me-2"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                ></span>
                                                                Loading...
                                                            </div>) : (
                                                            <div>
                                                                {t("Make master")}
                                                            </div>
                                                        )}
                                                    </Button>
                                                </td>
                                            ) : (
                                                <td className="text-dark fw-semibold text-end">
                                                    <span>{t("Master code activated!")}</span>
                                                </td>
                                            )
                                        )
                                    } */}

                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            {/* <Pagination className="mt-5">
                <Pagination.Prev disabled={page == 1} onClick={() => setPage(page - 1)} />
                {[...Array(referrals?.total_pages)].map((_, index) => (
                    <Pagination.Item onClick={() => setPage(index + 1)} key={index}>{index + 1}</Pagination.Item>
                ))}
                <Pagination.Next disabled={page == referrals?.total_pages} onClick={() => setPage(page + 1)} />
            </Pagination> */}

            <div className="d-flex justify-content-center">
                <ControlledPagination
                    currentPage={page}
                    totalPages={referrals?.total_pages || 1}
                    onPageChange={setPage}
                />
            </div>
        </div>
    )
}
