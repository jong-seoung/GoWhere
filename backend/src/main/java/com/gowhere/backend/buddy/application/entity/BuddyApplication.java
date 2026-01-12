package com.gowhere.backend.buddy.application.entity;

import com.gowhere.backend.buddy.post.entity.BuddyPost;

import com.gowhere.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

//신청서
@Entity
@Table(name = "buddy_applications")
@Getter
@Setter
public class BuddyApplication {

    public BuddyApplication() {
    }

    public enum Status{
        PENDING,APPROVED, REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "buddy_post_id")
    private BuddyPost post; //어떤 모집글에대한 신청인지

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "applicant_id")
    private User applicant; //신청자

    private String message; //신청자가 남긴 메세지

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING; //기본값


    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime appliedAt; //지원시간


    boolean deleted = false;


}
