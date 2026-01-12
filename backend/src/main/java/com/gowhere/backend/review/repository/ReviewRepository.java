package com.gowhere.backend.review.repository;

import com.gowhere.backend.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}