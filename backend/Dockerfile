# ─── Stage 1: Build ───────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy everything
COPY . .

# Fix Windows line endings in mvnw, then build
RUN apt-get update && \
    apt-get install -y dos2unix -q && \
    dos2unix mvnw && \
    chmod +x mvnw && \
    ./mvnw clean package -DskipTests -q

# ─── Stage 2: Run ─────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/Ecom-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
