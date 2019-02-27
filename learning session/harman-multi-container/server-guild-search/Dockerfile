#################################
# Option 1 - Run maven to compile and package as part of the docker build
#################################
FROM maven:3.5.2-jdk-8-alpine AS MAVEN_TOOL_CHAIN
COPY pom.xml /tmp/
COPY src /tmp/src/
WORKDIR /tmp/

ENV REDIS_HOST redis
ENV REDIS_PORT 6379
ENV PGUSER postgres
ENV PGHOST postgres
ENV PGDATABASE postgres
ENV PGPASSWORD postgres_password
ENV PGPORT 5432

RUN mvn package -DskipTests

FROM openjdk:8-jdk-alpine
COPY --from=MAVEN_TOOL_CHAIN /tmp/target/server-guild-search-*.jar /app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]

#################################
# Option 2 - build maven outside the docker, and just pack it with docker
#################################
#FROM openjdk:8-jdk-alpine
#VOLUME /tmp
#COPY target/server-guild-search-0.0.1-SNAPSHOT.jar /app.jar
#ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]