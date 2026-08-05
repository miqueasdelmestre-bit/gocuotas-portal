import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// En Vercel el salto de línea de la private key se carga escapado (\n literal);
// hay que restaurarlo antes de usarla para firmar el JWT.
const SERVICE_ACCOUNT_PRIVATE_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
  /\\n/g,
  "\n",
);

const PHYSICAL_MATERIAL_SHEET_RANGE = "Sheet1!A:O";
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
 * Agrega una fila al final de la hoja de pedidos de material físico.
 * Server-only: usa una cuenta de servicio de Google Cloud, nunca debe
 * llamarse desde el cliente.
 */
export async function appendPhysicalMaterialRow(values: Array<string | number>): Promise<void> {
  const { spreadsheetId } = requireConfig();

  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: PHYSICAL_MATERIAL_SHEET_RANGE,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
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
  return cpaMatch ? cpaMatch[1] : trimmed;
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
