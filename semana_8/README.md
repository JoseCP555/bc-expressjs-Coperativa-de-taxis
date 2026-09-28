# Semana 8 — API Cooperativa de Taxis

Proyecto ExpressJS + TypeScript + MongoDB independiente para esta semana.

## Preparar en PowerShell

Desde la raíz del paquete, entra a esta carpeta con `cd .\semana_8` y ejecuta:

```powershell
Copy-Item .env.example .env
notepad .env
pnpm install
docker compose up -d mongo
pnpm seed:admin
pnpm dev
```

Antes de iniciar, reemplaza en `.env` las cadenas `REPLACE_` por dos secretos JWT diferentes de al menos 32 caracteres y una contraseña fuerte para el administrador. Guarda el archivo. No subas `.env`.

La API inicia en `http://localhost:3008`. Comprueba `/health`. En `requests.http` hay solicitudes de prueba. El servidor usa cookies HttpOnly; Postman o Thunder Client debe conservarlas entre peticiones.

## Funciones de esta semana

- Todo lo necesario de autenticación JWT de la semana 7, incluido como proyecto independiente.
- Roles `customer`, `driver`, `dispatcher` y `admin`, con middleware `requireRole`.
- Servicios de taxi: clientes solicitan, despacho asigna conductores y el conductor actualiza el estado de sus viajes.
- Helmet, CORS con allowlist, rate limits (100 global/5 auth por 15 min) y sanitización de entradas.
- Administrador inicial creado desde variables locales con `pnpm seed:admin`.

## Requisitos

Node.js 22 o compatible, pnpm y Docker Desktop con MongoDB. Si ya tienes MongoDB local, configura `MONGO_URI` y no levantes el servicio Docker. Semana 7 usa MongoDB en el puerto 27017; Semana 8 usa el 27018. Las APIs usan los puertos 3007 y 3008, así que pueden correr al mismo tiempo. Para detener una API usa `Ctrl + C`. Ejecuta `docker compose down` en la carpeta de esa semana para detener su MongoDB.
