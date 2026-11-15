/**
 * Encuesta: Conferencia Divinidad de Jesús
 *
 * Pegar en: Google Sheets del formulario → Extensiones → Apps Script
 * Spreadsheet ID: 1q3beZmc51oGRkRpIBX5srtN9r6RSY5_tiF-S2C6EGSg
 *
 * DESPLIEGUE:
 * 1. Guardar el proyecto
 * 2. Implementar → Nueva implementación → Aplicación web
 * 3. Ejecutar como: Yo
 * 4. Quién tiene acceso: Cualquier persona
 * 5. Copiar la URL (.../exec)
 * 6. Pegarla en encuesta-conferencia-divinidad-jesus.html (const SCRIPT_URL)
 */

var SPREADSHEET_ID = '1q3beZmc51oGRkRpIBX5srtN9r6RSY5_tiF-S2C6EGSg';
var SHEET_NAME = 'Respuestas';

var HEADERS = [
  'Marca temporal',
  'Nombre completo',
  'Número de WhatsApp',
  '¿Qué te pareció la conferencia?',
  '¿Qué fue lo que más llamó tu atención o qué aprendizaje te llevás?',
  '¿Te gustaría ser parte del curso en línea?',
  '¿Autorizás contacto por WhatsApp?'
];

function doGet(e) {
  return handleRequest(e && e.parameter ? e.parameter : {});
}

function doPost(e) {
  var data = {};
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    data = (e && e.parameter) || {};
  }
  return handleRequest(data);
}

function handleRequest(params) {
  var action = String(params.action || 'ping').toLowerCase();
  try {
    var result;
    if (action === 'ping') {
      result = { ok: true, message: 'Encuesta lista' };
    } else if (action === 'submit') {
      result = submitResponse(params);
    } else {
      result = { ok: false, error: 'Acción no válida' };
    }
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSpreadsheet() {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    ss = null;
  }
  if (!ss) {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  if (!ss) {
    throw new Error('No se pudo abrir el spreadsheet. Revisa SPREADSHEET_ID.');
  }
  return ss;
}

function getSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  ensureHeaders(sheet);
  return sheet;
}

function ensureHeaders(sheet) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var firstRow = sheet.getRange(1, 1, 1, Math.max(lastCol, HEADERS.length)).getDisplayValues()[0];
  var empty = !firstRow || !String(firstRow[0] || '').trim();

  if (empty || sheet.getLastRow() === 0) {
    sheet.clear();
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }

  // Si hay encabezados distintos/incompletos, no los pisamos; append usa índices por nombre.
}

function submitResponse(params) {
  var nombre = String(params.nombre || '').trim();
  var whatsapp = String(params.whatsapp || '').trim();
  var parecer = String(params.parecer || '').trim();
  var aprendizaje = String(params.aprendizaje || '').trim();
  var curso = String(params.curso || '').trim();
  var autorizacion = String(params.autorizacion || '').trim();

  if (!nombre) throw new Error('El nombre es obligatorio.');
  if (!whatsapp) throw new Error('El WhatsApp es obligatorio.');
  if (!parecer) throw new Error('Contanos qué te pareció la conferencia.');
  if (!aprendizaje) throw new Error('Contanos qué aprendizaje te llevás.');
  if (!curso) throw new Error('Seleccioná una opción sobre el curso.');
  if (!autorizacion) throw new Error('Seleccioná una opción de autorización.');

  var sheet = getSheet();
  sheet.appendRow([
    new Date(),
    nombre,
    whatsapp,
    parecer,
    aprendizaje,
    curso,
    autorizacion
  ]);

  return {
    ok: true,
    row: sheet.getLastRow()
  };
}
