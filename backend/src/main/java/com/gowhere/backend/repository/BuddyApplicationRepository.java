package com.gowhere.backend.repository;

import com.gowhere.backend.entity.BuddyApplication;
import com.gowhere.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BuddyApplicationRepository extends JpaRepository<BuddyApplication, Long> {

    // 특정 모집글에 대한 모든 신청서
    List<BuddyApplication> findByPostId(Long postId);

    // 특정 사용자가 낸 모든 신청서
    List<BuddyApplication> findByApplicant(User applicant);

    // 특정 사용자가 특정 모집글에 이미 신청했는지 확인
    Optional<BuddyApplication> findByPostIdAndApplicantId(Long postId, long applicantId);
}
