package com.gowhere.backend.destination.repository;

import com.gowhere.backend.destination.entity.Destination;
import com.gowhere.backend.trip.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
    List<Destination> findByTrip(Trip trip);
}
