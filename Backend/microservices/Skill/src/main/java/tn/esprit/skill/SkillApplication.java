package tn.esprit.skill;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class SkillApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillApplication.class, args);
    }

}
