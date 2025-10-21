package com.gowhere.backend.service;

import com.gowhere.backend.entity.Rating;
import com.gowhere.backend.dto.RatingRequest;
import com.gowhere.backend.dto.RatingResponse;
import com.gowhere.backend.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;

    @Transactional
    public RatingResponse addRating(Long userId, RatingRequest request) {
        if (ratingRepository.existsByUserIdAndTripId(userId, request.getTripId())) {
            throw new RuntimeException("이미 별점을 등록했습니다.");
        }

        Rating rating = Rating.builder()
                .userId(userId)
                .tripId(request.getTripId())
                .ratingPoint(request.getRatingPoint())
                .build();

        return new RatingResponse(ratingRepository.save(rating));
    }

    @Transactional
    public RatingResponse updateRating(Long userId, RatingRequest request) {
        Rating rating = ratingRepository.findByUserIdAndTripId(userId, request.getTripId())
                .orElseThrow(() -> new RuntimeException("별점을 찾을 수 없습니다."));

        rating.setRatingPoint(request.getRatingPoint());
        return new RatingResponse(ratingRepository.save(rating));
    }

    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsByTrip(Long tripId) {
        return ratingRepository.findByTripId(tripId).stream()
                .map(RatingResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Double getAverageRatingPoint(Long tripId) {
        List<Rating> ratings = ratingRepository.findByTripId(tripId);
        if (ratings.isEmpty()) {
            return 0.0;
        }
        return ratings.stream()
                .mapToInt(Rating::getRatingPoint)
                .average()
                .orElse(0.0);
    }

    @Transactional
    public void deleteRating(Long userId, Long tripId) {
        if (!ratingRepository.existsByUserIdAndTripId(userId, tripId)) {
            throw new RuntimeException("별점을 찾을 수 없습니다.");
        }
        ratingRepository.deleteByUserIdAndTripId(userId, tripId);
    }
}