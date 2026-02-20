package tn.esprit.training;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.training.dto.TrainingContentDTO;
import tn.esprit.training.dto.TrainingContentCreateDTO;
import tn.esprit.training.dto.TrainingRequestDTO;
import tn.esprit.training.dto.TrainingResponseDTO;
import tn.esprit.training.service.TrainingService;

import java.util.List;

@RestController
@RequestMapping("/trainings")
public class TrainingRESTApi {
    private final TrainingService trainingService;

    public TrainingRESTApi(TrainingService trainingService) {
        this.trainingService = trainingService;
    }

    @GetMapping
    public ResponseEntity<List<TrainingResponseDTO>> getAll() {
        return ResponseEntity.ok(trainingService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(trainingService.getById(id));
    }

    @PostMapping
    public ResponseEntity<TrainingResponseDTO> create(@Valid @RequestBody TrainingRequestDTO training) {
        return ResponseEntity.ok(trainingService.create(training));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingResponseDTO> update(@PathVariable Long id, @Valid @RequestBody TrainingRequestDTO training) {
        return ResponseEntity.ok(trainingService.update(id, training));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        trainingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/contents")
    public ResponseEntity<List<TrainingContentDTO>> getContents(@PathVariable Long id) {
        return ResponseEntity.ok(trainingService.getContents(id));
    }

    @PostMapping("/{id}/contents")
    public ResponseEntity<TrainingContentDTO> addContent(@PathVariable Long id, @Valid @RequestBody TrainingContentCreateDTO content) {
        return ResponseEntity.ok(trainingService.addContent(id, content));
    }

    @DeleteMapping("/contents/{contentId}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long contentId) {
        trainingService.deleteContent(contentId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/training-contents/{contentId}")
    public ResponseEntity<Void> deleteContentAlt(@PathVariable Long contentId) {
        trainingService.deleteContent(contentId);
        return ResponseEntity.noContent().build();
    }
}
