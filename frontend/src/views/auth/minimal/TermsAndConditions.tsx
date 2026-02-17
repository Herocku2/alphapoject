
import { Modal, Button } from 'react-bootstrap';

function TerminosCondicionesModal({show, setShow}) {

  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    e.preventDefault(); // Evita que el enlace recargue la página
    setShow(true);
  };

  return (
    <>
      {/* Este es el enlace que abrirá el modal */}
      <a href="#" onClick={handleShow}>
        Términos y Condiciones
      </a>

      <Modal show={show} onHide={handleClose} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Términos y Condiciones de Uso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Fecha de entrada en vigor:</strong> 22/07/2025</p>

          <h6>1) Quiénes somos y alcance</h6>
          <p>
            Smart Solution (“Smart Solution”, “nosotros”, “nuestro/a/s”) es una plataforma digital orientada a la gestión y automatización de estrategias de inversión con foco en transparencia y seguridad. Operamos exclusivamente en línea y no somos un banco, entidad de crédito, asesor financiero registrado ni bróker. La ejecución de operaciones puede realizarse a través de proveedores y brókers regulados de terceros (p.ej., Exness Technologies Ltd), lo cual no significa que Smart Solution esté regulada ni que preste servicios propios de bróker. Este detalle operativo puede variar según disponibilidad y evaluación de riesgo de proveedores.
          </p>
          <p>
            Estos Términos regulan el acceso y uso del sitio, panel, aplicaciones, API y demás servicios (conjuntamente, la “Plataforma”). Al crear una cuenta, marcar “Acepto los Términos y Condiciones” y/o utilizar la Plataforma, aceptas íntegramente estos Términos.
          </p>
          <p><strong>Contacto:</strong> smart21trading.solution@gmail.com</p>

          <h6>2) Elegibilidad y restricciones geográficas</h6>
          <p>Debes ser mayor de edad según tu jurisdicción y tener capacidad legal. No puedes usar la Plataforma si:</p>
          <ul>
            <li>Estás en una jurisdicción restringida o sancionada (OFAC u otras listas);</li>
            <li>El uso del servicio te sería ilegal según las leyes locales; o</li>
            <li>Has sido suspendido o bloqueado previamente por incumplimientos.</li>
          </ul>
          <p>Eres responsable de verificar y cumplir las normas de tu país antes de usar la Plataforma.</p>
          
          <h6>3) Registro de cuenta y seguridad</h6>
          <p>Para usar funciones principales debes registrarte, proporcionar información veraz y mantenerla actualizada. Eres responsable de:</p>
          <ul>
            <li>Mantener la confidencialidad de credenciales;</li>
            <li>Activar y usar autenticación de dos factores (2FA);</li>
            <li>Notificarnos de inmediato ante accesos no autorizados;</li>
            <li>Tomar medidas razonables de ciberseguridad (dispositivos, redes, antivirus, etc.).</li>
          </ul>
          <p>Podemos requerir verificaciones adicionales (KYC/AML) y limitar, suspender o cerrar cuentas si detectamos riesgos de fraude, incumplimiento o uso indebido.</p>

          <h6>4) Naturaleza del servicio (información importante)</h6>
          <ul>
            <li>Smart Solution no presta asesoría financiera personalizada ni recomendaciones individualizadas.</li>
            <li>Cualquier información de rendimiento, reportes o estadísticas tiene fines meramente informativos y no garantiza resultados futuros.</li>
            <li>El enfoque de marca exige transparencia, datos verificables y educación financiera, evitando promesas de “dinero rápido” o “enriquecimiento sin esfuerzo”.</li>
            <li>En algunos casos, podrás visualizar operaciones en tiempo real vía MetaTrader 5 (MT5) provistas por terceros integrados.</li>
          </ul>

          <h6>5) Depósitos, retiros y saldos</h6>
          <p><strong>5.1 Monedas admitidas y red</strong><br/>
          Los depósitos y retiros se realizan, de forma principal, en USDT a través de la red BSC (BEP-20). El uso de otras monedas o redes podrá habilitarse o suspenderse en cualquier momento por razones operativas o de riesgo.</p>
          <p><strong>5.2 Mínimos operativos</strong><br/>
          El monto mínimo para depositar y retirar es, por regla general, 10 USD (o equivalente). Los montos mínimos pueden ajustarse por cambios de red, costos o condiciones de mercado; cualquier cambio se reflejará en la Plataforma/FAQ.</p>
          <p><strong>5.3 Costos, comisiones y “gas”</strong><br/>
          Podrían aplicar comisiones de red, cargos de terceros, “gas fees” y costos operativos. Es tu obligación confirmar dirección/red correctas y estimar costos antes de enviar. Las transacciones en blockchain son irreversibles: si envías a una dirección o red incorrecta, es probable que no podamos recuperar los fondos.</p>
          <p><strong>5.4 Disponibilidad de retiros y plazos</strong><br/>
          Para proteger a los usuarios y la estrategia, los retiros pueden estar sujetos a ventanas, colas operativas, validaciones de seguridad y tiempos razonables de procesamiento. En casos excepcionales (congestión de red, mantenimiento, riesgos AML, eventos de mercado) podremos retrasar o fraccionar retiros para preservar la integridad operacional.</p>
          <p><strong>5.5 Congelamientos preventivos</strong><br/>
          Podremos retener temporalmente fondos ante señales de fraude, suplantación, lavado de dinero, errores de red/dirección o requerimientos legales.</p>
          
          {/* ... (resto de las secciones) ... */}

          <h6>17) Comunicaciones electrónicas y soporte</h6>
          <p>Aceptas recibir comunicaciones electrónicas (panel, email, notificaciones). Para soporte: smart21trading.solution@gmail.com.</p>
          {/* El resto del texto se ha omitido por brevedad, pero seguiría la misma estructura de etiquetas <h6> y <p> */}
          
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

export default TerminosCondicionesModal;