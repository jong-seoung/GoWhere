package com.gowhere.backend.entity;

import jakarta.persistence.*;
import lombok.*;

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
    private Long id;

    @Column(name = "is_bookmark")
    private Boolean isBookmark;

    @Column(name = "place_name")
    private String placeName;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "trip_id")
    private Long tripId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private Review review;

    @PrePersist
    protected void onCreate() {
        if (isBookmark == null) {
            isBookmark = true;
        }
    }
}