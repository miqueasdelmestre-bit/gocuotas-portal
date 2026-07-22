# GOcuotas Portal — Centro de Condiciones Comerciales

Aplicación web (Next.js 15 + TypeScript + Tailwind + shadcn/ui) para que los comercios
consulten las alternativas de plan de cuotas disponibles y soliciten un cambio, sin
intervención manual del ejecutivo de cuentas.

## Requisitos

- Node.js 20 LTS o superior
- npm 10 o superior

## Puesta en marcha local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run start` — sirve el build de producción
- `npm run lint` — ESLint
- `npm run type-check` — chequeo de tipos con `tsc --noEmit`

## Variables de entorno

Ver `.env.example`.

- `NEXT_PUBLIC_MATERIAL_DOWNLOAD_URL` — URL del material de comunicación descargable tras
  enviar una solicitud de condiciones comerciales.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — habilita el autocompletado de direcciones (Google
  Places) en el pedido de material físico. Para crearla:
  1. En [Google Cloud Console](https://console.cloud.google.com/google/maps-apis), creá o
     elegí un proyecto y habilitá **"Places API"** (y "Maps JavaScript API").
  2. Generá una API key en "Credenciales".
  3. Restringila por **HTTP referrer** a tu dominio de Vercel (y a `localhost:3000` para
     desarrollo), y limitala a las dos APIs de arriba.
  4. Cargala como `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` en Vercel y en tu `.env.local`.

  Si esta variable no está configurada, el campo de dirección sigue funcionando como texto
  libre (sin autocompletar) — no rompe el formulario en desarrollo sin la key.

- `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`,
  `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` — cada pedido de material físico se guarda como fila
  nueva en un Google Sheet. Para conectarlo:
  1. En [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts),
     con el mismo proyecto que usaste para Maps, creá una **cuenta de servicio** (Service
     Account) — no hace falta ningún rol de proyecto especial.
  2. Entrá a la cuenta creada → pestaña **"Keys"** → **"Add key" → "Create new key"** → tipo
     **JSON** → se descarga un archivo `.json`.
  3. De ese archivo copiá:
     - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
     - `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (pegalo tal cual, con los `\n`
       literales — el código los convierte a saltos de línea reales)
  4. Habilitá **"Google Sheets API"** en
     [la Biblioteca de APIs](https://console.cloud.google.com/apis/library/sheets.googleapis.com)
     de ese proyecto.
  5. Abrí el Google Sheet donde querés guardar los pedidos → **Compartir** → agregá el
     `client_email` de la cuenta de servicio con permiso de **Editor**.
  6. El **Sheet ID** es la parte de la URL entre `/d/` y `/edit`:
     `docs.google.com/spreadsheets/d/`**`ESTE_ES_EL_ID`**`/edit` → `GOOGLE_SHEETS_SPREADSHEET_ID`.
  7. La primera fila del Sheet (encabezados) debería tener, en orden:
     `Fecha | Marca | CUIT | Mail | Teléfono | Dirección | Sucursales`.

  Sin estas tres variables configuradas, el envío del formulario de material físico falla
  (no hay simulación de respaldo, ya que es una integración real).

## Estructura

```
src/
  app/                    rutas (App Router) — sin lógica de negocio
  components/
    ui/                   primitivos shadcn/ui (button, card, dialog, form, etc.)
    layout/                sidebar y shell de la aplicación
    features/               componentes específicos de cada módulo
  services/                capa de integración (hoy simulada, preparada para APIs reales)
  hooks/                    lógica de estado reutilizable
  lib/                      utilidades transversales (cn, validadores, schemas zod, fuentes)
  constants/                datos y configuración (planes, navegación, site config)
  types/                    tipos compartidos
  utils/                    helpers puros de formateo/selección
```

## Módulos

- **Inicio** — accesos directos a los demás módulos.
- **Condiciones comerciales** — consulta de planes y solicitud de cambio.
- **Material publicitario online** — link a la carpeta de Drive con banners y piezas gráficas.
- **Material publicitario físico** — formulario propio (con autocompletado de dirección)
  para pedir material POP, en vez de derivar a un formulario externo.

## Despliegue en Vercel

1. Subí este directorio a un repositorio de GitHub.
2. Importalo en [vercel.com/new](https://vercel.com/new).
3. Cargá las variables de entorno de `.env.example` que correspondan en el proyecto de Vercel.
4. Deploy.

## Integraciones

- **Google Sheets** (activa): los pedidos de material físico se guardan como filas en un
  Sheet real vía `src/services/google-sheets-service.ts` (cuenta de servicio) y la ruta
  `src/app/api/physical-material-requests/route.ts`.

## Preparado para integrar (no implementado todavía)

- **Gmail API**: notificar al equipo comercial cuando llega una solicitud.
- **Google Drive**: alojar el material de comunicación descargable.
- **Autenticación**: proteger el portal por comercio.
- **Base de datos**: persistir las solicitudes de condiciones comerciales (hoy simuladas).

El punto de entrada para condiciones comerciales es
[`src/services/commercial-conditions-service.ts`](src/services/commercial-conditions-service.ts)
y [`src/services/api-client.ts`](src/services/api-client.ts) — hoy ese service simula el
envío; se reemplaza sin tocar componentes ni hooks.
