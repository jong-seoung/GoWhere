package com.gowhere.backend.service;


import com.gowhere.backend.dto.TripDto;
import com.gowhere.backend.entity.Trip;
import com.gowhere.backend.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;

    public Trip createTrip(TripDto tripDto) {
        Trip trip = new Trip();
        trip.setTitle(tripDto.getTitle());
        trip.setDescription(tripDto.getDescription());
        trip.setStartDate(tripDto.getStartDate());
        trip.setEndDate(tripDto.getEndDate());
        trip.setTriptype(tripDto.getTripType());
        return tripRepository.save(trip);
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip getTripById(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + id));
    }
    public Trip updateTrip(Long id, TripDto tripDto) {
        Trip trip = getTripById(id);
        trip.setTitle(tripDto.getTitle());
        trip.setDescription(tripDto.getDescription());
        trip.setStartDate(tripDto.getStartDate());
        trip.setEndDate(tripDto.getEndDate());
        trip.setTriptype(tripDto.getTripType());
        return tripRepository.save(trip);
    }

    // 여행 삭제
    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }
}

