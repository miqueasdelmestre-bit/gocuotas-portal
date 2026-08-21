# Prompt de continuación — GOcuotas Portal (Centro de Condiciones Comerciales)

> Pegá este archivo completo como primer mensaje en una sesión nueva de Claude Code
> (parado en `/Users/miqueasdelmestre/Desktop/Automatizaciones`) para retomar el
> proyecto sin perder contexto.

## Quién soy / contexto general

Soy Miqueas Del Mestre, Ejecutivo de Cuentas en GOcuotas (`miqueasdelmestre@gocuotas.com`).
El contexto maestro del área está en `/Users/miqueasdelmestre/Desktop/Automatizaciones/CLAUDE.md`
(conexión a Databricks, cartera de comercios, calculadora de crecimiento, brandbook, etc.) —
leelo también. Este documento es específico del proyecto **gocuotas-portal**.

**No confundir con `farmers-hub`** (`~/Desktop/Automatizaciones/farmers-hub`) — es una app
distinta, para el equipo interno de Farmers, no para comercios.

## Qué es gocuotas-portal

App pública (self-service) para que los **comercios** consulten condiciones comerciales y
pidan material publicitario. Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui.

- Código: `/Users/miqueasdelmestre/Desktop/Automatizaciones/gocuotas-portal`
- **GitHub**: `github.com/miqueasdelmestre-bit/gocuotas-portal`
- **Vercel**: proyecto `gocuotas-portal` (id `prj_jKLoUpTSyk5iXCjirb45FlEBxIow`), team
  `miqueasdelmestre-8267s-projects` (id `team_QUZPq4XaYuyNwfZ4BU8RzNPG`). Hay un proyecto
  duplicado sin usar, `gocuotas-portal-bcjr`, en el mismo team — **ignorarlo**.
- **Producción**: https://gocuotas-portal.vercel.app
- Local: `cd gocuotas-portal && npm run dev` (puerto 3000) — **esta Mac no tiene Node/npm
  instalado**, así que todo el desarrollo de esta sesión se hizo escribiendo el código a mano
  y verificando el build/deploy directo en Vercel (no hay forma de correr `npm run build`
  local para chequear antes de pushear).

## Identidad visual

Ver `BrandbookGOcuotas-2026.pdf` (carpeta raíz) y memoria `gocuotas-brandbook`. Dos capas de
color coexisten a propósito:

- **Color primario global de la app** (sidebar, botones por defecto, etc.): `#9E005D`
  (bordó), vive en `--primary` de `src/app/globals.css` (HSL `325 100% 31%`). Único lugar
  para cambiarlo.
- **Excepción puntual**: en `/material-publicitario-online` y `/material-publicitario-fisico`,
  el H1 y el botón principal usan `#EE2A7B` (magenta, el color viejo) en vez de `#9E005D` —
  pedido explícito para esas dos pantallas nada más, con clases Tailwind arbitrarias
  (`text-[#EE2A7B]`, `bg-[#EE2A7B]`), sin tocar la variable global.
- Logo real de GOcuotas en el sidebar: `public/logo-gocuotas-white.png` (recortado del
  archivo blanco que pasó Miqueas, vía `next/image`, 92×36 en `app-sidebar.tsx`).
- Íconos del sidebar (`src/constants/navigation.ts`, lucide-react): Inicio=`Home`, Material
  publicitario online=`Laptop`, Material publicitario físico=`FileText`. Los mismos módulos
  en la página de Inicio (`module-shortcuts.ts`) todavía usan los íconos viejos
  (`Palette`/`Package`) — quedó así a propósito (el pedido fue solo "el lateral izquierdo"),
  preguntar si hay que unificarlos.

## Módulos

- **Inicio** (`/`) — accesos directos a los otros módulos.
- **Material publicitario online** (`/material-publicitario-online`) — solo un link a una
  carpeta de Drive, sin formulario propio.
- **Material publicitario físico** (`/material-publicitario-fisico`) — **el módulo real**,
  con formulario propio + integración a Google Sheets (ver abajo). Ya está en uso real por
  comercios (decenas de pedidos reales cargados al momento de escribir esto).
