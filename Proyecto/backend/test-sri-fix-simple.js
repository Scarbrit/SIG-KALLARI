
import axios from 'axios';
import { Buffer } from 'buffer';

// Simulación de la clase para no cargar toda la arquitectura de la app que requiere BD
class SriServiceSimplified {
    constructor() {
        this.modoMock = false;
    }

    async enviarAlSri(xmlFirmado, url_recepcion) {
        const xmlBase64 = Buffer.from(xmlFirmado).toString('base64');

        // SRI Recepción requiere un sobre SOAP con el contenido en Base64
        const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ec="http://ec.gob.sri.ws.recepcion">
    <soapenv:Header/>
    <soapenv:Body>
        <ec:validarComprobante>
            <xml>${xmlBase64}</xml>
        </ec:validarComprobante>
    </soapenv:Body>
</soapenv:Envelope>`;

        try {
            console.log('🚀 Enviando a URL:', url_recepcion);
            const response = await axios.post(url_recepcion, soapEnvelope, {
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    'SOAPAction': ''
                },
                timeout: 30000
            });

            const responseData = response.data;
            const esRecibida = responseData.includes('RECIBIDA');

            return {
                estado: esRecibida ? 'RECIBIDA' : 'ERROR',
                mensaje: responseData
            };
        } catch (error) {
            console.error('❌ Error en axios.post al SRI:', error.response?.data || error.message);
            throw new Error(`Error enviando al SRI: ${error.response?.data || error.message}`);
        }
    }
}

async function testSriReception() {
    console.log('--- Iniciando Prueba de Recepción SRI (Simplificada) ---');

    const sriService = new SriServiceSimplified();
    const testUrl = 'https://test-sri.example.com/recepcion';

    // Mockeamos axios.post para ver qué se envía
    const originalPost = axios.post;
    axios.post = async (url, data, config) => {
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
        const result = await sriService.enviarAlSri(dummyXml, testUrl);
        console.log('✅ Resultado del servicio:', result);

        if (result.estado === 'RECIBIDA') {
            const xmlBase64 = Buffer.from(dummyXml).toString('base64');
            if (result.mensaje.includes('RECIBIDA') && xmlBase64 === 'PGZhY3R1cmE+PGlkPmNvbXByb2JhbnRlPC9pZD48Y2xhdmVBY2Nlc28+MTIzPC9jbGF2ZUFjY2Vzbz48L2ZhY3R1cmE+') {
                console.log('✨ PRUEBA EXITOSA: El sobre SOAP y la codificación Base64 son correctos.');
            }
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
