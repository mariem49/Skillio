package esprit.subscription.config;

import esprit.subscription.entity.PricingPlan;
import esprit.subscription.repository.PricingPlanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(PricingPlanRepository pricingPlanRepository) {
        return args -> {
            if (pricingPlanRepository.count() == 0) {
                // BASIC Plan
                pricingPlanRepository.save(new PricingPlan(
                        "BASIC",
                        "Perfect for getting started",
                        9.99,
                        99.99,
                        "Access to free courses,Limited course materials,Basic support",
                        true,
                        false
                ));

                // PRO Plan
                pricingPlanRepository.save(new PricingPlan(
                        "PRO",
                        "Best for career growth",
                        29.99,
                        299.99,
                        "Access to all courses,Full course materials,Priority support,Certificate of completion",
                        true,
                        true
                ));

                // PREMIUM Plan
                pricingPlanRepository.save(new PricingPlan(
                        "PREMIUM",
                        "Complete mastery package",
                        59.99,
                        599.99,
                        "Access to all courses,Full course materials,24/7 Priority support,Certificate of completion,1-on-1 Mentorship,Offline access",
                        true,
                        false
                ));
                
                System.out.println("Default pricing plans initialized.");
            }
        };
    }
}
