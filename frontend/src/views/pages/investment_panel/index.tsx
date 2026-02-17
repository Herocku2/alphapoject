import React from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import {  Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartData,
  ChartOptions,
  BarElement
} from 'chart.js';

// Asumo que la siguiente importación viene de tu archivo de API generado por RTK Query

// Importa la estructura de datos que definimos antes
import { useGetInvestmentPanelQuery } from '../../../store/api/investment_plans/plansApiSlice';
import { useTranslation } from 'react-i18next';

// --- Registro de Chart.js (solo se hace una vez) ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

// --- Componente ---
const InvestmentDashboard: React.FC = () => {
  // Función de traducción (puedes usar tu hook de i18n aquí)
  const { t } = useTranslation()

  // 1. LLAMADA AL HOOK DE RTK QUERY
  // Obtenemos no solo 'data', sino también los estados de la petición
  const { data, isLoading, isError } = useGetInvestmentPanelQuery();

  // 2. MANEJO DEL ESTADO DE CARGA
  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="info" />
        <span className="ms-3">{t('Loading data...')}</span>
      </Container>
    );
  }

  // 3. MANEJO DEL ESTADO DE ERROR
  if (isError) {
    return (
      <Container className="pt-4">
        <Alert variant="danger">
          <Alert.Heading>{t('An error occurred')}</Alert.Heading>
          <p>{t('Could not fetch dashboard data. Please try again later.')}</p>
        </Alert>
      </Container>
    );
  }

  // 4. MANEJO DE DATOS NO DISPONIBLES (si la API devuelve null o undefined)
  if (!data) {
    return (
      <Container className="pt-4">
        <Alert variant="warning">{t('No data available to display.')}</Alert>
      </Container>
    );
  }

  // 5. SI HAY DATOS, CALCULAMOS VALORES DERIVADOS Y RENDERIZAMOS
  const { totalInvestments, totalInvestors, chartData: apiChartData, all_withdrawals_sum } = data;

  const averageInvestment: number = totalInvestors > 0 ? totalInvestments / totalInvestors : 0;

  const chartData: ChartData<'bar'> = {
    labels: apiChartData.labels.map(label => t(label)), // Traduce los labels si es necesario
    datasets: [
      {
        label: t('Investment Growth ($)'),
        data: apiChartData.data,
        backgroundColor: '#e49e3d',
        borderColor: '#e49e3d',
      },
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: t('Investment Evolution Over Time') },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }

  };

  return (
    <Container >
      <h2 className="mb-4">{t('Investment Dashboard')}</h2>

      <Row className="mb-4">
        <Col md={3} className="mb-3 mb-md-0">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>{t('Total Amount Invested')}</Card.Title>
              <Card.Text className="fs-2 fw-bold text-primary">
                ${new Intl.NumberFormat('en-US').format(totalInvestments)}
              </Card.Text>
              <Card.Text className="text-muted">{t('Total capital on the platform.')}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3 mb-md-0">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>{t('Total Investors')}</Card.Title>
              <Card.Text className="fs-2 fw-bold">{totalInvestors}</Card.Text>
              <Card.Text className="text-muted">{t('People who have placed their trust in us.')}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3 mb-md-0">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>{t('Average Investment')}</Card.Title>
              <Card.Text className="fs-2 fw-bold">
                ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(averageInvestment)}
              </Card.Text>
              <Card.Text className="text-muted">{t('Average amount invested per user.')}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-md-0">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>{t('Paid')}</Card.Title>
              <Card.Text className="fs-2 fw-bold">
                ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(all_withdrawals_sum)}
              </Card.Text>
              <Card.Text className="text-muted">{t('All investment paid.')}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col className="mb-3 mb-lg-0 ">
          <Card className="shadow-sm h-100" style={{ minHeight: '600px' }}>
            <Card.Body className="d-flex align-items-center">
              <div style={{ width: '100%', height: '100%' }}>
                <Bar  options={chartOptions} data={chartData} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InvestmentDashboard;