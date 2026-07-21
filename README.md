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

El resto de las variables queda declarado como referencia para las integraciones futuras
(Gmail API, Google Sheets, Drive, auth, DB).

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

## Preparado para integrar (no implementado todavía)

- **Gmail API**: notificar al equipo comercial cuando llega una solicitud.
- **Google Sheets API**: registrar cada solicitud en una planilla de seguimiento.
- **Google Drive**: alojar el material de comunicación descargable.
- **Autenticación**: proteger el portal por comercio.
- **Base de datos**: persistir solicitudes en vez de simularlas.

El punto de entrada para todo esto es
[`src/services/commercial-conditions-service.ts`](src/services/commercial-conditions-service.ts)
y [`src/services/api-client.ts`](src/services/api-client.ts) — hoy el service simula el
envío; se reemplaza sin tocar componentes ni hooks.
