# ShopEase Ecommerce Application

ShopEase is a full-stack ecommerce application built with a robust Spring Boot backend and a responsive React frontend. It supports seamless product browsing, secure authentication-ready backend APIs, MySQL data persistence, and easy Docker-based local setups.

## 🚀 Live Demo

- **Frontend Application**: [https://sweet-longma-6569ad.netlify.app/](https://sweet-longma-6569ad.netlify.app/)
- **Backend API Server**: Deployed and hosted on **Render**.
- **Database**: Managed **MySQL** instance hosted on **Aiven**.

## 🛠 Tech Stack

- **Backend**: `Java 17`, `Spring Boot`, `Spring Data JPA`, `Spring Security`, `MySQL`
- **Frontend**: `React 18`, `React Router`, `Axios`, `CSS3`
- **DevOps**: `Docker`, `Docker-Compose`, `GitHub Actions` (CI/CD)
- **Deployment & Cloud Providers**: `Render` (Backend App), `Netlify` (Frontend Application), `Aiven` (MySQL Database)

## 📂 Project Structure

- `backend/` - Spring Boot RESTful API containing all services, security configurations, controllers, and models.
- `frontend/` - React client application designed with reusable UI components and dynamic routing.
- `.github/workflows/ci.yml` - CI pipeline setup for backend/frontend checks ensuring test reliabilities.
- `docker-compose.yml` - Local multi-service staging environment mapping (MySQL + Backend + Frontend).

## 💻 Prerequisites

- **Java 17+**
- **Node.js 18+** and **npm**
- **MySQL 8** (only needed if not using Docker locally)
- **Docker Desktop** (optional, recommended for easiest setup via containerization)

## 🏃 Run Locally (Without Docker)

### 1) Start Backend

From `backend/`:

- Windows:
  - `mvnw.cmd spring-boot:run`
- Linux/macOS:
  - `./mvnw spring-boot:run`

Backend default URL operates at: `http://localhost:8080`

### 2) Start Frontend

From `frontend/`:

- `npm install`
- `npm start`

Frontend default development port operates at: `http://localhost:3000`

## 🐳 Run with Docker-Compose (Recommended)

From the project root simply orchestrate your containers:

- `docker-compose up --build`

This starts parallel dependent services:
- MySQL Database: `localhost:3306`
- Backend Spring API: `http://localhost:8080`
- Frontend React Client: `http://localhost:3000`

Stop all services gracefully:
- `docker-compose down`

Stop and remove associated persist volumes:
- `docker-compose down -v`

## ⚙️ Environment Configuration

The backend application dynamically reads values from environment variables relying on safe local defaults during development mode. Configure these keys directly within your hosting platforms for production.

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `ALLOWED_ORIGIN`
- `PORT` (Required mapping for cloud deployments like Render)

See `backend/src/main/resources/application.properties` for complete configurations.

## 🧪 Build and Test

### Backend Services

From `backend/`:

- Run Tests:
  - Windows: `mvnw.cmd test`
  - Linux/macOS: `./mvnw test`
- Build executable jar:
  - Windows: `mvnw.cmd clean package`
  - Linux/macOS: `./mvnw clean package`

### Frontend Application

From `frontend/`:

- Install all resolved dependencies: `npm ci`
- Run local unit tests continuously or test directly for CI pipelines mode:
  - PowerShell: `$env:CI='true'; npx react-scripts test --watchAll=false --passWithNoTests`
  - CMD: `set CI=true && npx react-scripts test --watchAll=false --passWithNoTests`
- Create a bundled production build: `npm run build`

## 🔄 CI Pipeline

Integrated GitHub Actions workflow at `.github/workflows/ci.yml` strictly guards the main branch against untested PRs:

- **Backend Job**: Automatically instances a MySQL service wrapper, triggers standard schema creation, and executes all unit tests via Maven.
- **Frontend Job**: Verifies lockfile integrity via `npm ci`, builds frontend, and executes all testing components actively.

## 🚀 Deployment Environment Strategy

- **Backend config**: Containerized and exposed via `backend/render.yaml` directives mappings on Render Web Services.
- **Frontend config**: Hosted implicitly via serverless static hosting instructions generated in `frontend/netlify.toml` mapped to Netlify servers.
- **Database integrity**: Configured securely via Aiven's managed cloud environments without openly documented strings.

## 📊 Health and Monitoring Metrics

The backend API safely monitors the health statistics leveraging the custom actuator frameworks via HTTP:

- `/actuator/health`
- `/actuator/info`
- `/actuator/metrics`
- `/actuator/prometheus`
