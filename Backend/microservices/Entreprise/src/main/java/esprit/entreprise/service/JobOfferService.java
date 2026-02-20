package esprit.entreprise.service;

import esprit.entreprise.entity.JobOffer;
import esprit.entreprise.repository.JobOfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class JobOfferService {

    @Autowired
    private JobOfferRepository jobOfferRepository;

    public List<JobOffer> findAll(String contractType, String location, String remote) {
        if (contractType == null && location == null && remote == null) {
            return jobOfferRepository.findAll();
        }
        return jobOfferRepository.findByFilters(contractType, location, remote);
    }

    public Optional<JobOffer> findById(Long id) {
        return jobOfferRepository.findById(id);
    }

    public List<JobOffer> findByCompanyId(Long companyId) {
        return jobOfferRepository.findByCompany_Id(companyId);
    }

    @Transactional
    public JobOffer save(JobOffer jobOffer) {
        return jobOfferRepository.save(jobOffer);
    }

    @Transactional
    public JobOffer updateJobOffer(Long id, JobOffer updatedData) {
        JobOffer existing = jobOfferRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Job Offer not found with id: " + id));
            
        existing.setTitle(updatedData.getTitle());
        existing.setDescription(updatedData.getDescription());
        existing.setContractType(updatedData.getContractType());
        existing.setLocation(updatedData.getLocation());
        existing.setSalary(updatedData.getSalary());
        existing.setRemote(updatedData.getRemote());
        existing.setRequirements(updatedData.getRequirements());
        existing.setIsActive(updatedData.getIsActive());
        
        // DO NOT update companyId or createdAt
        return jobOfferRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        jobOfferRepository.deleteById(id);
    }
}
