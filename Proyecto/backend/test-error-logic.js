
// Mock de la función para no cargar dependencias de BD
function extraerErrorDeRespuesta(xmlRespuesta) {
    if (!xmlRespuesta) return 'Respuesta vacía del SRI';

    try {
        const mensajes = [];

        // Buscar todos los bloques de <mensaje>
        // Nota: SRI a veces devuelve <mensaje> dentro de <mensajes>
        const regexMensaje = /<mensaje>([\s\S]*?)<\/mensaje>/g;
        let match;

        while ((match = regexMensaje.exec(xmlRespuesta)) !== null) {
            let contenido = match[1].trim();

            // Si el contenido tiene a su vez una etiqueta <mensaje> (anidamiento del SRI), 
            // intentamos extraer el texto interno. Si no, usamos el contenido tal cual.
            const interna = contenido.match(/<mensaje>([\s\S]*?)<\/mensaje>/);
            let texto = interna ? interna[1].trim() : contenido;

            // Limpiar etiquetas HTML/XML residuales si las hay y no repetir mensajes
            texto = texto.replace(/<[^>]*>?/gm, '').trim();

            if (texto && !mensajes.includes(texto)) {
                mensajes.push(texto);
            }
        }

        const infoAdicionalMatch = xmlRespuesta.match(/<informacionAdicional>([\s\S]*?)<\/informacionAdicional>/);
        if (infoAdicionalMatch) {
            let info = infoAdicionalMatch[1].replace(/<[^>]*>?/gm, '').trim();
            if (info) mensajes.push(`Detalle: ${info}`);
        }

        if (mensajes.length === 0) {
            return 'No se encontraron detalles de error en la respuesta del SRI';
        }

        return mensajes.join(' | ');
    } catch (error) {
        return 'Error procesando los detalles técnicos';
    }
}

function runTests() {
    console.log('--- Pruebas de Lógica de Extracción ---');

    const xml1 = '<mensaje>RUC INEXISTENTE</mensaje>';
    console.log('Test 1:', extraerErrorDeRespuesta(xml1));

    const xml2 = '<comprobante><mensajes><mensaje><mensaje>CLAVE DUPLICADA</mensaje><informacionAdicional>Clave ya existe</informacionAdicional></mensaje></mensajes></comprobante>';
    console.log('Test 2:', extraerErrorDeRespuesta(xml2));

    const xml3 = '<error><mensaje>ERROR A</mensaje><mensaje>ERROR B</mensaje></error>';
    console.log('Test 3:', extraerErrorDeRespuesta(xml3));
}

runTests();
