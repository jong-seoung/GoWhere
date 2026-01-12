# ===== build stage =====
FROM gradle:8.14.3-jdk17-alpine AS build
WORKDIR /app

COPY build.gradle settings.gradle ./
COPY gradle gradle
COPY gradlew gradlew
RUN chmod +x gradlew

COPY src ./src
RUN ./gradlew clean build -x test

# ===== run stage =====
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
