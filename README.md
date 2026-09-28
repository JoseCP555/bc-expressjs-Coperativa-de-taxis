# Cooperativa de Taxis — API REST con ExpressJS

Proyecto académico de backend para practicar los contenidos de las **semanas 7 y 8** del curso ExpressJS. Está desarrollado con Node.js, Express, TypeScript y MongoDB. Las peticiones se prueban con Thunder Client o Postman; **no incluye una interfaz web**.

Repositorio: [bc-expressjs-Coperativa-de-taxis](https://github.com/JoseCP555/bc-expressjs-Coperativa-de-taxis)

## Estructura

```text
.
├── README.md
├── semana_7/       # Autenticación y servicios de taxi
└── semana_8/       # Autenticación, roles y seguridad
```

Cada semana es una API independiente y tiene su propio `package.json`, `pnpm-lock.yaml`, `.env.example`, configuración TypeScript, `docker-compose.yml`, código fuente y archivo `requests.http`. Los archivos `.env` reales, `node_modules` y `dist` no se deben subir al repositorio.

| Proyecto | API | MongoDB Docker | Enfoque |
|---|---|---:|---|
| Semana 7 | `http://localhost:3007` | `27017` | bcrypt, JWT, cookies HttpOnly, refresh token y viajes |
| Semana 8 | `http://localhost:3008` | `27018` | Autenticación, RBAC, protección de rutas y seguridad HTTP |

## Requisitos

- Node.js 22 o superior.
- pnpm.
- Docker Desktop iniciado, para ejecutar MongoDB con Docker Compose.
- Visual Studio Code con Thunder Client, o Postman.

## Instalación y ejecución

Realiza estos pasos **dentro de la carpeta de la semana que quieras ejecutar**. No ejecutes `pnpm install` desde la raíz del repositorio.

### 1. Preparar el entorno

Ejemplo para Semana 8 en PowerShell:

```powershell
cd .\semana_8
Copy-Item .env.example .env
notepad .env
```

En `.env`, reemplaza los valores que empiezan por `REPLACE_`:

- `JWT_ACCESS_SECRET`: secreto aleatorio de al menos 32 caracteres.
- `JWT_REFRESH_SECRET`: otro secreto aleatorio, distinto del anterior y de al menos 32 caracteres.
- `BOOTSTRAP_ADMIN_PASSWORD`: contraseña local fuerte para el administrador.

No pongas comillas y no compartas ni subas el `.env`. El correo inicial del administrador es `admin@taxicoop.local`. Guarda el archivo antes de continuar.

Semana 7 se prepara igual, cambiando la carpeta:

```powershell
cd ..\semana_7
Copy-Item .env.example .env
notepad .env
```

Si ya existe el `.env` de esa semana, no lo sobrescribas; abre el que tienes y comprueba que los dos secretos JWT sean distintos.

### 2. Instalar dependencias

En la carpeta de la semana elegida:

```powershell
pnpm install
```

En pnpm 10/11, si informa que bloqueó scripts de `bcrypt` y `esbuild`, apruébalos una vez:

```powershell
pnpm approve-builds
```

En la lista selecciona `bcrypt` y `esbuild` con la barra espaciadora y confirma con Enter. Después ejecuta:

```powershell
pnpm rebuild bcrypt esbuild
```

### 3. Iniciar MongoDB, crear el administrador e iniciar la API

Con Docker Desktop abierto, y desde la carpeta de esa semana:

```powershell
docker compose up -d mongo
pnpm seed:admin
pnpm dev
```

La terminal debe mostrar que MongoDB se conectó y que la API está escuchando. Déjala abierta mientras pruebas.

- Semana 7: abre `http://localhost:3007/health`.
- Semana 8: abre `http://localhost:3008/health`.

Una respuesta `{"status":"ok", ...}` confirma que la API está activa. También puedes detener el servidor con `Ctrl + C`. Para apagar el MongoDB de esa semana, desde su carpeta ejecuta `docker compose down`.

## Pruebas con Thunder Client

1. Abre en VS Code la carpeta del proyecto.
2. Selecciona el icono del rayo de **Thunder Client** y pulsa **New Request**.
3. Elige el método (`GET`, `POST` o `PATCH`), escribe la URL y pulsa **Send**.
4. Para `POST` y `PATCH`, abre **Body → JSON** y pega el cuerpo indicado abajo.
5. Usa el mismo Thunder Client para iniciar sesión y hacer las siguientes peticiones; debe conservar las cookies de sesión HttpOnly. No tienes que copiar ni enviar JWT manualmente.

En cada semana también está el archivo `requests.http` con solicitudes de ejemplo. Las solicitudes de registro y viaje crean datos en la base MongoDB local; usa un correo nuevo al registrar cada vez.

### Flujo rápido de pasajero (Semana 8)

**A. Registrar pasajero** — `POST http://localhost:3008/api/auth/register`

```json
{
  "name": "Cliente de prueba",
  "email": "cliente.prueba@example.com",
  "password": "TaxiCoop-Prueba-2026!"
}
```

Respuesta esperada: `201 Created`, mensaje `Cuenta creada.` y datos del usuario. Se asigna el rol `customer` y se establecen cookies de sesión.

**B. Iniciar sesión** — `POST http://localhost:3008/api/auth/login`

```json
{
  "email": "cliente.prueba@example.com",
  "password": "TaxiCoop-Prueba-2026!"
}
```

Respuesta esperada: `200 OK`, mensaje `Sesión iniciada.`. Si ya quedaste autenticado al registrar, también puedes usar este paso para comprobar el login.

**C. Solicitar un taxi** — `POST http://localhost:3008/api/trips`

```json
{
  "pickupAddress": "Calle 10 # 5-20, Bogotá",
  "dropoffAddress": "Aeropuerto El Dorado, Bogotá",
  "notes": "Recoger en la entrada principal"
}
```

Respuesta esperada: `201 Created` con el servicio creado y estado inicial `requested`.

**D. Consultar mis servicios** — `GET http://localhost:3008/api/trips`

Respuesta esperada: `200 OK` con los viajes visibles para la cuenta. Para el rol `customer`, solo devuelve sus propios servicios.

**E. Probar restricción por rol** — `GET http://localhost:3008/api/admin/users`

Con sesión de pasajero debe responder `403 Forbidden`. Luego inicia sesión en Thunder Client como `admin@taxicoop.local`, usando la contraseña definida en `.env`, y repite la petición: debe responder `200 OK` con la lista de usuarios.

## Rutas — Semana 7

Base URL: `http://localhost:3007`. Registro e inicio de sesión guardan las credenciales de sesión en cookies HttpOnly. Todas las rutas de viajes requieren autenticación.

| Método | Ruta | Acceso | Cuerpo JSON |
|---|---|---|---|
| `GET` | `/health` | Público | Sin cuerpo; verifica estado |
| `POST` | `/api/auth/register` | Público | `{"name":"Cliente","email":"cliente@example.com","password":"ClavePrueba2026!"}` |
| `POST` | `/api/auth/login` | Público | `{"email":"cliente@example.com","password":"ClavePrueba2026!"}` |
| `GET` | `/api/auth/me` | Sesión iniciada | Sin cuerpo; devuelve el usuario autenticado |
| `POST` | `/api/auth/refresh` | Cookie refresh | Sin cuerpo; renueva y rota la sesión |
| `POST` | `/api/auth/logout` | Cookie refresh | Sin cuerpo; cierra la sesión |
| `GET` | `/api/dashboard` | Sesión iniciada | Sin cuerpo; devuelve el usuario y mensaje del panel |
| `GET` | `/api/trips` | Sesión iniciada | Sin cuerpo; lista los viajes del usuario |
| `POST` | `/api/trips` | Sesión iniciada | `{"pickupAddress":"Calle 10 # 5-20, Bogotá","dropoffAddress":"Aeropuerto El Dorado, Bogotá","notes":"Entrada principal"}` |

## Rutas — Semana 8

Base URL: `http://localhost:3008`. La Semana 8 es independiente y trae sus propias rutas de autenticación y viajes, además de autorización por roles y controles de seguridad.

| Método | Ruta | Acceso | Cuerpo JSON |
|---|---|---|---|
| `GET` | `/health` | Público | Sin cuerpo; verifica estado |
| `GET` | `/api/public/info` | Público | Sin cuerpo; datos públicos de la API |
| `POST` | `/api/auth/register` | Público | `{"name":"Cliente","email":"cliente@example.com","password":"ClavePrueba2026!"}` |
| `POST` | `/api/auth/login` | Público | `{"email":"cliente@example.com","password":"ClavePrueba2026!"}` |
| `GET` | `/api/auth/me` | Sesión iniciada | Sin cuerpo; devuelve el usuario autenticado |
| `POST` | `/api/auth/refresh` | Cookie refresh | Sin cuerpo; renueva y rota la sesión |
| `POST` | `/api/auth/logout` | Cookie refresh | Sin cuerpo; cierra la sesión |
| `GET` | `/api/dashboard` | Cualquier rol autenticado | Sin cuerpo; devuelve el panel y el usuario |
| `GET` | `/api/trips` | Cualquier rol autenticado | Sin cuerpo; lista los viajes visibles para ese rol |
| `POST` | `/api/trips` | Rol `customer` | `{"pickupAddress":"Calle 10 # 5-20, Bogotá","dropoffAddress":"Aeropuerto El Dorado, Bogotá","notes":"Entrada principal"}` |
| `GET` | `/api/admin/users` | Solo `admin` | Sin cuerpo; devuelve usuarios y roles |
| `PATCH` | `/api/admin/users/:userId/role` | Solo `admin` | `{"role":"driver"}`; roles válidos: `admin`, `dispatcher`, `driver`, `customer` |
| `PATCH` | `/api/trips/:tripId/assign` | `admin` o `dispatcher` | `{"driverId":"ID_MONGODB_DEL_CONDUCTOR"}` |
| `PATCH` | `/api/trips/:tripId/status` | `admin`, `dispatcher` o conductor asignado | `{"status":"in_progress"}`; estados admitidos: `in_progress`, `completed`, `cancelled` |

Para asignar un conductor, primero crea una cuenta y, desde la cuenta admin, cámbiale el rol con `PATCH /api/admin/users/:userId/role`. Usa el `id` que devuelve la lista de usuarios como `driverId` en la asignación. Los cambios de estado válidos son: `requested → cancelled`, `assigned → in_progress` o `cancelled`, e `in_progress → completed` o `cancelled`.

### Rutas, sesiones y cookies

- `POST /api/auth/register`: crea cuentas con rol inicial `customer`; el nombre requiere entre 2 y 80 caracteres, el correo debe ser válido y la contraseña debe tener entre 10 y 72 caracteres.
- `POST /api/auth/login`: valida correo y contraseña. La cuenta admin inicial usa el correo configurado en `BOOTSTRAP_ADMIN_EMAIL`.
- La API entrega las cookies `accessToken` y `refreshToken` con atributo `HttpOnly`; el refresh token se renueva de forma rotativa. Thunder Client debe conservarlas entre solicitudes.
- Sin sesión, una ruta protegida responde `401 Unauthorized`; con una sesión sin el rol requerido, responde `403 Forbidden`.

## Seguridad implementada en Semana 8

- Helmet agrega cabeceras HTTP de seguridad.
- CORS acepta por defecto los orígenes `http://localhost:3000` y `http://localhost:5173`; se pueden cambiar en `CORS_ORIGINS` del `.env`.
- Limitador global: hasta 100 solicitudes por ventana de 15 minutos. Rutas de autenticación: hasta 5 por ventana de 15 minutos.
- Validación de cuerpos, límites de tamaño JSON y limpieza de entradas HTML y patrones de NoSQL injection.
- Roles `customer`, `driver`, `dispatcher` y `admin`, con controles en las rutas protegidas.

Las pruebas de CORS y rate limiting pueden hacerse al final. Para rate limiting, repite solicitudes de login fallidas hasta superar el límite y espera la ventana de 15 minutos antes de volver a probar.

## Códigos de respuesta comunes

- `200 OK`: consulta, login o actualización correcta.
- `201 Created`: registro de usuario o solicitud de taxi creada.
- `400 Bad Request`: cuerpo o identificador inválido.
- `401 Unauthorized`: falta la sesión, expiró el token o las credenciales no son válidas.
- `403 Forbidden`: la sesión es válida, pero su rol no tiene permiso.
- `404 Not Found`: ruta o servicio inexistente.
- `409 Conflict`: transición de estado del viaje no permitida.
- `429 Too Many Requests`: se alcanzó el límite de solicitudes.

## Solución de problemas

- **MongoDB no conecta:** inicia Docker Desktop y, dentro de `semana_7` o `semana_8`, ejecuta `docker compose up -d mongo`.
- **Los secretos JWT deben ser diferentes:** revisa que `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` tengan 32 caracteres o más y valores distintos.
- **Thunder Client devuelve 401:** inicia sesión de nuevo y usa el mismo cliente para que envíe las cookies. Comprueba que no estés usando un navegador distinto.
- **El correo ya está registrado:** usa otro correo de prueba o inicia sesión con la cuenta existente.
- **Thunder Client devuelve 403 en administración:** es el resultado correcto para un cliente; inicia sesión como administrador para probar esas rutas.
- **Scripts de `bcrypt`/`esbuild` bloqueados por pnpm:** sigue el paso de `pnpm approve-builds` y `pnpm rebuild bcrypt esbuild` de esta guía.

## Seguridad y entrega

No publiques el archivo `.env`, contraseñas, secretos JWT, la carpeta `node_modules` ni información real de usuarios. El repositorio incluye `.env.example` como plantilla segura. Las dos carpetas son proyectos backend separados; no se incluye una interfaz gráfica.
