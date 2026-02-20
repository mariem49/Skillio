package esprit.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder){

        return builder.routes() .route("Entreprise",r->r.path("/entreprise/**")
                       .uri("lb://ENTREPRISE") )
                .route("subscription",r->r.path("/sub/**")
                        .uri("lb://SUBSCRIPTION") )
                .route("training", r->r.path("/trainings/**")
                        .uri("lb://TRAINING"))

                        

                        .build();
    }
}
