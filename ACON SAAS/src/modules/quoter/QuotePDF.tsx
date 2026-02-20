import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import type { Quote } from './types';

// Standard fonts for corporate look
Font.register({
    family: 'Inter',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf', fontWeight: 400 },
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyfMZhrib2Bg-4.ttf', fontWeight: 700 },
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf', fontWeight: 800 },
    ]
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Inter',
        fontSize: 10,
        color: '#1C1C1E',
        backgroundColor: '#ffffff',
    },
    // PORTADA
    coverPage: {
        padding: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0A0A0B', // Deep Black
        color: '#ffffff',
    },
    logo: {
        width: 120,
        marginBottom: 40,
    },
    coverTitle: {
        fontSize: 32,
        fontWeight: 800,
        letterSpacing: -1.5,
        marginBottom: 10,
        color: '#FF6B00', // Orange
    },
    coverSubtitle: {
        fontSize: 11,
        opacity: 0.6,
        marginBottom: 60,
        textTransform: 'uppercase',
        letterSpacing: 4,
    },
    coverInfo: {
        alignItems: 'center',
        gap: 12,
    },
    coverText: {
        fontSize: 10,
        opacity: 0.8,
        color: '#EDEDED',
    },
    highlightLine: {
        width: 60,
        height: 4,
        backgroundColor: '#FF6B00',
        marginVertical: 25,
        borderRadius: 2,
    },

    // COMMON ELEMENTS
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1.5,
        borderBottomColor: '#FF6B00',
        paddingBottom: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 800,
        color: '#1C1C1E',
        marginBottom: 15,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    card: {
        backgroundColor: '#F9F9F9',
        padding: 20,
        borderRadius: 4,
        borderLeftWidth: 3,
        borderLeftColor: '#FF6B00',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        color: '#636366',
        fontWeight: 400,
    },
    value: {
        fontWeight: 700,
        color: '#1C1C1E',
    },

    // TABLE
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1C1C1E',
        padding: 10,
        borderRadius: 2,
    },
    tableHeaderText: {
        color: '#ffffff',
        fontWeight: 700,
        fontSize: 9,
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    totalSection: {
        marginTop: 30,
        paddingTop: 15,
        borderTopWidth: 2,
        borderTopColor: '#FF6B00',
        alignItems: 'flex-end',
    },
    totalAmountText: {
        fontSize: 20,
        fontWeight: 800,
        color: '#FF6B00',
    },
    acceptanceSeal: {
        position: 'absolute',
        top: 20,
        right: 40,
        borderWidth: 2,
        borderColor: '#FF6B00',
        color: '#FF6B00',
        padding: 8,
        borderRadius: 4,
        transform: 'rotate(-12deg)',
        fontSize: 10,
        fontWeight: 800,
        textTransform: 'uppercase',
    },
    signatureImg: {
        width: 160,
        height: 70,
        marginTop: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#D1D1D6',
    }
});

interface Props {
    quote: Quote;
    totals: {
        salePrice: number;
        profit: number;
        marginPct: number;
        salePricePresentation: number;
    };
}

