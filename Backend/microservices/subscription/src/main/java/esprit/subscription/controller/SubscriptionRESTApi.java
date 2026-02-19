package esprit.subscription.controller;

import esprit.subscription.DTO.subb;
import esprit.subscription.entity.PricingPlan;
import esprit.subscription.entity.Subscription;
import esprit.subscription.service.PricingPlanService;
import esprit.subscription.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sub")
public class SubscriptionRESTApi {

    @Autowired
    private PricingPlanService pricingPlanService;

    @Autowired
    private SubscriptionService subscriptionService;

    // --- Pricing Plan Endpoints ---

    @GetMapping("/plans")
    public ResponseEntity<List<PricingPlan>> getActivePlans() {
        List<PricingPlan> plans = pricingPlanService.findAllActive();
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }

    @GetMapping("/plans/all")
    public ResponseEntity<List<PricingPlan>> getAllPlans() {
        List<PricingPlan> plans = pricingPlanService.findAll();
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }

    @GetMapping("/plans/{id}")
    public ResponseEntity<PricingPlan> getPlanById(@PathVariable Long id) {
        Optional<PricingPlan> plan = pricingPlanService.findById(id);
        return plan.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/plans")
    public ResponseEntity<PricingPlan> createPlan(@RequestBody PricingPlan plan) {
        PricingPlan createdPlan = pricingPlanService.save(plan);
        return new ResponseEntity<>(createdPlan, HttpStatus.CREATED);
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<PricingPlan> updatePlan(@PathVariable Long id, @RequestBody PricingPlan plan) {
        PricingPlan updatedPlan = pricingPlanService.update(id, plan);
        if (updatedPlan != null) {
            return new ResponseEntity<>(updatedPlan, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/plans/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        pricingPlanService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // --- Subscription Endpoints ---

    @GetMapping("/subscriptions")
    public ResponseEntity<List<Subscription>> getAll() {
        List<Subscription> subscriptions = subscriptionService.findAll();
        return new ResponseEntity<>(subscriptions, HttpStatus.OK);
    }

    @GetMapping("/subscriptions/user/{userId}")
    public ResponseEntity<List<Subscription>> getByUserId(@PathVariable Long userId) {
        List<Subscription> subscriptions = subscriptionService.findByUserId(userId);
        return new ResponseEntity<>(subscriptions, HttpStatus.OK);
    }

    @GetMapping("/subscriptions/user/{userId}/current")
    public ResponseEntity<Subscription> getCurrentSubscription(@PathVariable Long userId) {
        Optional<Subscription> subscription = subscriptionService.findActiveSubscription(userId);
        return subscription.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NO_CONTENT));
    }

    @PostMapping("/subscriptions")
    public ResponseEntity<Subscription> createSubscription(@RequestBody subb subs) {

        // Vérifier si le plan existe
        PricingPlan plan = pricingPlanService.findById(subs.getPlanId())
                .orElseThrow(() -> new RuntimeException("Pricing plan not found"));

        Subscription subscription = new Subscription();

        subscription.setUserId(subs.getUserId());
        subscription.setUserRole(subs.getUserRole());
        subscription.setPricingPlan(plan);
        subscription.setBillingCycle(subs.getBillingCycle());

        // Date de début
        LocalDateTime now = LocalDateTime.now();
        subscription.setStartDate(now);

        // Calcul de la date de fin selon le billingCycle
        if ("MONTHLY".equalsIgnoreCase(subs.getBillingCycle())) {
            subscription.setEndDate(now.plusMonths(1));
        } else if ("YEARLY".equalsIgnoreCase(subs.getBillingCycle())) {
            subscription.setEndDate(now.plusYears(1));
        } else {
            throw new RuntimeException("Invalid billing cycle");
        }

        // Status par défaut
        subscription.setStatus("ACTIVE");

        // Date de création
        subscription.setCreatedAt(now);

        Subscription createdSubscription = subscriptionService.subscribe(subscription);

        return new ResponseEntity<>(createdSubscription, HttpStatus.CREATED);
    }


    @PutMapping("/subscriptions/{id}/cancel")
    public ResponseEntity<Subscription> cancelSubscription(@PathVariable Long id) {
        Subscription cancelledSubscription = subscriptionService.cancel(id);
        if (cancelledSubscription != null) {
            return new ResponseEntity<>(cancelledSubscription, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/subscriptions/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id) {
        subscriptionService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
