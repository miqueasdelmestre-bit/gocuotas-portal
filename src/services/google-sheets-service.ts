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

function assertConfigured(): asserts SPREADSHEET_ID is string {
  if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_PRIVATE_KEY) {
    throw new Error(
      "Google Sheets no está configurado: faltan GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL o GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
    );
  }
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
  assertConfigured();

  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: PHYSICAL_MATERIAL_SHEET_RANGE,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });
}

/**
 * Busca un código postal en la hoja NOMENCLADOR (columna A) y devuelve el
 * valor ya formateado de la columna B ("PROVINCIA / LOCALIDAD / CP").
 * Devuelve "" si no encuentra el código postal o si falta configuración.
 */
export async function lookupProvinciaLocalidadCp(postalCode: string | undefined): Promise<string> {
  if (!postalCode) return "";

  try {
    assertConfigured();
  } catch {
    return "";
  }

  const sheets = getSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: NOMENCLADOR_SHEET_RANGE,
  });

  const rows = response.data.values ?? [];
  const normalizedTarget = postalCode.trim();

  const match = rows.find((row) => String(row[0] ?? "").trim() === normalizedTarget);

  return match?.[1] ?? "";
}
