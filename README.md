# Nest DevOps Lab

Aplicación web de ejemplo en **NestJS** para el laboratorio de Fundamentos de DevOps (Actividad 3). Incluye pipelines de CI con GitHub Actions y CD con Jenkins.

## Descripción del proyecto

API REST construida con [NestJS](https://nestjs.com/) y Node.js que expone un **módulo de Tareas** (CRUD en memoria). Incluye servicios, controladores, DTOs, tests unitarios y e2e, y sirve como base para los pipelines de CI (GitHub Actions) y CD (Jenkins).

### Estructura de la aplicación

- **App:** ruta raíz `GET /` (mensaje de bienvenida).
- **Tasks (módulo):**
  - `POST /tasks` — Crear tarea. Body: `{ "title": string (1-200 chars), "completed?": boolean, "priority?": "low"|"medium"|"high", "dueDate?": string (ISO 8601) }`. Validación con class-validator; título obligatorio.
  - `GET /tasks` — Listar tareas. Query opcional: `?completed=true|false` para filtrar.
  - `GET /tasks/completed` — Listar solo tareas completadas.
  - `GET /tasks/pending` — Listar solo tareas pendientes.
  - `GET /tasks/priority/:level` — Listar por prioridad (`low`, `medium`, `high`).
  - `GET /tasks/:id` — Obtener una tarea por id.
  - `PATCH /tasks/:id` — Actualizar tarea (mismos campos opcionales que create).
  - `DELETE /tasks/:id` — Eliminar tarea (204).

Cada tarea tiene: `id`, `title`, `completed`, `createdAt`, `priority` (por defecto `medium`) y opcionalmente `dueDate`. Las tareas se almacenan en memoria (sin base de datos) para simplificar el laboratorio.

## Requisitos

- Node.js 20+
- npm

## Instalación y ejecución

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd nest-devops-lab

# Instalar dependencias
npm install

# Modo desarrollo
npm run start:dev

# Modo producción (tras compilar)
npm run build
npm run start:prod
```

La aplicación queda disponible en `http://localhost:3000`.

## Pruebas

```bash
# Tests unitarios (servicios, controladores, app)
npm run test

# Tests e2e (API completa)
npm run test:e2e

# Cobertura
npm run test:cov

# Lint (análisis estático)
npm run lint
```

## Flujo CI/CD

Este repositorio define dos pipelines:

### 1. Pipeline CI (GitHub Actions)

- **Archivo:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
- **Cuándo se ejecuta:** En cada `push` y en cada `pull_request` a las ramas `main` o `master`.
- **Qué hace:**
  1. **Checkout del código** desde el repositorio.
  2. **Configuración de Node.js** (v20) con caché de npm.
  3. **Instalación de dependencias** con `npm ci`.
  4. **Ejecución de pruebas** con `npm run test`.
  5. **Análisis estático** con `npm run lint` (ESLint).

Si algún paso falla, el workflow marca el commit/PR como fallido y se evita integrar código que no compila o no pasa tests.

### 2. Pipeline CD (Jenkins)

- **Archivo:** [`Jenkinsfile`](Jenkinsfile)
- **Stages definidos:**
  1. **Clonar repositorio:** Obtiene el código desde Git (`checkout scm`).
  2. **Construir imagen Docker:** Ejecuta `docker build` usando el [Dockerfile](Dockerfile) del proyecto.
  3. **Publicar imagen en registro:** Login en el registro (p. ej. Docker Hub) y `docker push` de la imagen construida.

Para que el pipeline CD funcione en Jenkins hay que:

- Tener Docker instalado y accesible desde el agente.
- Crear en Jenkins una credencial de tipo "Username with password" con ID `dockerhub-credentials` (usuario y contraseña de Docker Hub).
- Ajustar en el `Jenkinsfile` la variable `IMAGE_NAME` con tu usuario y nombre de imagen (p. ej. `mi-usuario/nest-devops-lab`).

## Estructura relevante del repositorio

| Archivo / carpeta           | Descripción                          |
|----------------------------|--------------------------------------|
| `.github/workflows/ci.yml` | Definición del pipeline CI           |
| `Jenkinsfile`              | Definición del pipeline CD (Jenkins) |
| `Dockerfile`               | Imagen Docker multi-stage para la app|
| `.dockerignore`            | Exclusiones para el build Docker     |

## Documentación técnica

Para la justificación de tecnologías, diagrama de arquitectura y relación con DevOps, ver el documento técnico en [docs/DOCUMENTO_TECNICO.md](docs/DOCUMENTO_TECNICO.md) (o el PDF generado a partir de él).

## Licencia

UNLICENSED (proyecto educativo).
