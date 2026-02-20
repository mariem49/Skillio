package tn.esprit.training.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.training.dto.TrainingContentCreateDTO;
import tn.esprit.training.dto.TrainingContentDTO;
import tn.esprit.training.dto.TrainingRequestDTO;
import tn.esprit.training.dto.TrainingResponseDTO;
import tn.esprit.training.entity.Training;
import tn.esprit.training.entity.TrainingContent;
import tn.esprit.training.mapper.TrainingMapper;
import tn.esprit.training.repository.TrainingContentRepository;
import tn.esprit.training.repository.TrainingRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TrainingService {
    private final TrainingRepository trainingRepository;
    private final TrainingContentRepository contentRepository;

    public TrainingService(TrainingRepository trainingRepository, TrainingContentRepository contentRepository) {
        this.trainingRepository = trainingRepository;
        this.contentRepository = contentRepository;
    }

    public List<TrainingResponseDTO> getAll() {
        return trainingRepository.findAll()
                .stream()
                .map(TrainingMapper::toDto)
                .collect(Collectors.toList());
    }

    public TrainingResponseDTO getById(Long id) {
        Training training = trainingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Training not found"));
        return TrainingMapper.toDto(training);
    }

    public TrainingResponseDTO create(@Valid TrainingRequestDTO req) {
        Training entity = TrainingMapper.toEntity(req);
        Training saved = trainingRepository.save(entity);
        return TrainingMapper.toDto(saved);
    }

    public TrainingResponseDTO update(Long id, @Valid TrainingRequestDTO req) {
        Training existing = trainingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Training not found"));
        existing.setTitle(req.getTitle());
        existing.setDescription(req.getDescription());
        existing.setCategory(req.getCategory());
        existing.setLevel(req.getLevel());
        existing.setPrice(req.getPrice());
        existing.setThumbnailUrl(req.getThumbnailUrl());
        existing.setLanguage(req.getLanguage());
        existing.setStatus(req.getStatus());
        return TrainingMapper.toDto(existing);
    }

    public void delete(Long id) {
        trainingRepository.deleteById(id);
    }

    public List<TrainingContentDTO> getContents(Long trainingId) {
        return contentRepository.findByTraining_Id(trainingId)
                .stream()
                .map(TrainingMapper::toDto)
                .collect(Collectors.toList());
    }

    public TrainingContentDTO addContent(Long trainingId, @Valid TrainingContentCreateDTO req) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new EntityNotFoundException("Training not found"));
        TrainingContent content = new TrainingContent();
        content.setTraining(training);
        content.setTitle(req.getTitle());
        content.setContentUrl(req.getContentUrl());
        TrainingContent saved = contentRepository.save(content);
        return TrainingMapper.toDto(saved);
    }

    public void deleteContent(Long contentId) {
        contentRepository.deleteById(contentId);
    }
}
