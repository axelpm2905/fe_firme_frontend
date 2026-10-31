/**
 * Pegar en: Google Sheets → Extensiones → Apps Script
 * Vinculado al spreadsheet de registro de la conferencia.
 *
 * DESPLIEGUE:
 * 1. Guardar el proyecto
 * 2. Implementar → Nueva implementación → Tipo: Aplicación web
 * 3. Ejecutar como: Yo
 * 4. Quién tiene acceso: Cualquier persona
 * 5. Copiar la URL de la aplicación web
 * 6. Pegarla en registro-conferencia.html (const SCRIPT_URL)
 */

// ID del Google Sheet (de la URL del documento)
var SPREADSHEET_ID = '17-qlYzBjLlOTr0Lbbu-2tWzErZKqtcChW3IU-dPHyqQ';
var SHEET_NAME = ''; // vacío = primera hoja

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
  var action = String(params.action || 'list').toLowerCase();
  try {
    var result;
    if (action === 'list') {
      result = { ok: true, records: listRecords() };
    } else if (action === 'markpresent' || action === 'mark_present') {
      result = markPresent(params.row, params.companions);
    } else if (action === 'register') {
      result = registerWalkIn(params);
    } else if (action === 'questions') {
      result = { ok: true, questions: listQuestions() };
    } else if (action === 'stats') {
      result = { ok: true, stats: getStats() };
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
  // En Apps Script como aplicación web, getActiveSpreadsheet() suele ser null.
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
  if (SHEET_NAME) {
    var named = ss.getSheetByName(SHEET_NAME);
    if (!named) throw new Error('No se encontró la hoja: ' + SHEET_NAME);
    return named;
  }
  return ss.getSheets()[0];
}

function headerIndexMap(headers) {
  var map = {};
  headers.forEach(function (h, i) {
    map[normalizeHeader(h)] = i;
  });
  return map;
}

function normalizeHeader(h) {
  return String(h || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findCol(map, candidates) {
  for (var i = 0; i < candidates.length; i++) {
    var key = normalizeHeader(candidates[i]);
    if (map[key] !== undefined) return map[key];
  }
  // coincidencia parcial
  var keys = Object.keys(map);
  for (var c = 0; c < candidates.length; c++) {
    var needle = normalizeHeader(candidates[c]);
    for (var k = 0; k < keys.length; k++) {
      if (keys[k].indexOf(needle) !== -1 || needle.indexOf(keys[k]) !== -1) {
        return map[keys[k]];
      }
    }
  }
  return -1;
}

function cell(row, idx) {
  if (idx < 0) return '';
  var v = row[idx];
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function listRecords() {
  var sheet = getSheet();
  var values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return [];

  var headers = values[0];
  var map = headerIndexMap(headers);

  var colNombre = findCol(map, ['Nombre']);
  var colCelular = findCol(map, ['Número de Whatsapp', 'Numero de Whatsapp', 'Whatsapp', 'Celular']);
  var colIglesia = findCol(map, ['¿A qué iglesia asistes?', 'A que iglesia asistes', 'Iglesia']);
  var colCantidad = findCol(map, [
    '¿Cuántas personas asistirán a la conferencia incluyéndolo a usted?',
    'Cuantas personas asistiran',
    'cantidad'
  ]);
  var colPregunta = findCol(map, [
    '¿Tienes alguna pregunta relacionada al tema?',
    'Tienes alguna pregunta',
    'pregunta'
  ]);
  var colAsistio = findCol(map, ['Asistio?', 'Asistió?', 'Asistio']);
  var colAcomp = findCol(map, ['Acompañantes confirmados', 'Acompanantes confirmados']);

  if (colNombre < 0 || colCelular < 0) {
    throw new Error('No se encontraron columnas Nombre / Whatsapp. Revisa los encabezados.');
  }

  var records = [];
  var seen = {};

  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    var nombre = cell(row, colNombre);
    var celular = cell(row, colCelular);
    if (!nombre && !celular) continue;

    var key = normalizeName(nombre) + '|' + normalizePhone(celular);
    if (seen[key]) continue;
    seen[key] = true;

    records.push({
      row: r + 1, // 1-based sheet row
      nombre: nombre,
      celular: celular,
      iglesia: cell(row, colIglesia),
      cantidad: parseIntSafe(cell(row, colCantidad)),
      pregunta: cell(row, colPregunta),
      asistio: isYes(cell(row, colAsistio)),
      acompanantes: parseIntSafe(cell(row, colAcomp)),
    });
  }

  return records;
}

function listQuestions() {
  return listRecords()
    .map(function (r) { return String(r.pregunta || '').trim(); })
    .filter(function (q) { return q.length > 0; });
}

function markPresent(rowNum, companions) {
  var row = parseInt(rowNum, 10);
  var acomp = parseInt(companions, 10);
  if (!row || row < 2) throw new Error('Fila inválida');
  if (isNaN(acomp) || acomp < 0) throw new Error('Cantidad de invitados inválida');

  var sheet = getSheet();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  var map = headerIndexMap(headers);
  var colAsistio = findCol(map, ['Asistio?', 'Asistió?', 'Asistio']);
  var colAcomp = findCol(map, ['Acompañantes confirmados', 'Acompanantes confirmados']);

  if (colAsistio < 0) throw new Error('No se encontró la columna Asistio?');
  if (colAcomp < 0) throw new Error('No se encontró la columna Acompañantes confirmados');

  sheet.getRange(row, colAsistio + 1).setValue('SI');
  sheet.getRange(row, colAcomp + 1).setValue(acomp);

  return { ok: true, row: row, asistio: 'SI', acompanantes: acomp };
}

/**
 * Registro en el momento:
 * - Pide los datos del formulario
 * - Marca temporal automática
 * - Asistio? = SI
 * - Acompañantes confirmados = misma cantidad de invitados
 */
function registerWalkIn(params) {
  var nombre = String(params.nombre || '').trim();
  var celular = String(params.celular || '').trim();
  var iglesia = String(params.iglesia || '').trim();
  var conexion = String(params.conexion || '').trim();
  var ministerios = String(params.ministerios || '').trim();
  var pregunta = String(params.pregunta || '').trim();
  var cantidad = parseInt(params.cantidad, 10);

  if (!nombre) throw new Error('El nombre es obligatorio');
  if (!celular) throw new Error('El Whatsapp es obligatorio');
  if (!iglesia) throw new Error('La iglesia es obligatoria');
  if (isNaN(cantidad) || cantidad < 1) throw new Error('Cantidad de invitados inválida');

  var sheet = getSheet();
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0];
  var map = headerIndexMap(headers);

  var colTs = findCol(map, ['Marca temporal', 'Timestamp']);
  var colNombre = findCol(map, ['Nombre']);
  var colCelular = findCol(map, ['Número de Whatsapp', 'Numero de Whatsapp', 'Whatsapp', 'Celular']);
  var colIglesia = findCol(map, ['¿A qué iglesia asistes?', 'A que iglesia asistes', 'Iglesia']);
  var colConexion = findCol(map, ['¿Perteneces a un grupo conexión?', 'grupo conexion', 'conexion']);
  var colMinisterios = findCol(map, ['¿En qué ministerios sirves en Oasis de Amor?', 'ministerios']);
  var colCantidad = findCol(map, [
    '¿Cuántas personas asistirán a la conferencia incluyéndolo a usted?',
    'Cuantas personas asistiran',
    'cantidad'
  ]);
  var colPregunta = findCol(map, [
    '¿Tienes alguna pregunta relacionada al tema?',
    'Tienes alguna pregunta',
    'pregunta'
  ]);
  var colAsistio = findCol(map, ['Asistio?', 'Asistió?', 'Asistio']);
  var colAcomp = findCol(map, ['Acompañantes confirmados', 'Acompanantes confirmados']);

  if (colNombre < 0 || colCelular < 0) {
    throw new Error('No se encontraron columnas Nombre / Whatsapp');
  }

  var rowValues = [];
  for (var i = 0; i < headers.length; i++) rowValues.push('');

  if (colTs >= 0) rowValues[colTs] = new Date();
  if (colNombre >= 0) rowValues[colNombre] = nombre;
  if (colCelular >= 0) rowValues[colCelular] = celular;
  if (colIglesia >= 0) rowValues[colIglesia] = iglesia;
  if (colConexion >= 0) rowValues[colConexion] = conexion;
  if (colMinisterios >= 0) rowValues[colMinisterios] = ministerios;
  if (colCantidad >= 0) rowValues[colCantidad] = cantidad;
  if (colPregunta >= 0) rowValues[colPregunta] = pregunta;
  if (colAsistio >= 0) rowValues[colAsistio] = 'SI';
  if (colAcomp >= 0) rowValues[colAcomp] = cantidad; // mismo dato que invitados

  sheet.appendRow(rowValues);
  var newRow = sheet.getLastRow();

  return {
    ok: true,
    row: newRow,
    asistio: 'SI',
    acompanantes: cantidad,
  };
}

function getStats() {
  var records = listRecords();
  var presentesPersonas = 0;
  var registrosPresentes = 0;
  var oasisRegistros = 0;
  var otrasIglesiasRegistros = 0;

  records.forEach(function (r) {
    if (!r.asistio) return;
    registrosPresentes += 1;
    var personas = r.acompanantes > 0 ? r.acompanantes : 1;
    presentesPersonas += personas;
    if (isOasisChurch(r.iglesia)) {
      oasisRegistros += 1;
    } else {
      otrasIglesiasRegistros += 1;
    }
  });

  return {
    totalRegistros: records.length,
    registrosPresentes: registrosPresentes,
    personasPresentes: presentesPersonas,
    oasisRegistros: oasisRegistros,
    otrasIglesiasRegistros: otrasIglesiasRegistros,
  };
}

function isOasisChurch(iglesia) {
  var n = normalizeHeader(iglesia);
  if (!n) return false;
  return n.indexOf('oasis') !== -1;
}

function isOtherChurch(iglesia) {
  return !isOasisChurch(iglesia);
}

function normalizeName(n) {
  return String(n || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePhone(p) {
  return String(p || '').replace(/\D/g, '');
}

function parseIntSafe(v) {
  var n = parseInt(String(v).replace(/[^\d]/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

function isYes(v) {
  var n = String(v || '').trim().toLowerCase();
  return n === 'si' || n === 'sí' || n === 'yes' || n === 'true' || n === '1' || n === 'x';
}
