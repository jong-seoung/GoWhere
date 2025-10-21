package com.gowhere.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.apache.logging.log4j.util.Lazy;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

// 동행자 모집글

@Entity
@Table(name = "buddy_posts")
@Getter
@Setter
public class BuddyPost {
    public BuddyPost() {
    }

    public enum Status {
        OPEN, CLOSED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id")
    User host;

    String title;
    String content;

    String locationCode; //지역코드 ex)"JEJU"
    String address; //주소 문자열
    Double latitude; //위도
    Double longitude;  //경도

    LocalDate startDate;
    LocalDate endDate;


    Integer capacity;

    @ElementCollection
    @CollectionTable(name = "buddy_post_tags", joinColumns = @JoinColumn(name = "buddy_post_id"))
    @Column(name = "tag")
    Set<String> tags = new HashSet<>(); //태그 목록


    @Enumerated(EnumType.STRING)
    Status status = Status.OPEN; //기본값


    LocalDateTime createdAt; //모집글 작성시간
    boolean deleted = false;


    //  양방향 매핑
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<BuddyApplication> applications = new HashSet<>();

}
