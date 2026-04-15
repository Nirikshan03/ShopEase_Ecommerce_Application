# ShopEase (Simple Setup)

Clean full-stack ecommerce project with:
- `backend`: Spring Boot + MySQL
- `frontend`: React

## 1) Quick Start (Without Docker)

### Backend
1. Start MySQL locally (or with Docker).
2. From `backend`:
   - `./mvnw spring-boot:run` (Linux/macOS)
   - `mvnw.cmd spring-boot:run` (Windows)
3. Backend runs on `http://localhost:8080`.

### Frontend
1. From `frontend`:
   - `npm install`
   - `npm start`
2. Frontend runs on `http://localhost:3000`.

## 2) Quick Start (With Docker Compose)

From repo root:
- `docker-compose up --build`

This starts:
- MySQL on `3306`
- Backend on `8080`
- Frontend on `3000`

## 3) Test Commands

### Backend tests
- `cd backend`
- `./mvnw test` (Linux/macOS) or `mvnw.cmd test` (Windows)

### Frontend tests (single run)
- `cd frontend`
- `set CI=true && npx react-scripts test --watchAll=false --passWithNoTests` (PowerShell: `$env:CI='true'; npx react-scripts test --watchAll=false --passWithNoTests`)

## 4) What Was Removed

To keep this repo simple and beginner-friendly:
- Removed Jenkins pipeline (`Jenkinsfile`)
- Removed Kubernetes manifests (`k8s/`)
- Kept only a lightweight GitHub Actions CI workflow

If you need production-grade DevOps later, Jenkins/Kubernetes can be added back in a separate branch.
