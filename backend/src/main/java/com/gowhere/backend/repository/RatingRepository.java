package com.gowhere.backend.repository;

import com.gowhere.backend.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByTripId(Long tripId);

    Optional<Rating> findByUserIdAndTripId(Long userId, Long tripId);

    boolean existsByUserIdAndTripId(Long userId, Long tripId);

    void deleteByUserIdAndTripId(Long userId, Long tripId);
}