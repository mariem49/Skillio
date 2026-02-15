package tn.esprit.entreprise;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/entreprise")
public class EntrepriseRESTApi {
    @GetMapping("/hello")
    public String sayhello() {
        return "Hello World from entreprise";
    }
}