export const QuotePDFDocument = ({ quote, totals }: Props) => (
    <Document title={`Cotización ${quote.id}`}>
        {/* PÁGINA 1 – PORTADA */}
        <Page size="A4" style={styles.coverPage}>
            <Text style={styles.coverSubtitle}>Operación Inteligente • ACON AI</Text>
            <Text style={styles.coverTitle}>ACON WORLDWIDE</Text>
            <View style={styles.highlightLine} />
            <Text style={{ fontSize: 18, fontWeight: 700, marginBottom: 40 }}>Cotización de Servicios</Text>

            {quote.status === 'accepted' && (
                <View style={styles.acceptanceSeal}>
                    <Text>ACEPTADA LEGALMENTE</Text>
                    <Text style={{ fontSize: 6, marginTop: 2 }}>{quote.acceptance?.timestamp}</Text>
                </View>
            )}

            <View style={styles.coverInfo}>
                <Text style={styles.coverText}>Folio: {quote.id}</Text>
                <Text style={styles.coverText}>Cliente: Industrial Heavy Machinery</Text>
                <Text style={styles.coverText}>Servicio: {quote.serviceType.toUpperCase()}</Text>
                <Text style={styles.coverText}>{quote.origin.name} → {quote.destination.name}</Text>
                <Text style={[styles.coverText, { marginTop: 20 }]}>Fecha de Emisión: {new Date().toLocaleDateString()}</Text>
            </View>
        </Page>

        {/* PÁGINA 2 – RESUMEN EJECUTIVO */}
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={{ fontWeight: 800, color: '#FF6B00' }}>ACON LOGISTICS</Text>
                <Text style={{ color: '#636366' }}>Folio: {quote.id}</Text>
            </View>

            <Text style={styles.sectionTitle}>Resumen Ejecutivo</Text>
            <View style={styles.card}>
                <Text style={{ fontSize: 11, lineHeight: 1.5, marginBottom: 20 }}>
                    Estimado cliente, presentamos nuestra propuesta comercial para la gestión coordinada de su carga.
                    Este servicio incluye la recolección, tramo internacional y despacho aduanal bajo términos {quote.incoterm}.
                </Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Tiempo Estimado de Tránsito:</Text>
                    <Text style={styles.value}>{quote.transitTimeDays} Días</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Incoterm Pactado:</Text>
                    <Text style={styles.value}>{quote.incoterm}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Validez de la Oferta:</Text>
                    <Text style={styles.value}>{quote.validityDays} Días</Text>
                </View>
            </View>

            <View style={[styles.card, { backgroundColor: '#FFF7F2', borderLeftColor: '#FF6B00' }]}>
                <View style={styles.row}>
                    <Text style={{ fontSize: 10, fontWeight: 700, color: '#1C1C1E' }}>PRECIO VENTAS (BASE USD)</Text>
                    <Text style={{ fontSize: 12, fontWeight: 700, color: '#FF6B00' }}>
                        ${totals.salePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Text>
                </View>
                {quote.presentationCurrency !== 'USD' && (
                    <>
                        <View style={{ height: 1, backgroundColor: '#FFDDC7', marginVertical: 10 }} />
                        <View style={styles.row}>
                            <Text style={{ fontSize: 12, fontWeight: 800 }}>TOTAL PROPUESTA ({quote.presentationCurrency})</Text>
                            <Text style={{ fontSize: 20, fontWeight: 800, color: '#FF6B00' }}>
                                {quote.presentationCurrency} ${totals.salePricePresentation.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </Text>
                        </View>
                        <Text style={{ fontSize: 8, color: '#636366', textAlign: 'right', marginTop: 5 }}>
                            Tipo de Cambio Aplicado: 1 USD = {quote.exchangeRate.rate} {quote.presentationCurrency}
                        </Text>
                    </>
                )}
            </View>
        </Page>

        {/* PÁGINA 3 – DESGLOSE DE COSTOS */}
        <Page size="A4" style={styles.page}>
            <Text style={styles.sectionTitle}>Desglose Profesional de Costos</Text>

            <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 3 }]}>CONCEPTO LOGÍSTICO</Text>
                <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>IMPORTE USD</Text>
            </View>

            <View style={styles.tableRow}>
                <Text style={{ flex: 3 }}>Flete Internacional ({quote.serviceType.toUpperCase()})</Text>
                <Text style={{ flex: 1, textAlign: 'right' }}>${quote.baseCosts.freight.toLocaleString()}</Text>
            </View>
            <View style={styles.tableRow}>
                <Text style={{ flex: 3 }}>Gastos y Maniobras en Origen</Text>
                <Text style={{ flex: 1, textAlign: 'right' }}>${quote.baseCosts.origin.toLocaleString()}</Text>
            </View>
            <View style={styles.tableRow}>
                <Text style={{ flex: 3 }}>Gastos y Maniobras en Destino</Text>
                <Text style={{ flex: 1, textAlign: 'right' }}>${quote.baseCosts.destination.toLocaleString()}</Text>
            </View>
            <View style={styles.tableRow}>
                <Text style={{ flex: 3 }}>Trámites Aduaneros y Honorarios</Text>
                <Text style={{ flex: 1, textAlign: 'right' }}>${quote.baseCosts.customs.toLocaleString()}</Text>
            </View>

            {quote.surcharges.map((s, i) => (
                <View key={i} style={styles.tableRow}>
                    <Text style={{ flex: 3 }}>{s.name}</Text>
                    <Text style={{ flex: 1, textAlign: 'right' }}>${s.amount.toLocaleString()}</Text>
                </View>
            ))}

            <View style={styles.totalSection}>
                <Text style={{ color: '#6b7280', marginBottom: 5 }}>SUBTOTAL SERVICIOS</Text>
                <Text style={styles.totalAmountText}>
                    ${totals.salePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                </Text>
            </View>
        </Page>

        {/* PÁGINA 4 – CONDICIONES COMERCIALES */}
        <Page size="A4" style={styles.page}>
            <Text style={styles.sectionTitle}>Condiciones Comerciales</Text>
            <View style={styles.card}>
                <Text style={{ fontWeight: 700, marginBottom: 8, fontSize: 9 }}>1. ALCANCE Y LIMITACIONES</Text>
                <Text style={{ marginBottom: 15, fontSize: 8, lineHeight: 1.4 }}>
                    Propuesta basada en las dimensiones y pesos proporcionados. Cualquier variación en la carga real podrá impactar el costo final.
                    Sujeto a inspección aduanal y disponibilidad de equipo.
                </Text>

                <Text style={{ fontWeight: 700, marginBottom: 8, fontSize: 9 }}>2. VIGENCIA OPERATIVA</Text>
                <Text style={{ marginBottom: 15, fontSize: 8, lineHeight: 1.4 }}>
                    Esta oferta comercial tiene una validez de {quote.validityDays} días naturales. Transcurrido este periodo, será necesaria una re-validación de tarifas con los carriers correspondientes.
                </Text>

                <Text style={{ fontWeight: 700, marginBottom: 8, fontSize: 9 }}>3. CONDICIONES DE PAGO</Text>
                <Text style={{ marginBottom: 15, fontSize: 8, lineHeight: 1.4 }}>
                    Pago total del flete previo a la liberación de documentos, a menos que exista un contrato de crédito vigente. Pagos en MXN se tomarán al tipo de cambio de venta del día de operación.
                </Text>

                <Text style={{ fontWeight: 700, marginBottom: 8, fontSize: 9 }}>4. CANCELACIONES</Text>
                <Text style={{ fontSize: 8, lineHeight: 1.4 }}>
                    Cancelaciones después de la confirmación de booking pueden generar cargos por "Dead Freight" de acuerdo a las políticas de la naviera o aerolínea.
                </Text>
            </View>
        </Page>

        {/* PÁGINA 5 – BLOQUE LEGAL Y DISCLAIMERS */}
        <Page size="A4" style={styles.page}>
            <Text style={styles.sectionTitle}>Blindaje Legal y Responsabilidad</Text>
            <View style={[styles.card, { backgroundColor: '#fef2f2', borderColor: '#fee2e2' }]}>
                <Text style={{ fontWeight: 800, color: '#991b1b', marginBottom: 15, fontSize: 10 }}>NOTAS LEGALES CRÍTICAS</Text>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontWeight: 700, fontSize: 9, marginBottom: 5 }}>LIMITACIÓN DE RESPONSABILIDAD</Text>
                    <Text style={{ fontSize: 8, lineHeight: 1.5 }}>
                        ACON LOGISTICS actúa únicamente como Agente de Carga Internacional (Intermediario) y su responsabilidad está limitada a los términos establecidos por la FIATA y las convenciones internacionales (Reglas de La Haya-Visby / Convenio de Montreal) según aplique.
                    </Text>
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontWeight: 700, fontSize: 9, marginBottom: 5 }}>DISCLAIMERS OPERATIVOS</Text>
                    <View style={{ gap: 5 }}>
                        <Text style={{ fontSize: 8 }}>• Tarifas sujetas a recargos variables del mercado (BAF, CAF, PSS).</Text>
                        <Text style={{ fontSize: 8 }}>• El tipo de cambio aplicado es informativo y se cerrará al momento de la facturación.</Text>
                        <Text style={{ fontSize: 8 }}>• No nos hacemos responsables por demoras causadas por terceros o autoridades aduanales.</Text>
                        <Text style={{ fontSize: 8 }}>• El seguro de carga no está incluido en esta cotización.</Text>
                        <Text style={{ fontSize: 8 }}>• Aceptación de esta cotización implica la aceptación de nuestros TyC globales.</Text>
                    </View>
                </View>

                <View>
                    <Text style={{ fontWeight: 700, fontSize: 9, marginBottom: 5 }}>LEGISLACIÓN APLICABLE</Text>
                    <Text style={{ fontSize: 8 }}>
                        Cualquier controversia será resuelta bajo la legislación mercantil de los Estados Unidos Mexicanos y ante los tribunales competentes de la Ciudad de México.
                    </Text>
                </View>
            </View>
        </Page>

        {/* PÁGINA 6 – DATOS DE CONTACTO */}
        <Page size="A4" style={styles.page}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.sectionTitle}>Contacto Comercial</Text>
                <View style={{ marginTop: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 800, color: '#FF6B00' }}>Enrique Cobian</Text>
                    <Text style={{ color: '#636366', marginBottom: 20 }}>Director Commercial • ACON LOGISTICS</Text>

                    <View style={{ gap: 8, alignItems: 'center' }}>
                        <Text style={{ fontSize: 10 }}>M: +52 1 55 1234 5678</Text>
                        <Text style={{ fontSize: 10 }}>E: comercial@acon-logistics.com</Text>
                        <Text style={{ fontSize: 10 }}>W: www.acon-logistics.com</Text>
                    </View>
                </View>

                <View style={{ marginTop: 60, padding: 30, borderTopWidth: 1, borderTopColor: '#e5e7eb', width: '100%', alignItems: 'center' }}>
                    <Text style={{ fontStyle: 'italic', color: '#9ca3af', textAlign: 'center' }}>
                        "Simplificando la logística global con transparencia y control total."
                    </Text>
                </View>
            </View>
        </Page>

        {/* PÁGINA 7 – EVIDENCIA DE ACEPTACIÓN DIGITAL */}
        {quote.status === 'accepted' && quote.acceptance && (
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionTitle}>Evidencia Detallada de Aceptación Digital</Text>

                <View style={[styles.card, { marginTop: 20 }]}>
                    <Text style={{ fontWeight: 800, marginBottom: 15 }}>DATOS DEL FIRMANTE</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nombre:</Text>
                        <Text style={styles.value}>{quote.acceptance.acceptedBy}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Cargo / Rol:</Text>
                        <Text style={styles.value}>{quote.acceptance.role}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Fecha y Hora:</Text>
                        <Text style={styles.value}>{new Date(quote.acceptance.timestamp).toLocaleString()}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={{ fontWeight: 800, marginBottom: 15 }}>METADATOS TÉCNICOS (AUDIOTRÍA)</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Dirección IP:</Text>
                        <Text style={styles.value}>{quote.acceptance.ip}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>ID de Transacción:</Text>
                        <Text style={styles.value}>{quote.id}-SIGNED</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Navegador:</Text>
                        <Text style={{ fontSize: 7, width: 200, textAlign: 'right' }}>{quote.acceptance.userAgent}</Text>
                    </View>
                </View>

                <View style={{ marginTop: 40, alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, fontWeight: 700, marginBottom: 10 }}>FIRMA DIGITAL REGISTRADA</Text>
                    {quote.acceptance.signature && (
                        <Image src={quote.acceptance.signature} style={styles.signatureImg} />
                    )}
                    <Text style={{ fontSize: 8, color: '#94a3b8', marginTop: 10 }}>
                        Este documento ha sido aceptado digitalmente y cuenta con validez contractual según las leyes de firma electrónica vigentes.
                        La alteración de este documento invalida su legitimidad.
                    </Text>
                </View>
            </Page>
        )}
    </Document>
);
