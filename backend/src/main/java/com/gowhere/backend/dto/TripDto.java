package com.gowhere.backend.dto;

import com.gowhere.backend.entity.TripType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TripDto {
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private com.gowhere.backend.entity.TripType tripType;
}

