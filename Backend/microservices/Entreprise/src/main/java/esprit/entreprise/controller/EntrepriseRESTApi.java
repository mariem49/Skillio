package esprit.entreprise.controller;

import esprit.entreprise.entity.Company;
import esprit.entreprise.entity.JobOffer;
import esprit.entreprise.service.CompanyService;
import esprit.entreprise.service.JobOfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/entreprise")
public class EntrepriseRESTApi {

    @Autowired
    private CompanyService companyService;

    @Autowired
    private JobOfferService jobOfferService;

    @GetMapping("/hello")
    public String sayhello() {
        return "Hello World from entreprise";
    }

    // --- Company Endpoints ---

    @GetMapping("/companies")
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = companyService.findAll();
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
        return companyService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/companies/user/{userId}")
    public ResponseEntity<List<Company>> getCompaniesByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(companyService.findByEnterpriseUserId(userId));
    }

    @PostMapping("/companies")
    public ResponseEntity<Company> createCompany(@RequestBody Company company) {
        return ResponseEntity.status(HttpStatus.CREATED).body(companyService.save(company));
    }

    @PutMapping("/companies/{id}")
    public ResponseEntity<Company> updateCompany(@PathVariable Long id, @RequestBody Company company) {
        return ResponseEntity.ok(companyService.updateCompany(id, company));
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        companyService.delete(id);
        return ResponseEntity.ok().build();
    }

    // --- Job Offer Endpoints ---

    @GetMapping("/job-offers")
    public ResponseEntity<List<JobOffer>> getAllJobOffers(
            @RequestParam(required = false) String contractType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String remote) {
        return ResponseEntity.ok(jobOfferService.findAll(contractType, location, remote));
    }

    @GetMapping("/job-offers/{id}")
    public ResponseEntity<JobOffer> getJobOfferById(@PathVariable Long id) {
        return jobOfferService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/job-offers/company/{companyId}")
    public ResponseEntity<List<JobOffer>> getJobOffersByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(jobOfferService.findByCompanyId(companyId));
    }

    @PostMapping("/job-offers")
    public ResponseEntity<JobOffer> createJobOffer(@RequestBody JobOffer jobOffer) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobOfferService.save(jobOffer));
    }

    @PutMapping("/job-offers/{id}")
    public ResponseEntity<JobOffer> updateJobOffer(@PathVariable Long id, @RequestBody JobOffer jobOffer) {
        return ResponseEntity.ok(jobOfferService.updateJobOffer(id, jobOffer));
    }

    @DeleteMapping("/job-offers/{id}")
    public ResponseEntity<Void> deleteJobOffer(@PathVariable Long id) {
        jobOfferService.delete(id);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleException(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
}
