package com.gowhere.backend.travelpost.entity;

import com.gowhere.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class TravelPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // PK

    @Column(nullable = false)
    private String title;

    
    @Column(length = 2000)
    private String content;
    


    private String region;        // ex) "부산", "제주도"
    private String tags;          // ex) "#힐링,#자연"
    private String thumbnailUrl;

    private Integer likeCount;    // 좋아요 수
    private Long viewCount;       // 조회수
    private Double ratingAvg;     // 평균 별점

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;            // 작성자 (User 엔티티와 연결)
}
