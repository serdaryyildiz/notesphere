package com.notesphere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication(scanBasePackages = "com.notesphere")
public class NoteSphereApplication {

    private static final Logger log = LoggerFactory.getLogger(NoteSphereApplication.class);

    public static void main(String[] args) {
        log.info("NoteSphere Application Started");
        SpringApplication.run(NoteSphereApplication.class, args);
    }
}
