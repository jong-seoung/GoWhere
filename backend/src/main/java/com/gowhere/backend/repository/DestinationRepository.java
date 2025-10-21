package com.gowhere.backend.repository;

import com.gowhere.backend.entity.Destination;
import com.gowhere.backend.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
    List<Destination> findByTrip(Trip trip);
}
