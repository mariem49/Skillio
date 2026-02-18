package esprit.entreprise.service;

import esprit.entreprise.entity.Company;
import esprit.entreprise.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    public List<Company> findAll() {
        return companyRepository.findAll();
    }

    public Optional<Company> findById(Long id) {
        return companyRepository.findById(id);
    }

    public List<Company> findByEnterpriseUserId(Long enterpriseUserId) {
        return companyRepository.findByEnterpriseUserId(enterpriseUserId);
    }

    @Transactional
    public Company save(Company company) {
        return companyRepository.save(company);
    }

    @Transactional
    public Company updateCompany(Long id, Company updatedData) {
        Company existing = companyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
        
        existing.setName(updatedData.getName());
        existing.setDescription(updatedData.getDescription());
        existing.setIndustry(updatedData.getIndustry());
        existing.setLocation(updatedData.getLocation());
        existing.setWebsite(updatedData.getWebsite());
        existing.setLogoUrl(updatedData.getLogoUrl());
        existing.setEmail(updatedData.getEmail());
        existing.setPhone(updatedData.getPhone());
        
        // DO NOT update enterpriseUserId or createdAt
        return companyRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        companyRepository.deleteById(id);
    }
}