- **Condiciones comerciales** (`/condiciones-comerciales`) — existe en código pero está
  **oculto** del menú y de Inicio a pedido del negocio (no borrado, solo desvinculado en
  `constants/navigation.ts` y `constants/module-shortcuts.ts`).

## El formulario de Material publicitario físico — campos y reglas

Campos: Nombre de marca, CUIT (+ checkbox de confirmación con el valor tipeado, no re-tipeo),
Mail, Teléfono, Dirección (Google Places Autocomplete), Piso/depto/local (opcional), Cantidad
de sucursales (1–10).

Al enviar, escribe en un **Google Sheet real** (`src/services/google-sheets-service.ts`,
`src/app/api/physical-material-requests/route.ts`) — **una fila por sucursal** (si eligen 3
sucursales, se escriben 3 filas idénticas, porque el courier arma un envío por fila).

### Estructura del Sheet
Sheet ID `1GqSq8yO_2L_0NDj8uG9Z5k4QR9JTlMj2NaroR8_DbHo`, tab **"Sheet1"**.

- **Columnas A–O**: template fijo de envío/logística del courier, **no se toca el orden**:
  `Peso (grs) | Valor declarado ($ S/IVA) | Numero interno | Referencia | Nombre | Apellido | DNI | Email | Telefono | Calle | Numero | Piso | Departamento | Observaciones | Provincia/Localidad/CP`.
- **Columna P ("Enviado")**: checkbox que ya existía en el template — **nunca escribir ahí**.
- **Columna Q ("Fecha")**: agregada por nosotros. Fecha de la solicitud, `dd/mm/aaaa`,
  horario argentino (`America/Argentina/Buenos_Aires`). Se escribe con un `'` inicial para
  forzar texto (el doc tiene locale `en_US`; sin el `'`, Sheets puede reinterpretar
  "11/08/2026" como mes/día).
- **Columna R ("Origen")**: agregada por nosotros. Viene de `?utm_source=` en la URL del
  link que usó el comercio (ej. `panel`, `correorepo`, `soporte`), leído server-side en
  `app/material-publicitario-fisico/page.tsx` vía `searchParams` (Next 15: es una Promise,
  hay que `await`).
- Q y R se escriben juntas en una sola llamada extra a `values.update` (después de la
  llamada principal A:O), para no pisar la P.
- **Segundo tab "NOMENCLADOR"**: columna A = código postal viejo (4 dígitos), columna B = el
  string ya armado `PROVINCIA / LOCALIDAD / CP`. Se usa para completar la columna O. Google
  devuelve el código postal en formato nuevo (ej. `C1043AAZ`) — hay que normalizarlo a 4
  dígitos antes de buscar (`normalizePostalCode` en `google-sheets-service.ts`).

### Reglas de armado de cada fila (ver `route.ts`)
- **Peso** (90) y **Valor declarado** (6000) son fijos en el código.
- **Numero interno** = cantidad de cuotas que GOcuotas tiene registrada para ese CUIT +
  " cuotas" (vacío si no matchea).
- **Nombre = Apellido** = el nombre de marca que el comercio tipeó. **Nunca** el nombre real
  de GOcuotas aunque el CUIT matchee — ver regla de seguridad abajo.
- **DNI** = CUIT sin los primeros 2 dígitos ni el último (los 8 del medio).
- **Departamento** = campo "Piso, depto o local" del form, nunca el string `"0"` (vacío en
  su lugar).
- **Referencia, Piso, Observaciones**: siempre vacíos (no hay dato que poner ahí).

### 🔒 Regla de seguridad — no cruzar nunca
Ver memoria `gocuotas-portal-security-constraints`. Resumen: **ningún dato interno de
GOcuotas** (si el CUIT matchea, nombre real del comercio, cantidad de cuotas que tiene) puede
**devolverse en la respuesta de la API ni mostrarse en el formulario**, ni cambiar el
comportamiento visible (éxito/error) según matchee o no. Si no, el formulario público se
convierte en una herramienta para "adivinar" qué CUITs son comercios reales de GOcuotas. La
verificación es 100% server-side y su resultado solo llega al Sheet interno.

## Integraciones activas (todas server-only)

