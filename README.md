# Nest DevOps Lab

Aplicación web de ejemplo en **NestJS** para el laboratorio de Fundamentos de DevOps (Actividad 3). Incluye pipelines de CI con GitHub Actions y CD con Jenkins.

## Descripción del proyecto

API REST construida con [NestJS](https://nestjs.com/) y Node.js que expone un **módulo de Tareas** (CRUD en memoria). Incluye servicios, controladores, DTOs, tests unitarios y e2e, y sirve como base para los pipelines de CI (GitHub Actions) y CD (Jenkins).

### Estructura de la aplicación

- **App:**
  - `GET /` — Mensaje de bienvenida.
  - `GET /health` — Health check: `{ status, version, timestamp }`.
- **Tasks (módulo):**
  - `POST /tasks` — Crear tarea. Body: `{ "title": string (1-200 chars), "description?": string (máx. 500 chars), "completed?": boolean, "priority?": "low"|"medium"|"high", "dueDate?": string (ISO 8601) }`. Validación con class-validator; título obligatorio.
  - `GET /tasks` — Listar tareas. Query opcional: `?completed=true|false` para filtrar.
  - `GET /tasks/stats` — Estadísticas: `{ total, completed, pending }`.
  - `GET /tasks/completed` — Listar solo tareas completadas.
  - `GET /tasks/pending` — Listar solo tareas pendientes.
  - `GET /tasks/priority/:level` — Listar por prioridad (`low`, `medium`, `high`).
  - `GET /tasks/:id` — Obtener una tarea por id.
  - `PATCH /tasks/:id` — Actualizar tarea (mismos campos opcionales que create).
  - `DELETE /tasks/:id` — Eliminar tarea (204).

La aplicación registra logs de cada petición HTTP (método, ruta, tiempo) y de las operaciones CRUD en tareas (crear, actualizar, eliminar), útiles para monitoreo y evidencias.

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
- **Cuándo se ejecuta:** En cada `pull_request` a las ramas `main` o `master` (la rama main está protegida; los cambios entran solo por PR).
- **Qué hace:**
  1. **Checkout del código**, configuración de Node.js (v20), instalación de dependencias (`npm ci`).
  2. **Pruebas** (`npm run test`, `npm run test:e2e`) y **análisis estático** (`npm run lint`).
  3. **Compilación** (`npm run build`).
  4. **Análisis SonarQube** (job en self-hosted): calidad de código y cobertura.
  5. **Análisis Snyk** (job en GitHub): vulnerabilidades en dependencias.

Si algún paso falla, el workflow marca el PR como fallido y no se puede mergear.

### 2. Pipeline CD (Jenkins)

- **Archivo:** [`Jenkinsfile`](Jenkinsfile) y [`.github/workflows/cd.yml`](.github/workflows/cd.yml)
- **Stages en Jenkins:** Clonar repositorio, construir imagen Docker en Minikube, desplegar en Kubernetes (`kubectl apply -f k8s/`).
- El CD se dispara desde **GitHub Actions** al hacer push a `main` (p. ej. al mergear un PR).

El laboratorio incluye además:

- **SonarQube** (Docker): análisis de código, integrado en el CI (job en self-hosted).
- **Snyk:** análisis de dependencias en el CI.
- **Kubernetes (Minikube):** despliegue de la aplicación (manifiestos en `k8s/`).
- **Prometheus y Grafana:** desplegados en el cluster; la app expone `/metrics`; Grafana usa Prometheus como datasource.

## Estructura relevante del repositorio

| Archivo / carpeta              | Descripción                              |
|-------------------------------|------------------------------------------|
| `.github/workflows/ci.yml`   | Pipeline CI (build, test, lint, SonarQube, Snyk) |
| `.github/workflows/cd.yml`   | Workflow CD (disparo de Jenkins al merge a main)  |
| `Jenkinsfile`                 | Pipeline CD en Jenkins (build + deploy K8s)       |
| `Dockerfile`                  | Imagen Docker multi-stage para la app    |
| `k8s/`                        | Manifiestos de la app (Deployment, Service)      |
| `k8s/monitoring/`             | Prometheus y Grafana                      |
| `sonar-project.properties`   | Configuración de SonarQube                |
| `.dockerignore`               | Exclusiones para el build Docker          |

## Documentación técnica

Para la justificación de tecnologías, diagrama de arquitectura y relación con DevOps, ver el documento técnico en [docs/DOCUMENTO_TECNICO.md](docs/DOCUMENTO_TECNICO.md) (o el PDF generado a partir de él).

## Evidencias y entrega

Para la entrega del laboratorio (guía de actividades y rúbrica), consultar **[EVIDENCIAS.md](EVIDENCIAS.md)**, donde se detalla:

- Contenido del entregable (repositorio, dashboard, informe de seguridad).
- Checklist de instrucciones de entrega (enlace al repo, capturas de CI/CD, Grafana, seguridad).
- Referencia al documento técnico y guía rápida de qué capturar por criterio de la rúbrica.
- Línea del tiempo sugerida para pantallazos (cambio en código → PR → CI → merge → CD → despliegue → monitoreo).

## Licencia

UNLICENSED (proyecto educativo).
