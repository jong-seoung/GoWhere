package com.gowhere.backend.checklist.service;

import com.gowhere.backend.checklist.dto.response.ChecklistDto;
import com.gowhere.backend.checklist.entity.Checklist;
import com.gowhere.backend.trip.entity.Trip;
import com.gowhere.backend.checklist.repository.ChecklistRepository;
import com.gowhere.backend.trip.repository.TripRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChecklistService {

    private final ChecklistRepository checklistRepository;
    private final TripRepository tripRepository;

    @Transactional
    public Checklist createChecklist(ChecklistDto dto) {
        Trip trip = tripRepository.findById(dto.getTripId())
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + dto.getTripId()));

        // 권한 체크: 게시물 작성자만 체크리스트 추가 가능
        checkTripAuthor(trip);

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

    @Transactional
    public Checklist updateChecklist(Long id, ChecklistDto dto) {
        Checklist checklist = checklistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Checklist not found with id: " + id));

        // 권한 체크: 게시물 작성자만 수정 가능
        checkTripAuthor(checklist.getTrip());

        checklist.setItem(dto.getItem());
        checklist.setComplete(dto.isComplete());
        checklist.setType(dto.getType());
        return checklistRepository.save(checklist);
    }

    @Transactional
    public boolean deleteChecklist(Long id) {
        Checklist checklist = checklistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Checklist not found with id: " + id));

        // 권한 체크: 게시물 작성자만 삭제 가능
        checkTripAuthor(checklist.getTrip());

        checklistRepository.delete(checklist);
        return true;
    }

    @Transactional
    public Checklist toggleComplete(Long id) {
        Checklist checklist = checklistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Checklist not found with id: " + id));

        // 권한 체크: 게시물 작성자만 완료 토글 가능
        checkTripAuthor(checklist.getTrip());

        checklist.setComplete(!checklist.isComplete());
        return checklistRepository.save(checklist);
    }

        // 게시물 작성자 확인
    private void checkTripAuthor(Trip trip) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!trip.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("권한이 없습니다. 본인이 작성한 게시물의 체크리스트만 수정/삭제할 수 있습니다.");
        }
    }
}