1. **Google Sheets** — cuenta de servicio de Google Cloud (proyecto `analytical-camp-503118-t1`
   en Google Cloud Console), JSON de credenciales guardado en
   `/Users/miqueasdelmestre/analytical-camp-503118-t1-7593009233fe.json` (fuera del repo, no
   se commitea — **ojo con esto**, una vez casi se commitea sin querer, `.gitignore` tiene
   patrones para prevenirlo pero revisar `git status` antes de cada commit igual).
   - Env vars en Vercel: `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`,
     `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (marcadas "Sensitive" en Vercel — está bien para
     estas tres, son server-only).
   - **Esta misma cuenta de servicio también la usa `farmers-hub`** (copiada a su Vercel env
     2026-08-12). No rotar/revocar sin chequear ahí primero.
2. **Databricks** — verificación de CUIT contra `prd.gold_dw.dim_users_commerce`
   (`src/services/databricks-service.ts`). Usa el token personal de Miqueas
   (`~/Documents/databricks-go-config.env` → `DATABRICKS_HOST`/`DATABRICKS_TOKEN`/
   `DATABRICKS_WAREHOUSE_ID`), cargado como env vars server-only en Vercel. Es un stopgap
   sabido — en algún momento debería pasar a un token de servicio con permisos acotados.
   - Un mismo CUIT puede tener más de un comercio cargado (duplicados en la base) — se
     prioriza el que tenga operaciones entregadas más recientes (subquery correlacionada por
     `MAX(delivered_at)`).
3. **Google Maps Places Autocomplete** — cliente, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (Google
   Cloud, mismo proyecto `analytical-camp-503118-t1`). Restringida por HTTP referrer —
   **tiene que incluir el dominio real de Vercel**, no solo `localhost`, o tira
   `RefererNotAllowedMapError`.

## Gotchas técnicos ya resueltos (no volver a redescubrirlos)

- **Google Places Autocomplete + React controlled input**: pelean por el control del DOM.
  Solución actual (`use-google-places-autocomplete.ts` + `address-autocomplete-input.tsx`):
  callback ref (no `useRef` + efecto con dependencia estable — si `current` es `null` en el
  primer render, el efecto nunca se reintenta) **y** el input queda "no controlado" a
  propósito (`defaultValue` + sync manual solo cuando el valor externo cambia), porque
  forzar `value` en cada tecla pisaba la manipulación interna de Google y el campo perdía el
  foco a la primera letra.
- **Selección de sugerencias solo funciona con eventos "trusted"**: un click/tecla simulado
  por JS (`dispatchEvent`, `.click()`) no dispara la lógica interna de Google — hace falta un
  click/tecla real (a nivel de sistema/CDP). Si algún día hay que testear esto por
  automatización, usar clicks reales, no `dispatchEvent`.
- **Databricks warehouse dormido**: se auto-suspende por inactividad y la primera consulta
  después de un rato puede tardar bastante. `wait_timeout` está en `"50s"` (el máximo que
  admite la API de Databricks) y la ruta tiene `export const maxDuration = 60` — sin esto,
  Vercel mata la función a los 10s por default y la verificación de CUIT falla en silencio.
- **`values.append` de Sheets desalinea columnas**: con una columna fuera de rango con datos
  preexistentes lejos (la "Enviado" con checkboxes prellenados mucho más abajo de los datos
  reales), la heurística de detección de tabla de Google a veces hacía arrancar la fila
  nueva en la columna O en vez de la A. Se reemplazó por calcular la próxima fila nosotros
  mismos (contando la columna A) y usar `values.update` con rango explícito.
- **Env vars "Sensitive" en Vercel rompen `NEXT_PUBLIC_*`**: se excluyen del build step, y
  las `NEXT_PUBLIC_` necesitan inlinearse en el build — si una queda vacía en el bundle sin
  ningún error visible, revisar si alguien la marcó "Sensitive" por error. Para las server-only
  (Sheets, Databricks) sí está bien marcarlas así.
- **Código postal**: Google devuelve el formato nuevo (ej. `C1043AAZ`), NOMENCLADOR usa el
  viejo de 4 dígitos — hay que normalizar antes de buscar.

## Deploy — mecánica (leer antes de tocar git/vercel)

- **Git**: hay un credential helper **scoped solo a este repo** ya configurado
  (`.git/credentials-local`, gitignored, `git config credential.helper` apunta ahí) — los
  pushes andan solos, **no hace falta pedirle un token a Miqueas cada vez**. Si en algún
  momento deja de funcionar (token vencido/revocado), pedirle uno nuevo de GitHub
  (`Settings → Developer settings → Personal access tokens`, scope `repo`) y volver a armar
  el credential helper con el mismo patrón.
- **Vercel**: no hay CLI de Vercel instalada ni token guardado en disco — cada sesión nueva
  necesita que Miqueas genere un **Vercel Personal Access Token**
  (`vercel.com/account/tokens`, con el **scope apuntando al proyecto correcto**, `gocuotas-portal`
  y no `gocuotas-portal-bcjr` — ya pasó que un token quedó con el scope equivocado). Con ese
  token, todo se maneja por API REST (`api.vercel.com`) con `curl`:
  - Listar deployments: `GET /v6/deployments?projectId=...&teamId=...&limit=1&target=production`
  - Ver por qué falló un build: `GET /v2/deployments/{uid}/events?teamId=...`
  - Env vars: `GET/POST /v9/projects/{id}/env?teamId=...` (`v10` para crear con más opciones)
  - Chequear el deploy después de cada push corriendo esto **en background** (con
    `run_in_background: true`), no bloqueando el turno, porque tarda 1-3 minutos.
- **Verificación end-to-end sin romper datos reales**: el Sheet real ya tiene decenas de
  pedidos reales de comercios. Para probar algo, siempre:
  1. Mandar el pedido de prueba (con un CUIT inventado tipo `TEST - ...` como nombre de marca
     para identificarlo fácil).
  2. Leer el Sheet directo con un script Python chiquito (usando el JSON de la cuenta de
     servicio + `cryptography`/`requests`, que sí están instalados acá — no hay `PyJWT` pero
     no hace falta, se arma el JWT a mano con RS256) para confirmar la fila.
  3. **Borrar esa fila de prueba** (`values.clear` sobre el rango exacto de esa fila) antes de
     terminar — nunca dejar basura de test en el Sheet real.

## Cómo me gusta trabajar (importante)

- No uses el diálogo de preguntas múltiples salvo que sea realmente bloqueante.
- Priorizá datos/comportamiento reales por sobre simulado siempre que se pueda.
- Verificá vos mismo (build, deploy, Sheet) antes de decir que algo funciona — no le pidas a
  Miqueas que lo prueba primero si lo podés confirmar vos mismo.
- Cuando algo toca un límite de seguridad/exposición de datos (mostrar algo de GOcuotas en el
  formulario público), avisá el trade-off explícitamente antes de implementarlo — no lo
  hagas en silencio.
- Iterá mirando capturas de pantalla o el Sheet real cuando Miqueas las manda — leé bien qué
  señala antes de tocar código.

## Pendientes / notas sueltas

1. El header mobile (barra de arriba cuando el sidebar está cerrado, en `app-shell.tsx`)
   sigue mostrando "GOcuotas" en texto plano, no el logo real — quedó pendiente confirmar si
   hay que unificarlo con el logo de imagen.
2. Íconos de Inicio (`module-shortcuts.ts`) siguen con `Palette`/`Package` viejos, mientras el
   sidebar ya tiene `Laptop`/`FileText` — confirmar si hay que unificar.
3. El token de Databricks usado para la verificación de CUIT es personal de Miqueas — mover a
   un token de servicio en algún momento (no urgente).
4. La confirmación de CUIT es un checkbox (no reingreso) que muestra de vuelta lo que el
   propio comercio tipeó — decisión explícita tras encontrar que el reingreso mostraba error
   de "CUIT inválido" mientras el usuario todavía estaba escribiendo (se cambió el modo de
   validación del form a `onBlur` para eso también).

Ver memorias relacionadas: `gocuotas-portal-overview`, `gocuotas-portal-security-constraints`,
`gocuotas-brandbook`, `feedback-communication-style`.
