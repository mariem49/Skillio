package esprit.subscription.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    private String userRole; // STUDENT/TRAINER/ENTERPRISE


    @Column(nullable = false)
    private String billingCycle; // MONTHLY/YEARLY

    @Column(nullable = false)
    private String status; // ACTIVE/CANCELLED/EXPIRED

    @Column(nullable = false)
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private PricingPlan pricingPlan;

}
