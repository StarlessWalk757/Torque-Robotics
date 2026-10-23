# Builds Torque into one container: the React app is compiled, packed into the Java server, and served
# by it. Three stages keep the final image small (only a Java runtime and the jar ship).

# ---- 1. Build the web app -------------------------------------------------------------------------------
FROM node:20-slim AS web
WORKDIR /web
COPY web/package.json web/package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY web/ ./
RUN npm run check:content && npm run build

# ---- 2. Build the server, with the web app inside it ----------------------------------------------------
FROM maven:3.9-eclipse-temurin-21 AS server
WORKDIR /src
COPY server/pom.xml ./server/pom.xml
# Pre-download dependencies so later code changes don't refetch them.
RUN mvn -q -f server/pom.xml -B dependency:go-offline
COPY server/ ./server/
COPY --from=web /server/src/main/resources/static ./server/src/main/resources/static
RUN mvn -q -f server/pom.xml -B package

# ---- 3. Run it ------------------------------------------------------------------------------------------
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=server /src/server/target/torque.jar torque.jar
# Tuned for a small (512 MB) container: cap the heap and use the simplest collector.
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=70 -XX:+UseSerialGC -Xss512k"
ENV PORT=8080
EXPOSE 8080
CMD ["java", "-jar", "torque.jar"]
