package tn.esprit.training.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.training.entity.TrainingContent;

import java.util.List;

public interface TrainingContentRepository extends JpaRepository<TrainingContent, Long> {
    List<TrainingContent> findByTraining_Id(Long trainingId);
}

