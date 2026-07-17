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

Ver `.env.example`. Hoy solo se usa `NEXT_PUBLIC_MATERIAL_DOWNLOAD_URL` (URL del material
de comunicación que se descarga tras enviar una solicitud). El resto queda declarado como
referencia para las integraciones futuras (Gmail API, Google Sheets, Drive, auth, DB).

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

Solo **Condiciones comerciales** está implementado. Inicio, Material de marketing y
Solicitud de material POP aparecen en el sidebar con el badge "Próximamente" y no
navegan — quedan reservados para próximas iteraciones sobre esta misma base.

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
