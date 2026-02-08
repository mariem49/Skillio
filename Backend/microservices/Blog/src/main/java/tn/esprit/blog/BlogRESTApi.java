package tn.esprit.blog;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/blog")
public class BlogRESTApi {
    @GetMapping("/hello")
    public String sayhello() {
        return "Hello World from blog";
    }
}
