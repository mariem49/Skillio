package tn.esprit.subscription;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sub")
public class SubscriptionRESTApi {
    @GetMapping("/hello")
    public String sayhello() {
        return "Hello World from subscription";
    }
}
