package com.gowhere.backend.trip.dto.response;

import com.gowhere.backend.trip.entity.TripType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TripDto {
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private TripType tripType;

    private String departure;   // 출발지 주소
    private double departureLat;
    private double departureLng;

    private String destination; // 목적지 주소
    private double destinationLat;
    private double destinationLng;

    private Long authorId;
}

