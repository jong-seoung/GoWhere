package com.gowhere.backend.repository;

import com.gowhere.backend.entity.Checklist;
import com.gowhere.backend.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChecklistRepository extends JpaRepository<Checklist, Long> {
    List<Checklist> findByTrip(Trip trip);

}
