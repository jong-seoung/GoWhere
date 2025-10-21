package com.gowhere.backend.dto;


import com.gowhere.backend.entity.BuddyPost;
import com.gowhere.backend.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

//동행 모집글 생성 요청 dto

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuddyPostCreateRequest {


    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotBlank
    private String address; //주소 문자열
    private String locationCode; //지역코드 ex)"JEJU"
    private Double latitude; //위도
    private Double longitude;  //경도

    @NotBlank
    private LocalDate startDate;
    @NotBlank
    private LocalDate endDate;

    @NotBlank
    @Positive
    private Integer capacity;


    private Set<String> tags; //태그 목록


}
