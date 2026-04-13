# ─── Stage 1: Build ───────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy everything
COPY . .

# Use the native 'mvn' bundled with the Docker base image instead of mvnw to prevent any wrapper/line-ending issues
RUN MAVEN_OPTS="" MAVEN_ARGS="" mvn clean package -DskipTests -q

# ─── Stage 2: Run ─────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/Ecom-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
