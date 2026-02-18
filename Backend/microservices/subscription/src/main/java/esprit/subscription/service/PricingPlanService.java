package esprit.subscription.service;

import esprit.subscription.entity.PricingPlan;
import esprit.subscription.repository.PricingPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PricingPlanService {

    @Autowired
    private PricingPlanRepository pricingPlanRepository;

    public List<PricingPlan> findAllActive() {
        return pricingPlanRepository.findByIsActiveTrue();
    }

    public List<PricingPlan> findAll() {
        return pricingPlanRepository.findAll();
    }

    public Optional<PricingPlan> findById(Long id) {
        return pricingPlanRepository.findById(id);
    }

    public PricingPlan save(PricingPlan pricingPlan) {
        if (pricingPlan.getIsActive() == null) {
            pricingPlan.setIsActive(true);
        }
        return pricingPlanRepository.save(pricingPlan);
    }

    public PricingPlan update(Long id, PricingPlan pricingPlanDetails) {
        Optional<PricingPlan> optionalPlan = pricingPlanRepository.findById(id);
        if (optionalPlan.isPresent()) {
            PricingPlan pricingPlan = optionalPlan.get();
            pricingPlan.setName(pricingPlanDetails.getName());
            pricingPlan.setDescription(pricingPlanDetails.getDescription());
            pricingPlan.setMonthlyPrice(pricingPlanDetails.getMonthlyPrice());
            pricingPlan.setYearlyPrice(pricingPlanDetails.getYearlyPrice());
            pricingPlan.setFeatures(pricingPlanDetails.getFeatures());
            pricingPlan.setIsActive(pricingPlanDetails.getIsActive());
            pricingPlan.setHighlight(pricingPlanDetails.getHighlight());
            return pricingPlanRepository.save(pricingPlan);
        }
        return null;
    }

    public void delete(Long id) {
        pricingPlanRepository.deleteById(id);
    }
}
