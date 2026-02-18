package esprit.subscription.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "pricing_plans")
public class PricingPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // BASIC/PRO/PREMIUM

    private String description;

    @Column(nullable = false)
    private Double monthlyPrice;

    @Column(nullable = false)
    private Double yearlyPrice;

    @Column(length = 2000)
    private String features; // Comma-separated or JSON string

    @Column(nullable = false)
    private Boolean isActive;

    @Column(nullable = false)
    private Boolean highlight; // Marks recommended plan

    // Constructors
    public PricingPlan() {
    }

    public PricingPlan(String name, String description, Double monthlyPrice, Double yearlyPrice, String features, Boolean isActive, Boolean highlight) {
        this.name = name;
        this.description = description;
        this.monthlyPrice = monthlyPrice;
        this.yearlyPrice = yearlyPrice;
        this.features = features;
        this.isActive = isActive;
        this.highlight = highlight;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getMonthlyPrice() {
        return monthlyPrice;
    }

    public void setMonthlyPrice(Double monthlyPrice) {
        this.monthlyPrice = monthlyPrice;
    }

    public Double getYearlyPrice() {
        return yearlyPrice;
    }

    public void setYearlyPrice(Double yearlyPrice) {
        this.yearlyPrice = yearlyPrice;
    }

    public String getFeatures() {
        return features;
    }

    public void setFeatures(String features) {
        this.features = features;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getHighlight() {
        return highlight;
    }

    public void setHighlight(Boolean highlight) {
        this.highlight = highlight;
    }

    @Override
    public String toString() {
        return "PricingPlan{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", monthlyPrice=" + monthlyPrice +
                ", yearlyPrice=" + yearlyPrice +
                ", isActive=" + isActive +
                ", highlight=" + highlight +
                '}';
    }
}
