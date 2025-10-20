package com.gowhere.backend.service;

import com.gowhere.backend.dto.ChecklistDto;
import com.gowhere.backend.entity.Checklist;
import com.gowhere.backend.entity.Trip;
import com.gowhere.backend.repository.ChecklistRepository;
import com.gowhere.backend.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChecklistService {

    private final ChecklistRepository checklistRepository;
    private final TripRepository tripRepository;

    public Checklist creatChecklist(ChecklistDto dto) {
        Trip trip = tripRepository.findById(dto.getTripId())
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + dto.getTripId()));

        Checklist checklist = new Checklist();
        checklist.setItem(dto.getItem());
        checklist.setComplete(dto.isComplete());
        checklist.setType(dto.getType());
        checklist.setTrip(trip);

        return checklistRepository.save(checklist);
    }
    public List<Checklist> getChecklistByTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + tripId));
        return checklistRepository.findByTrip(trip);
    }

    public Checklist updateChecklist(Long id, ChecklistDto dto) {
        Checklist checklist = checklistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Checklist not found with id: " + id));

        checklist.setItem(dto.getItem());
        checklist.setComplete(dto.isComplete());
        checklist.setType(dto.getType());

        return checklistRepository.save(checklist);
    }

    public void deleteChecklist(Long id) {
        checklistRepository.deleteById(id);
    }
    public Checklist toggleComplete(Long id) {
        Checklist checklist = checklistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Checklist not found with id: " + id));
        checklist.setComplete(!checklist.isComplete());
        return checklistRepository.save(checklist);
    }
}
