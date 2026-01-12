package com.gowhere.backend.travelpost.dto.response;


import com.gowhere.backend.travelpost.entity.TravelPost;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TravelPostSummaryDto {

    private Long id;
    private String title;
    private String region;
    private List<String> tags;
    private String thumbnailUrl;
    private Integer likeCount;
    private Long viewCount;
    private Double ratingAvg;
    private LocalDateTime createdAt;
    private String authorName;

    public static TravelPostSummaryDto fromEntity(TravelPost p) {
        return TravelPostSummaryDto.builder()
                .id(p.getId())
                .title(p.getTitle())
                .region(p.getRegion())
                .tags(p.getTags() == null ? List.of()
                        : Arrays.stream(p.getTags().split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .toList())
                .thumbnailUrl(p.getThumbnailUrl())
                .likeCount(p.getLikeCount() == null ? 0 : p.getLikeCount())
                .viewCount(p.getViewCount() == null ? 0L : p.getViewCount())
                .ratingAvg(p.getRatingAvg() == null ? 0.0 : p.getRatingAvg())
                .createdAt(p.getCreatedAt())
                .authorName(p.getAuthor() == null ? null : p.getAuthor().getUsername())
                .build();
    }
}
