import { Container, Card, Row, Col } from 'react-bootstrap';


const VerificationSent = () => {
    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col >
                    <Card.Body className='text-center' >
                        <i className="fi fi-br-check text-primary" style={{ fontSize: '60px', color: 'green', marginBottom: '1rem' }}></i>                            <Card.Title as="h2">¡Ya casi está listo!</Card.Title>
                        <Card.Text className="mt-3">
                            Te hemos enviado un correo electrónico de verificación.
                        </Card.Text>
                        <Card.Text>
                            Por favor, haz clic en el enlace que encontrarás en el correo para activar tu cuenta.
                        </Card.Text>
                        <small className="text-muted">
                            Si no lo encuentras, revisa tu carpeta de spam.
                        </small>
                    </Card.Body>
                </Col>
            </Row>
        </Container>
    );
};

export default VerificationSent;