package com.gowhere.backend.checklist.repository;

import com.gowhere.backend.checklist.entity.Checklist;
import com.gowhere.backend.trip.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChecklistRepository extends JpaRepository<Checklist, Long> {
    List<Checklist> findByTrip(Trip trip);

}
