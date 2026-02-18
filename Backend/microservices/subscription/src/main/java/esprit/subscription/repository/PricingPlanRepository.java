package esprit.subscription.repository;

import esprit.subscription.entity.PricingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PricingPlanRepository extends JpaRepository<PricingPlan, Long> {
    List<PricingPlan> findByIsActiveTrue();
}
