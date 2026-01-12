
import { SriService } from './src/services/sri.service.js';

function testErrorExtraction() {
    console.log('--- Iniciando Prueba de Extracción de Errores SRI ---');
    const sriService = new SriService();

    // Caso 1: Error simple
    const xml1 = `
    <RespuestaRecepcionComprobante>
        <estado>DEVUELTA</estado>
        <comprobantes>
            <comprobante>
                <mensajes>
                    <mensaje>
                        <identificador>35</identificador>
                        <mensaje>RUC DEL RECEPTOR NO EXISTE</mensaje>
                        <tipo>ERROR</tipo>
                    </mensaje>
                </mensajes>
            </comprobante>
        </comprobantes>
    </RespuestaRecepcionComprobante>`;

    // Caso 2: Error con información adicional
    const xml2 = `
    <RespuestaRecepcionComprobante>
        <estado>DEVUELTA</estado>
        <comprobantes>
            <comprobante>
                <mensajes>
                    <mensaje>
                        <identificador>43</identificador>
                        <mensaje>CLAVE ACCESO REGISTRADA</mensaje>
                        <informacionAdicional>La clave de acceso 0801202601... ya se encuentra registrada en el sistema</informacionAdicional>
                        <tipo>ERROR</tipo>
                    </mensaje>
                </mensajes>
            </comprobante>
        </comprobantes>
    </RespuestaRecepcionComprobante>`;

    // Caso 3: Múltiples errores
    const xml3 = `
    <RespuestaRecepcionComprobante>
        <estado>DEVUELTA</estado>
        <comprobantes>
            <comprobante>
                <mensajes>
                    <mensaje><mensaje>ERROR 1</mensaje></mensaje>
                    <mensaje><mensaje>ERROR 2</mensaje></mensaje>
                </mensajes>
            </comprobante>
        </comprobantes>
    </RespuestaRecepcionComprobante>`;

    console.log('Caso 1 (Simple):', sriService.extraerErrorDeRespuesta(xml1));
    console.log('Caso 2 (Con info adicional):', sriService.extraerErrorDeRespuesta(xml2));
    console.log('Caso 3 (Múltiples):', sriService.extraerErrorDeRespuesta(xml3));

    const res1 = sriService.extraerErrorDeRespuesta(xml1);
    if (res1.includes('RUC DEL RECEPTOR NO EXISTE')) {
        console.log('✅ Prueba 1 exitosa');
    }

    const res2 = sriService.extraerErrorDeRespuesta(xml2);
    if (res2.includes('CLAVE ACCESO REGISTRADA') && res2.includes('Detalle:')) {
        console.log('✅ Prueba 2 exitosa');
    }
}

testErrorExtraction();
