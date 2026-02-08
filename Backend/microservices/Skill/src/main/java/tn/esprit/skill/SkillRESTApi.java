package tn.esprit.skill;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/skill")
public class SkillRESTApi {
    @GetMapping("/hello")
    public String sayhello() {
        return "Hello World from Skill";
    }
}