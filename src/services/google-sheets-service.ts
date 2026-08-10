import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// En Vercel el salto de línea de la private key se carga escapado (\n literal);
// hay que restaurarlo antes de usarla para firmar el JWT.
const SERVICE_ACCOUNT_PRIVATE_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
  /\\n/g,
  "\n",
);

const PHYSICAL_MATERIAL_SHEET_NAME = "Sheet1";
const PHYSICAL_MATERIAL_COLUMN_COUNT = 15; // A a O
const NOMENCLADOR_SHEET_RANGE = "NOMENCLADOR!A:B";

function requireConfig(): { spreadsheetId: string } {
  if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_PRIVATE_KEY) {
    throw new Error(
      "Google Sheets no está configurado: faltan GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL o GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
    );
  }

  return { spreadsheetId: SPREADSHEET_ID };
}

function getSheetsClient() {
  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

/**
 * Agrega una o más filas al final de la hoja de pedidos de material físico
 * (una fila por sucursal, para que el courier genere un envío por cada
 * una). Server-only: usa una cuenta de servicio de Google Cloud, nunca debe
 * llamarse desde el cliente.
 */
export async function appendPhysicalMaterialRows(rows: Array<Array<string | number>>): Promise<void> {
  const { spreadsheetId } = requireConfig();

  const sheets = getSheetsClient();

  // Calculamos nosotros mismos la próxima fila vacía (mirando solo la
  // columna A) en vez de usar `values.append`, que detecta "la tabla" con
  // una heurística propia de Google y a veces desalinea en qué columna
  // arranca la fila nueva.
  const columnAResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${PHYSICAL_MATERIAL_SHEET_NAME}!A:A`,
  });
  const existingRowCount = columnAResponse.data.values?.length ?? 0;
  const nextRow = existingRowCount + 1;
  const lastRow = nextRow + rows.length - 1;
  const lastColumnLetter = String.fromCharCode("A".charCodeAt(0) + PHYSICAL_MATERIAL_COLUMN_COUNT - 1);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${PHYSICAL_MATERIAL_SHEET_NAME}!A${nextRow}:${lastColumnLetter}${lastRow}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: rows },
  });
}

/**
 * Google suele devolver el CPA nuevo (1 letra + 4 dígitos + 3 letras, ej.
 * "C1043AAZ"), pero NOMENCLADOR usa el código postal viejo de 4 dígitos
 * (ej. "1043"). Esto extrae esos 4 dígitos si el formato coincide.
 */
function normalizePostalCode(postalCode: string): string {
  const trimmed = postalCode.trim();
  const cpaMatch = /^[A-Za-z]?(\d{4})[A-Za-z]{0,3}$/.exec(trimmed);
  return cpaMatch?.[1] ?? trimmed;
}

/**
 * Busca un código postal en la hoja NOMENCLADOR (columna A) y devuelve el
 * valor ya formateado de la columna B ("PROVINCIA / LOCALIDAD / CP").
 * Devuelve "" si no encuentra el código postal o si falta configuración.
 */
export async function lookupProvinciaLocalidadCp(postalCode: string | undefined): Promise<string> {
  if (!postalCode) return "";

  let spreadsheetId: string;

  try {
    ({ spreadsheetId } = requireConfig());
  } catch {
    return "";
  }

  const sheets = getSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: NOMENCLADOR_SHEET_RANGE,
  });

  const rows = response.data.values ?? [];
  const normalizedTarget = normalizePostalCode(postalCode);

  const match = rows.find((row) => String(row[0] ?? "").trim() === normalizedTarget);

  return match?.[1] ?? "";
}
