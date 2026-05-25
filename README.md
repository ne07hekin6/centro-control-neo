# Centro de Control con IA - Dashboard Template

Template de dashboard operativo conectado a Google Sheets. Muestra foco del día, proyectos priorizados, indicadores automáticos, check-ins y actividad reciente en una interfaz desktop-first lista para desplegar en Vercel.

Este repositorio contiene la aplicación, no una landing comercial.

## Modos De Uso

**Modo demo:** sin credenciales, la aplicación abre con datos ficticios para explorar todas las vistas.

**Modo conectado:** con variables de entorno, el dashboard lee tu propia Google Sheet en el servidor. Las credenciales nunca se exponen al navegador.

## Inicio Rapido

Requisitos: Node.js 20 o superior y npm.

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000`. Sin archivo `.env.local`, vas a ver el modo demo.

## Configuracion

Copiá `.env.example` como `.env.local` y completá solo lo que necesites:

```env
NEXT_PUBLIC_DASHBOARD_NAME=Centro de Control con IA
NEXT_PUBLIC_DASHBOARD_SUBTITLE=Dashboard operativo. Presente primero.
NEXT_PUBLIC_DASHBOARD_TIMEZONE=America/Argentina/Buenos_Aires

GOOGLE_SHEETS_SPREADSHEET_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=

DASHBOARD_ACCESS_PASSWORD=
DASHBOARD_COOKIE_SECRET=
DASHBOARD_PUBLIC_ACCESS=false
```

`GOOGLE_SHEETS_API_KEY` queda disponible como alternativa para una planilla pública. Para datos privados se recomienda service account.

## Crear Tu Google Sheet

La carpeta [`templates/google-sheets`](/templates/google-sheets) contiene CSVs de ejemplo para importar en una planilla nueva.

1. Creá una Google Sheet vacía.
2. Creá las pestañas `dashboard_state`, `projects`, `counters`, `updates_log`, `daily_checkins` y `config`.
3. Importá el CSV correspondiente en cada pestaña.
4. Editá los datos de ejemplo con tu información.

El esquema completo y los campos opcionales están documentados en [docs/google-sheets-schema.md](/docs/google-sheets-schema.md).

## Conectar Google Sheets

1. Creá un proyecto en Google Cloud.
2. Habilitá Google Sheets API.
3. Creá una service account y descargá su clave JSON.
4. Compartí tu Google Sheet con el email de la service account como lector.
5. Configurá:

```env
GOOGLE_SHEETS_SPREADSHEET_ID=id_de_tu_planilla
GOOGLE_SERVICE_ACCOUNT_EMAIL=cuenta@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Si las credenciales faltan o fallan, la aplicación vuelve a modo demo sin romper la interfaz.

## Acceso Privado

La protección por contraseña es opcional en modo demo. En producción, si conectás una Google Sheet, el template bloquea el acceso hasta que definas una contraseña o habilites explícitamente acceso público.

Para activarla:

```env
DASHBOARD_ACCESS_PASSWORD=una-clave-larga-y-unica
DASHBOARD_COOKIE_SECRET=otro-valor-largo-y-aleatorio
```

Con estas variables activas, las páginas y `/api/control-center` requieren una cookie HTTP-only emitida al ingresar la clave.

Esta barrera es apropiada para un dashboard personal simple. No reemplaza un sistema de usuarios con control de acceso avanzado.

Para publicar deliberadamente un dashboard conectado sin contraseña:

```env
DASHBOARD_PUBLIC_ACCESS=true
```

## Deploy En Vercel

1. Subí este repo a GitHub.
2. En Vercel, elegí `Add New > Project` e importá el repositorio.
3. Vercel detecta Next.js automáticamente.
4. Cargá las variables de entorno del modo conectado y, si corresponde, de acceso privado.
5. Desplegá.

Después de modificar variables, dispará un nuevo deployment.

## Estructura Principal

```text
app/                  rutas y endpoint server-side
components/           interfaz del dashboard
lib/                  Sheets, mapeo, formato, auth y mock demo
templates/google-sheets/ CSVs importables para iniciar una planilla
docs/                 referencia del esquema
```

## Comandos

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## Seguridad

- No comitees `.env.local` ni JSONs de service account.
- Rotá cualquier credencial que haya sido compartida fuera de tu entorno seguro.
- Usá una Google Sheet exclusiva del dashboard o limitá los datos que cargás.
- Para vender o publicar el template, entregá una copia sin credenciales y con datos demo.
