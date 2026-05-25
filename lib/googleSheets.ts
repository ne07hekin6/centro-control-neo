import { google, sheets_v4 } from "googleapis";

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

function normalizePrivateKey(value: string) {
  return value.replace(/\\n/g, "\n");
}

function getSheetsClient(): sheets_v4.Sheets | null {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!spreadsheetId) {
    return null;
  }

  if (clientEmail && privateKey) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: normalizePrivateKey(privateKey),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    return google.sheets({ version: "v4", auth });
  }

  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (apiKey) {
    return google.sheets({ version: "v4", auth: apiKey });
  }

  return null;
}

export function hasGoogleSheetsCredentials() {
  return Boolean(getSheetsClient() && spreadsheetId);
}

export async function readGoogleSheetTab(tabName: string) {
  const sheets = getSheetsClient();

  if (!sheets || !spreadsheetId) {
    throw new Error("Google Sheets no configurado.");
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tabName}!A:Z`,
    majorDimension: "ROWS",
  });

  return response.data.values ?? [];
}
