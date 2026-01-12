package com.gowhere.backend.rating.repository;

import com.gowhere.backend.rating.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    // reviewId 기반으로 변경
    Optional<Rating> findByUserIdAndReviewId(Long userId, Long reviewId);

    boolean existsByUserIdAndReviewId(Long userId, Long reviewId);

    void deleteByUserIdAndReviewId(Long userId, Long reviewId);

    List<Rating> findByReviewId(Long reviewId);
}