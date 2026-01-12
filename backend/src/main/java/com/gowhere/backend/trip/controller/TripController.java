package com.gowhere.backend.trip.controller;

import com.gowhere.backend.trip.dto.response.TripDto;
import com.gowhere.backend.trip.entity.Trip;
import com.gowhere.backend.trip.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/travelplan")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    public ResponseEntity<TripDto> createTrip(@RequestBody TripDto tripDto) {
        Trip trip = tripService.createTrip(tripDto);
        return ResponseEntity.status(201).body(mapToDto(trip));
    }

    @GetMapping
    public ResponseEntity<List<TripDto>> getAllTrips() {
        List<TripDto> dtos = tripService.getAllTrips().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripDto> getTripById(@PathVariable Long id) {
        Trip trip = tripService.getTripById(id);
        return ResponseEntity.ok(mapToDto(trip));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TripDto> updateTrip(@PathVariable Long id, @RequestBody TripDto tripDto) {
        Trip updated = tripService.updateTrip(id, tripDto);
        return ResponseEntity.ok(mapToDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }

    // DTO 변환
    private TripDto mapToDto(Trip trip) {
        TripDto dto = new TripDto();
        dto.setTitle(trip.getTitle());
        dto.setDescription(trip.getDescription());
        dto.setStartDate(trip.getStartDate());
        dto.setEndDate(trip.getEndDate());
        dto.setTripType(trip.getTriptype());
        dto.setDeparture(trip.getDeparture());
        dto.setDestination(trip.getDestination());
        dto.setAuthorId(trip.getAuthor().getId());
        return dto;
    }
}
