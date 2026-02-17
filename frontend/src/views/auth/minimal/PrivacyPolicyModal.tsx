
import { Modal, Button } from 'react-bootstrap'

function PoliticaPrivacidadModal({show, setShow}) {

  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    e.preventDefault(); // Evita que el enlace recargue la página
    setShow(true);
  };

  return (
    <>
      {/* Este es el enlace que abrirá el modal */}
      <a href="#" onClick={handleShow}>
        Política de Privacidad
      </a>

      <Modal show={show} onHide={handleClose} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Política de Privacidad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Fecha de entrada en vigor:</strong> 22/07/2025</p>

          <h6>1) Responsable y contacto</h6>
          <p>
            Smart Solution (operador digital; ver Términos) es responsable del tratamiento de datos en relación con la Plataforma.
            <br />
            <strong>Email de contacto:</strong> smart21trading.solution@gmail.com
          </p>

          <h6>2) Datos que recolectamos</h6>
          <ul>
            <li><strong>Identificación y contacto:</strong> nombre, email, teléfono (si aplica), país.</li>
            <li><strong>Cuenta y verificación:</strong> credenciales, 2FA, documentos KYC/AML (si se solicitan).</li>
            <li><strong>Financieros/operativos:</strong> historial de depósitos/retiros (p. ej., USDT/BSC), direcciones de wallet, transacciones, registros de auditoría.</li>
            <li><strong>Técnicos:</strong> IP, identificadores de dispositivo, logs, cookies y analytics.</li>
            <li><strong>Soporte y marketing:</strong> comunicaciones, encuestas, referidos.</li>
          </ul>

          <h6>3) Finalidades y bases legales</h6>
          <ul>
            <li><strong>Prestar el servicio</strong> (gestión de cuenta, panel, integración con MT5 o proveedores), ejecución del contrato y legítimo interés.</li>
            <li><strong>Seguridad y fraude:</strong> autenticación, 2FA, detección y prevención (cumplimiento AML/KYC), obligación legal y legítimo interés.</li>
            <li><strong>Atención al cliente y comunicación operativa</strong> (notificaciones de cambios, mantenimiento), ejecución del contrato.</li>
            <li><strong>Mejora de producto y analítica</strong> (logs, cookies, medición), legítimo interés.</li>
            <li><strong>Marketing responsable</strong> (educación financiera, transparencia, contenido verificado; exclusión de “dinero rápido”), consentimiento cuando lo exija la ley.</li>
          </ul>
          
          <h6>4) Cookies y tecnologías similares</h6>
          <p>
            Usamos cookies estrictamente necesarias, analíticas y de funcionalidad. Podrás configurar preferencias desde el banner o ajustes del navegador. Bloquear cookies puede impactar el funcionamiento.
          </p>

          <h6>5) Fuentes y exactitud</h6>
          <p>
            Los datos se obtienen directamente del usuario (registro, KYC, soporte) y de manera automática (logs, cookies). Eres responsable de que la información sea exacta y actual.
          </p>

          <h6>6) Transferencias y terceros</h6>
          <p>Podemos compartir datos con proveedores que nos apoyan en:</p>
          <ul>
            <li>Infraestructura y seguridad (hosting, monitoreo, DDoS, 2FA).</li>
            <li>Pagos/cripto y brókers de terceros (p.ej., integración con Exness u otros proveedores regulados) para enrutamiento/visualización de operaciones y conciliaciones.</li>
            <li>Analítica y marketing responsable (sin vender datos; campañas centradas en educación y transparencia).</li>
          </ul>
          <p>
            Firmamos acuerdos de tratamiento de datos con proveedores, imponiendo confidencialidad y medidas de seguridad adecuadas. Algunas transferencias pueden implicar salidas internacionales; en tal caso, aplicaremos salvaguardas (cláusulas contractuales tipo u otros mecanismos admitidos).
          </p>
          
          <h6>7) Conservación</h6>
          <p>Conservamos datos mientras la cuenta esté activa y por el tiempo adicional necesario para:</p>
          <ul>
            <li>Cumplimientos legales/contables/AML;</li>
            <li>Gestión de reclamos;</li>
            <li>Defensa de derechos.</li>
          </ul>
          <p>Posteriormente, anonimizamos o eliminamos de forma segura.</p>

          <h6>8) Seguridad</h6>
          <p>
            Aplicamos controles de seguridad por capas, incluyendo 2FA, cifrado en tránsito, registros de auditoría y segregación por roles. Aun así, ningún sistema es infalible; te pedimos cooperación (buenas prácticas, dispositivos actualizados, resguardo de claves).
          </p>

          <h6>9) Tus derechos de privacidad</h6>
          <p>
            Dependiendo de tu jurisdicción, puedes tener derechos de acceso, rectificación, actualización, portabilidad, oposición, limitación y supresión.
          </p>
          <p>
            Puedes ejercerlos escribiendo a smart21trading.solution@gmail.com desde el correo asociado a tu cuenta. Procesaremos la solicitud en plazos razonables, verificando identidad y evaluando excepciones legales (p. ej., retención por AML).
          </p>

          <h6>10) Menores</h6>
          <p>
            La Plataforma no está dirigida a menores. Si detectamos cuentas de menores, procederemos a cerrarlas y borrar datos no necesarios.
          </p>

          <h6>11) Marketing responsable y comunicaciones</h6>
          <p>
            Respetaremos tus preferencias. Podrás optar por no recibir comunicaciones promocionales. Nuestro marketing se centra en educación, prueba de resultados y transparencia; evitamos claims prohibidos (p. ej., “hazte rico sin esfuerzo”).
          </p>

          <h6>12) Cambios a esta Política</h6>
          <p>
            Podremos actualizar esta Política para reflejar cambios operativos, legales o de seguridad. Notificaremos por medios razonables (panel, email) cuando el cambio sea sustancial. La versión vigente mostrará la fecha de entrada en vigor.
          </p>

          <h6>13) Contacto</h6>
          <p>Para preguntas sobre privacidad: smart21trading.solution@gmail.com.</p>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PoliticaPrivacidadModal;