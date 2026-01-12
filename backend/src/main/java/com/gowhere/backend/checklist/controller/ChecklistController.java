package com.gowhere.backend.checklist.controller;

import com.gowhere.backend.checklist.dto.response.ChecklistDto;
import com.gowhere.backend.checklist.entity.Checklist;
import com.gowhere.backend.checklist.service.ChecklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/travelplan/{tripId}/checklist")
@RequiredArgsConstructor
public class ChecklistController {

    private final ChecklistService checklistService;

    @PostMapping
    public ResponseEntity<Checklist> createChecklist(@PathVariable Long tripId, @RequestBody ChecklistDto dto) {
        dto.setTripId(tripId);
        Checklist checklist = checklistService.createChecklist(dto);

        return ResponseEntity.ok(checklist);
    }

    @GetMapping
    public ResponseEntity<List<Checklist>> getChecklistByTrip(@PathVariable Long tripId) {

        return ResponseEntity.ok(checklistService.getChecklistByTrip(tripId));
    }

    @PutMapping("/{checklistId}")
    public ResponseEntity<Checklist> updateChecklist(@PathVariable Long tripId, @PathVariable Long checklistId, @RequestBody ChecklistDto dto) {
        dto.setTripId(tripId);
        Checklist updatedChecklist = checklistService.updateChecklist(checklistId, dto);

        return ResponseEntity.ok(updatedChecklist);
    }


    @DeleteMapping("/{checklistId}")
    public ResponseEntity<Void> deleteChecklist(@PathVariable Long checklistId) {
        checklistService.deleteChecklist(checklistId);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{checklistId}/toggle")
    public ResponseEntity<Checklist> toggleComplete(@PathVariable Long checklistId) {
        Checklist checklist = checklistService.toggleComplete(checklistId);

        return ResponseEntity.ok(checklist);
    }
}
