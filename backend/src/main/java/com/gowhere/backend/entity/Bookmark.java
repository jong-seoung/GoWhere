package com.gowhere.backend.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 사용자가 특정 리뷰를 북마크했을 때 저장되는 DB 엔티티.
 * Review 엔티티와 N:1 관계를 가짐 (여러 북마크가 하나의 리뷰를 참조 가능)
 */
@Entity
@Table(name = "bookmark")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 북마크 고유 식별자

    @Column(name = "is_bookmark")
    private Boolean isBookmark; // 북마크 상태 (true면 활성, false면 해제)

    @Column(name = "place_name")
    private String placeName; // 장소 이름 (리뷰나 여행지 이름 등)

    @Column(name = "user_id")
    private Long userId; // 북마크한 사용자 ID

    @Column(name = "trip_id")
    private Long tripId; // 관련된 여행 ID (선택적)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private Review review; // 연결된 리뷰 (북마크는 하나의 리뷰에만 속함)

    @PrePersist
    protected void onCreate() {
        // 엔티티 생성 시 isBookmark가 null이면 true로 초기화
        if (isBookmark == null) {
            isBookmark = true;
        }
    }
}
