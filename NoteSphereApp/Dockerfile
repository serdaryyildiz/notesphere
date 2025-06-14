# 1. Java 17 tabanlı bir sistem kullan
FROM adoptopenjdk:17-jdk-hotspot

# 2. Projeyi çalıştırmak için JAR dosyasını container'a kopyala
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

# 3. Cloud Run varsayılan portu 8080 olduğu için bu portu aç
EXPOSE 8080

# 4. Java uygulamasını başlat
ENTRYPOINT ["java", "-jar", "/app.jar"]
