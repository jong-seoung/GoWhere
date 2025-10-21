package com.gowhere.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Fetch;

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
        PENDING,APPROVING, REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "buddy_post_id")
    BuddyPost post; //어떤 모집글에대한 신청인지

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "applicant_id")
    User applicant; //신청자

    String message; //신청자가 남긴 메세지

    @Enumerated(EnumType.STRING)
    Status status = Status.PENDING; //기본값


    LocalDateTime appliedAt; //지원시간
    boolean deleted = false;


}
