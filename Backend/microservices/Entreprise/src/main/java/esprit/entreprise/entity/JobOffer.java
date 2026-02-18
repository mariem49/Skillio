package esprit.entreprise.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_offers")
public class JobOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String contractType; // CDI, CDD, INTERNSHIP, FREELANCE

    @Column(nullable = false)
    private String location;

    private Double salary;

    @Column(nullable = false)
    private String remote; // ON_SITE, HYBRID, FULL_REMOTE

    @Column(length = 2000)
    private String requirements;

    @Column(nullable = false)
    private Long companyId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Boolean isActive;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isActive == null) {
            isActive = true;
        }
    }

    // Constructors
    public JobOffer() {
    }

    public JobOffer(String title, String description, String contractType, String location,
                    Double salary, String remote, String requirements, Long companyId, Boolean isActive) {
        this.title = title;
        this.description = description;
        this.contractType = contractType;
        this.location = location;
        this.salary = salary;
        this.remote = remote;
        this.requirements = requirements;
        this.companyId = companyId;
        this.isActive = isActive != null ? isActive : true;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContractType() {
        return contractType;
    }

    public void setContractType(String contractType) {
        this.contractType = contractType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public String getRemote() {
        return remote;
    }

    public void setRemote(String remote) {
        this.remote = remote;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    @Override
    public String toString() {
        return "JobOffer{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", contractType='" + contractType + '\'' +
                ", location='" + location + '\'' +
                ", remote='" + remote + '\'' +
                ", companyId=" + companyId +
                ", isActive=" + isActive +
                ", createdAt=" + createdAt +
                '}';
    }
}
