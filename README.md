# Cooperativa de Taxis — ExpressJS

Solo incluye dos proyectos backend independientes: `semana_7` y `semana_8`. Cada carpeta es la raíz ejecutable de una API ExpressJS + TypeScript + MongoDB. No contiene código React Native, teoría adicional ni otras semanas.

- `semana_7`: autenticación JWT, bcrypt, cookies HttpOnly y refresh token rotativo. API `http://localhost:3007`; MongoDB `27017`.
- `semana_8`: autenticación más RBAC y seguridad HTTP. API `http://localhost:3008`; MongoDB `27018`.

Cada carpeta incluye su propio `package.json`, configuración TypeScript, `.env.example`, `docker-compose.yml`, `src/`, `README.md` y `requests.http`. Entra a la carpeta de la semana para instalar dependencias con `pnpm install`; pnpm generará allí el lockfile. No instales dependencias en esta raíz.
