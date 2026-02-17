import React, { useState } from 'react';
import { Card, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData
} from 'chart.js';

// Importa el hook y el tipo desde tu archivo de API
import { useGetMonthlyEarningsQuery } from '../../../store/api/payments/paymentsApiSlice'; // <-- Ajusta esta ruta

// Registra los elementos necesarios para el gráfico de barras
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyPaymentChart: React.FC = () => {
    const currentYear = new Date().getFullYear();

    // 1. ESTADO PARA EL AÑO SELECCIONADO
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    // 2. LLAMADA AL HOOK CON EL AÑO SELECCIONADO
    // 'isFetching' es útil para mostrar un indicador de carga al cambiar de año
    const { data: earningsData, isLoading, isError, isFetching } = useGetMonthlyEarningsQuery(selectedYear);

    // Genera una lista de años para el dropdown
    const years: number[] = [];
    for (let year = currentYear; year >= 2022; year--) { // Puedes ajustar el año de inicio
        years.push(year);
    }

    // 3. CONFIGURACIÓN DEL GRÁFICO (solo si hay datos)
    const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: `Rendimiento Mensual (% de Ganancia) en ${selectedYear}`,
                font: { size: 16 }
            },
            // 3. TOOLTIP FORMATEADO CON '%'
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            // Formatea a 2 decimales y añade el símbolo de %
                            label += `${context.parsed.y.toFixed(2)}%`;
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                // 4. EJE Y FORMATEADO CON '%'
                ticks: {
                    callback: (value) => `${value}%`,
                    color:"#fff"
                }
            },
            x: {
                ticks: {
                    font: {
                        weight: 'normal' // El eje X puede tener una fuente normal para no saturar
                    },
                    color:"#fff"
                }
            }
        },
    };

    const chartData: ChartData<'bar'> = {
        labels: earningsData?.map(d => d.month) || [],
        datasets: [
            {
                label: 'Ganancias',
                data: earningsData?.map(d => d.summed_percentage) || [],
                backgroundColor: '#e49e3d',
                borderColor: '#e49e3d',
                borderWidth: 1,
            },
        ],
    };

    // 4. FUNCIÓN PARA MANEJAR EL CAMBIO DE AÑO
    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(Number(event.target.value));
    };

    // 5. RENDERIZADO DEL COMPONENTE
    return (
        <div className=" h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Reporte de Ganancias</h5>
                <Form.Group as={Row} controlId="year-select" className="mb-0 align-items-center">
                    <Form.Label column sm="auto" className="pe-2">Año:</Form.Label>
                    <Col>
                        <Form.Select value={selectedYear} onChange={handleYearChange} size="sm">
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </Form.Select>
                    </Col>
                </Form.Group>
            </Card.Header>
            <Card.Body style={{ minHeight: '400px', position: 'relative' }}>
                {isLoading && (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <Spinner animation="border" variant="primary" />
                    </div>
                )}
                {isError && (
                    <Alert variant="danger">No se pudieron cargar los datos.</Alert>
                )}
                {!isLoading && !isError && (
                    <>
                        {isFetching && (
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.5)', zIndex: 10 }} className="d-flex justify-content-center align-items-center">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        )}
                        {earningsData && earningsData.length > 0 ? (
                            <div  style={{ height: '50dvh', width: '100%' }}>
                                <Bar options={chartOptions} data={chartData} />
                            </div>
                        ) : (
                            <div className="d-flex justify-content-center align-items-center h-100">
                                <p className="text-muted">No hay datos de ganancias para el año {selectedYear}.</p>
                            </div>
                        )}
                    </>
                )}
            </Card.Body>
        </div>
    );
};

export default MonthlyPaymentChart;