/**
 * Encuesta: Datos Graduación 2026
 *
 * Pegar en: Google Sheets del formulario → Extensiones → Apps Script
 * Spreadsheet ID: 1ZX3xvN3amQddeczhXvhrp9DxWr1UMmbvJ6A-A1gHmWQ
 *
 * DESPLIEGUE:
 * 1. Guardar el proyecto
 * 2. Implementar → Nueva implementación → Aplicación web
 * 3. Ejecutar como: Yo
 * 4. Quién tiene acceso: Cualquier persona
 * 5. Copiar la URL (.../exec)
 * 6. Pegarla en datos-graduacion-2026.html (const SCRIPT_URL)
 */

var SPREADSHEET_ID = '1ZX3xvN3amQddeczhXvhrp9DxWr1UMmbvJ6A-A1gHmWQ';
var SHEET_NAME = 'Respuestas';

var HEADERS = [
  'Marca temporal',
  'Nombre completo',
  'Tela de camisa',
  'Talla'
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
      result = { ok: true, message: 'Formulario listo' };
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
  }
}

function submitResponse(params) {
  var nombre = String(params.nombre || '').trim().replace(/\s+/g, ' ');
  var tela = String(params.tela || '').trim();
  var talla = String(params.talla || '').trim();

  if (!nombre) throw new Error('El nombre es obligatorio.');
  var parts = nombre.split(' ').filter(function (p) { return p.length > 0; });
  if (parts.length < 4) {
    throw new Error('Ingresá 2 nombres y 2 apellidos.');
  }

  if (tela !== 'Estándar' && tela !== 'Gruesa') {
    throw new Error('Seleccioná el tipo de tela.');
  }
  if (!talla) throw new Error('Seleccioná la talla.');

  var sheet = getSheet();
  sheet.appendRow([
    new Date(),
    nombre,
    tela,
    talla
  ]);

  return {
    ok: true,
    row: sheet.getLastRow()
  };
}
