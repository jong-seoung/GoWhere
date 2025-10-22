package com.gowhere.backend.controller;

import com.gowhere.backend.dto.DestinationDto;
import com.gowhere.backend.entity.Destination;
import com.gowhere.backend.service.DestinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/travelplan/{tripId}/destination")
@RequiredArgsConstructor
public class DestinationController {

    private final DestinationService destinationService;

    @PostMapping
    public ResponseEntity<Destination> createDestination(@PathVariable Long tripId, @RequestBody DestinationDto dto) {
        dto.setTripId(tripId);
        Destination destination = destinationService.createDestination(dto);
        return ResponseEntity.ok(destination);
    }

    @GetMapping
    public ResponseEntity<List<Destination>> getDestinations(@PathVariable Long tripId) {
        return ResponseEntity.ok(destinationService.getDestinationsByTrip(tripId));
    }

    @PutMapping("/{destinationId}")
    public ResponseEntity<Destination> updateDestination(@PathVariable Long tripId,
                                                         @PathVariable Long destinationId,
                                                         @RequestBody DestinationDto dto) {
        dto.setTripId(tripId);
        Destination updated = destinationService.updateDestination(destinationId, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{destinationId}")
    public ResponseEntity<Void> deleteDestination(@PathVariable Long destinationId) {
        destinationService.deleteDestination(destinationId);
        return ResponseEntity.noContent().build();
    }
}
