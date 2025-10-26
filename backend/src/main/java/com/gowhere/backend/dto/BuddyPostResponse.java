package com.gowhere.backend.dto;

import com.gowhere.backend.entity.BuddyPost;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

// 동행 모집글 조회/응답 dto
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuddyPostResponse {

    private Long id;
    private String title;
    private String content;
    private String locationCode; // 지역코드 ex)"JEJU"
    private String address; // 주소 문자열
    private Double latitude; // 위도
    private Double longitude;  // 경도
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer capacity;
    private Set<String> tags; // 태그 목록
    private String hostUsername;

    //enum → boolean 으로 변경
    private boolean closed;

    private LocalDateTime createdAt; // 모집글 작성시간


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
                //boolean 필드로 변경
                .closed(post.isClosed())
                .createdAt(post.getCreatedAt())
                .build();
    }
}
