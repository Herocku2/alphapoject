import React from 'react'
import TitleHelmet from '../../components/Common/TitleHelmet'
import { useTranslation } from 'react-i18next'
import { Card } from 'react-bootstrap'
import { useGetBinaryTreeQuery } from '../../store/api/tree/treeApiSlice'
import { OrgChartComponent } from './TreeChart/OrgChart'
import Loading from '../../components/Misc/Loading'

export default function BinaryTree() {

  const { t } = useTranslation()

  const { data: treeData, isLoading } = useGetBinaryTreeQuery()

  return (
    <div>
      <TitleHelmet title={t("My Unilevel Tree")} />
      <Card className="mb-4">
        <Card.Header className="py-3 pe-3 d-flex align-items-center justify-content-between">
          <div>
            <h4 className="fw-bold">{t("Network Marketing")}</h4>
            <p className="fs-13 text-muted mb-0">{t("Your Network Marketing.")}</p>
          </div>
        </Card.Header>
        <Card.Body>
          {
            isLoading ? (
              <Loading />
            ) : (treeData) && (
              <OrgChartComponent data={treeData} />
            )
          }

        </Card.Body>
      </Card>
    </div>
  )
}
