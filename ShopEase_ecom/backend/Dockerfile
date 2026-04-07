# ─── Stage 1: Build ───────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy Maven wrapper + pom first (layer cache — only re-downloads deps when pom changes)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

# Copy source and build the JAR
COPY src ./src
RUN ./mvnw clean package -DskipTests -q

# ─── Stage 2: Run ─────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy only the built JAR from the build stage
COPY --from=build /app/target/Ecom-0.0.1-SNAPSHOT.jar app.jar

# Render injects PORT automatically; default to 8080 locally
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
