package com.gowhere.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

// 동행자 모집글

@Builder
@Entity
@Table(name = "buddy_posts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BuddyPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id")
    private User host;

    private String title;
    private String content;

    private String locationCode; //지역코드 ex)"JEJU"
    private String address; //주소 문자열
    private Double latitude; //위도
    private Double longitude;  //경도

    private LocalDate startDate;
    private LocalDate endDate;


    private Integer capacity;

    @ElementCollection
    @CollectionTable(name = "buddy_post_tags", joinColumns = @JoinColumn(name = "buddy_post_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>(); //태그 목록


    @Column(nullable = false)
    private boolean closed = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // 모집글 작성시간

    private boolean deleted = false;


    
    @Builder.Default
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<BuddyApplication> applications = new HashSet<>();

}
