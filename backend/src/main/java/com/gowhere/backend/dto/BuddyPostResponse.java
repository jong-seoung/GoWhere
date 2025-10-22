package com.gowhere.backend.dto;

import com.gowhere.backend.entity.BuddyApplication;
import com.gowhere.backend.entity.BuddyPost;
import com.gowhere.backend.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

//동행 모집글 조회/응답 dto
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuddyPostResponse {


    Long id;
    String title;
    String content;
    String locationCode; //지역코드 ex)"JEJU"
    String address; //주소 문자열
    Double latitude; //위도
    Double longitude;  //경도
    LocalDate startDate;
    LocalDate endDate;
    Integer capacity;
    Set<String> tags; //태그 목록
    private String hostUsername;
    private BuddyPost.Status status;
    LocalDateTime createdAt; //모집글 작성시간


    public static BuddyPostResponse fromEntity(BuddyPost post) {
        return BuddyPostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .locationCode(post.getLocationCode())
                .address(post.getAddress())
                .latitude(post.getLatitude())
                .longitude(post.getLongitude())
                .startDate(post.getStartDate())
                .endDate(post.getEndDate())
                .capacity(post.getCapacity())
                .tags(post.getTags())
                .hostUsername(post.getHost() != null ? post.getHost().getUsername() : null)
                .status(post.getStatus())
                .createdAt(post.getCreatedAt())
                .build();
    }


}
