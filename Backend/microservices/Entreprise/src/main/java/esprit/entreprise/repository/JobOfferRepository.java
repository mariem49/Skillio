package esprit.entreprise.repository;

import esprit.entreprise.entity.JobOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {
    List<JobOffer> findByCompanyId(Long companyId);
    
    @Query("SELECT j FROM JobOffer j WHERE (:contractType IS NULL OR j.contractType = :contractType) AND (:location IS NULL OR j.location = :location) AND (:remote IS NULL OR j.remote = :remote)")
    List<JobOffer> findByFilters(@Param("contractType") String contractType, @Param("location") String location, @Param("remote") String remote);
}
