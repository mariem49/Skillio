package esprit.subscription.service;

import esprit.subscription.entity.Subscription;
import esprit.subscription.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public List<Subscription> findAll() {
        return subscriptionRepository.findAll();
    }

    public List<Subscription> findByUserId(Long userId) {
        return subscriptionRepository.findByUserId(userId);
    }

    public Optional<Subscription> findActiveSubscription(Long userId) {
        return subscriptionRepository.findByUserIdAndStatus(userId, "ACTIVE");
    }

    @Transactional
    public Subscription subscribe(Subscription subscription) {
        // Cancel any existing active subscription first
        Optional<Subscription> existingSub = findActiveSubscription(subscription.getUserId());
        if (existingSub.isPresent()) {
            Subscription oldSub = existingSub.get();
            oldSub.setStatus("CANCELLED");
            oldSub.setEndDate(LocalDateTime.now());
            subscriptionRepository.save(oldSub);
        }

        // Set up new subscription details
        subscription.setStatus("ACTIVE");
        subscription.setStartDate(LocalDateTime.now());
        subscription.setCreatedAt(LocalDateTime.now());
        
        if ("YEARLY".equalsIgnoreCase(subscription.getBillingCycle())) {
            subscription.setEndDate(LocalDateTime.now().plusYears(1));
        } else {
            subscription.setEndDate(LocalDateTime.now().plusMonths(1));
        }

        // Explicitly save the entity to the database
        return subscriptionRepository.save(subscription);
    }

    @Transactional
    public Subscription cancel(Long id) {
        Optional<Subscription> optionalSub = subscriptionRepository.findById(id);
        if (optionalSub.isPresent()) {
            Subscription subscription = optionalSub.get();
            subscription.setStatus("CANCELLED");
            subscription.setEndDate(LocalDateTime.now());
            return subscriptionRepository.save(subscription);
        }
        return null;
    }

    @Transactional
    public void delete(Long id) {
        subscriptionRepository.deleteById(id);
    }
}
