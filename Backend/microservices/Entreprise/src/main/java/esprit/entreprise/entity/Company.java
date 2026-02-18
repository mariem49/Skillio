package esprit.entreprise.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String industry;

    @Column(nullable = false)
    private String location;

    private String website;

    private String logoUrl;

    @Column(nullable = false)
    private String email;

    private String phone;

    @Column(nullable = false)
    private Long enterpriseUserId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Constructors
    public Company() {
    }

    public Company(String name, String description, String industry, String location, 
                   String website, String logoUrl, String email, String phone, Long enterpriseUserId) {
        this.name = name;
        this.description = description;
        this.industry = industry;
        this.location = location;
        this.website = website;
        this.logoUrl = logoUrl;
        this.email = email;
        this.phone = phone;
        this.enterpriseUserId = enterpriseUserId;
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

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Long getEnterpriseUserId() {
        return enterpriseUserId;
    }

    public void setEnterpriseUserId(Long enterpriseUserId) {
        this.enterpriseUserId = enterpriseUserId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Company{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", industry='" + industry + '\'' +
                ", location='" + location + '\'' +
                ", email='" + email + '\'' +
                ", enterpriseUserId=" + enterpriseUserId +
                ", createdAt=" + createdAt +
                '}';
    }
}
