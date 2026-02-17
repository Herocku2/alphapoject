import { Col, Row } from 'react-bootstrap'
import PageDashBreadcrumb from '../../components/Common/PageDashBreadcrumb'
import { AnalyticProgress, AnalyticPromoAction, BrowserUsed, CampaignState, SalesLocation, SessionDevice, StatisticsMiniCard, VisitorsOverview } from '../../components/Dashboards/Analytics'


const Analytics = () => {
  return (
    <div>
      <PageDashBreadcrumb title="Analytics" subName="Dashboards" />
      <Row className="g-3 g-md-4">
        <Col xl={12}>
          <StatisticsMiniCard />
        </Col>
        <Col xl={8}>
          <VisitorsOverview />
        </Col>
        <Col xl={4}>
          <AnalyticPromoAction />
        </Col>
        <Col xl={4}>
          <SessionDevice />
        </Col>
        <Col xl={8}>
          <CampaignState />
        </Col>
        <Col xl={4}>
          <BrowserUsed />
        </Col>
        <Col xl={4}>
          <SalesLocation />
        </Col>
        <Col xl={4}>
          <AnalyticProgress />
        </Col>
      </Row>
    </div>
  )
}

export default Analytics
