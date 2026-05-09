FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

COPY pom.xml .
RUN apk add --no-cache maven && \
    mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:21-jre-alpine AS runtime

RUN addgroup -S sti && adduser -S sti -G sti

WORKDIR /app

RUN mkdir -p logs && chown sti:sti logs

COPY --from=builder /app/target/sti-api-1.0.0.jar app.jar

USER sti

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
