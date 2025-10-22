package com.gowhere.backend.dto;


import lombok.Data;


@Data
public class DestinationDto {
    private Long id;
    private String name;
    private String address;
    private String region;
    private double latitude;
    private double longitude;
    private Long tripId;

}
