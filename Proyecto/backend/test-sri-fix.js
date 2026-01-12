
import { SriService } from './src/services/sri.service.js';
import axios from 'axios';
import { ConfiguracionSri } from './src/models/index.js';

// Mock simple para probar la lógica sin pegarle al SRI real ni a la BD
async function testSriReception() {
    console.log('--- Iniciando Prueba de Recepción SRI ---');

    const sriService = new SriService();

    // Forzamos el modo mock de la clase para evitar errores de certificado en esta prueba unitaria
    sriService.modoMock = false;

    // Mockeamos ConfiguracionSri.findOne
    ConfiguracionSri.findOne = async () => ({
        url_recepcion: 'https://test-sri.example.com/recepcion',
        activo: true
    });

    // Mockeamos axios.post para ver qué se envía
    const originalPost = axios.post;
    axios.post = async (url, data, config) => {
        console.log('🚀 URL enviada:', url);
        console.log('📦 Headers:', config.headers);
        console.log('📄 Body (SOAP Envelope):');
        console.log(data);

        return {
            data: `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <validarComprobanteResponse xmlns="http://ec.gob.sri.ws.recepcion">
            <RespuestaRecepcionComprobante>
                <estado>RECIBIDA</estado>
                <comprobantes/>
            </RespuestaRecepcionComprobante>
        </validarComprobanteResponse>
    </soap:Body>
</soap:Envelope>`
        };
    };

    try {
        const dummyXml = '<factura><id>comprobante</id><claveAcceso>123</claveAcceso></factura>';
        const result = await sriService.enviarAlSri(dummyXml);
        console.log('✅ Resultado del servicio:', result);

        if (result.estado === 'RECIBIDA') {
            console.log('✨ PRUEBA EXITOSA: El estado es RECIBIDA');
        } else {
            console.error('❌ PRUEBA FALLIDA: El estado no es RECIBIDA');
        }
    } catch (error) {
        console.error('❌ Error durante la prueba:', error.message);
    } finally {
        axios.post = originalPost;
    }
}

testSriReception();
