package com.gowhere.backend.service;

import com.gowhere.backend.dto.DestinationDto;
import com.gowhere.backend.entity.Destination;
import com.gowhere.backend.entity.Trip;
import com.gowhere.backend.exception.ResourceNotFoundException;
import com.gowhere.backend.repository.DestinationRepository;
import com.gowhere.backend.repository.TripRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;



import java.util.List;

@Service
@RequiredArgsConstructor
public class DestinationService {

    private final DestinationRepository destinationRepository;
    private final TripRepository tripRepository;

    @Transactional
    public Destination createDestination(DestinationDto dto) {
        Trip trip = tripRepository.findById(dto.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + dto.getTripId()));

        checkTripAuthor(trip);

        Destination destination = new Destination();
        destination.setName(dto.getName());
        destination.setAddress(dto.getAddress());
        destination.setRegion(dto.getRegion());
        destination.setLatitude(dto.getLatitude());
        destination.setLongitude(dto.getLongitude());
        destination.setTrip(trip);

        return destinationRepository.save(destination);
    }

    public List<Destination> getDestinationsByTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        return destinationRepository.findByTrip(trip);
    }

    @Transactional
    public Destination updateDestination(Long destinationId, DestinationDto dto) {
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + destinationId));

        checkTripAuthor(destination.getTrip());

        destination.setName(dto.getName());
        destination.setAddress(dto.getAddress());
        destination.setRegion(dto.getRegion());
        destination.setLatitude(dto.getLatitude());
        destination.setLongitude(dto.getLongitude());

        return destinationRepository.save(destination);
    }

    @Transactional
    public boolean deleteDestination(Long destinationId) {
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + destinationId));

        checkTripAuthor(destination.getTrip());
        destinationRepository.delete(destination);
        return true;
    }

    // 작성자 권한 확인
    private void checkTripAuthor(Trip trip) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!trip.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("권한이 없습니다. 본인이 작성한 게시물의 목적지만 수정/삭제할 수 있습니다.");
        }
    }
}
