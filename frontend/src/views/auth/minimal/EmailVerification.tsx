import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; // Asegúrate de tener axios instalado: npm install axios
import TitleHelmet from '../../../components/Common/TitleHelmet';
import AuthLayout from '../../../Layouts/AuthLayout';
import AuthMinmal from './AuthMinmal';

const EmailVerification = () => {
    // Obtenemos el código de la URL (ej: /verify-email/CODIGO_UUID)
    const { verificationCode } = useParams();

    // Estados para manejar la UI
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Estamos verificando tu cuenta, por favor espera...');
    const [verified, setVerified] = useState(false)

    useEffect(() => {
        if (verificationCode && !verified) {
            const verifyEmail = async () => {
                try {
                    setVerified(() => true)
                    // Reemplaza con la URL de tu API de verificación
                    const apiUrl = `${import.meta.env.VITE_BACKEND_DOMAIN}auth/verify-email/`;

                    const response = await axios.post(apiUrl, { code: verificationCode });

                    setStatus('success');
                    setMessage(response.data.detail || '¡Tu cuenta ha sido verificada con éxito!');

                } catch (error) {
                    setStatus('error');
                    const errorMessage = error.response?.data?.detail || 'Ocurrió un error al verificar tu cuenta. El enlace puede haber expirado o ser inválido.';
                    setMessage(errorMessage);
                }
            };

            verifyEmail();
        } else {
            setStatus('error');
            setMessage('No se proporcionó un código de verificación.');
        }
        // El efecto se ejecuta solo una vez cuando el componente se monta
    }, [verificationCode]);


    return (
        <div>
            <TitleHelmet title={"Verificación de email"} />
            <AuthLayout>
                <AuthMinmal>
                    <Container className="mt-5">
                        <Row className="justify-content-md-center">
                            <Card.Body>
                                <Card.Title as="h3" className="mb-4">Estado de la Verificación</Card.Title>

                                {status === 'verifying' && (
                                    <>
                                        <Spinner animation="border" variant="primary" className="mb-3" />
                                        <p>{message}</p>
                                    </>
                                )}

                                {status === 'success' && (
                                    <Alert variant="success">
                                        <Alert.Heading>¡Verificación Exitosa!</Alert.Heading>
                                        <p>{message}</p>
                                        <hr />
                                        <div className="d-flex justify-content-center">
                                            <Button as={Link} to="/auth/login" variant="outline-success">
                                                Ir a Iniciar Sesión
                                            </Button>
                                        </div>
                                    </Alert>
                                )}

                                {status === 'error' && (
                                    <Alert variant="danger">
                                        <Alert.Heading>Error de Verificación</Alert.Heading>
                                        <p>{message}</p>
                                    </Alert>
                                )}
                            </Card.Body>
                        </Row>
                    </Container>
                </AuthMinmal>
            </AuthLayout>
        </div>
    );
};

export default EmailVerification;