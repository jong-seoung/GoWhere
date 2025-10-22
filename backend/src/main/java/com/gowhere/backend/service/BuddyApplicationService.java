package com.gowhere.backend.service;

import com.gowhere.backend.entity.BuddyApplication;
import com.gowhere.backend.entity.BuddyPost;
import com.gowhere.backend.entity.User;
import com.gowhere.backend.repository.BuddyApplicationRepository;
import com.gowhere.backend.repository.BuddyPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BuddyApplicationService {

    private final BuddyApplicationRepository buddyApplicationRepository;
    private final BuddyPostRepository buddyPostRepository;

    /** 신청하기 */
    @Transactional
    public BuddyApplication applyToPost(Long postId, User applicant) {
        BuddyPost post = buddyPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("모집글이 존재하지 않습니다."));

        if (post.getStatus() == BuddyPost.Status.CLOSED)
            throw new IllegalStateException("마감된 모집글입니다.");

        boolean exists = buddyApplicationRepository
                .findByPostIdAndApplicantId(postId, applicant.getId())
                .isPresent();
        if (exists) throw new IllegalStateException("이미 이 모집글에 신청했습니다.");

        BuddyApplication app = new BuddyApplication();
        app.setPost(post);
        app.setApplicant(applicant);
        app.setStatus(BuddyApplication.Status.PENDING);

        return buddyApplicationRepository.save(app);
    }

    /** 내 신청 내역 (신청자 입장) */
    public List<BuddyApplication> getMyApplications(User applicant) {
        return buddyApplicationRepository.findByApplicant(applicant);
    }

    /** 내 글에 달린 신청서 목록 (호스트 입장) */
    public List<BuddyApplication> getApplicationsForMyPost(Long postId, User currentUser) {
        BuddyPost post = buddyPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("모집글이 존재하지 않습니다."));
        assertHost(post, currentUser);
        return buddyApplicationRepository.findByPostId(postId);
    }

    /** 신청 상태 변경 (호스트만 가능) */
    @Transactional
    public BuddyApplication updateStatus(Long applicationId, BuddyApplication.Status newStatus, User currentUser) {
        BuddyApplication app = buddyApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("신청서를 찾을 수 없습니다."));

        BuddyPost post = app.getPost();
        assertHost(post, currentUser);
        app.setStatus(newStatus);
        return app;
    }

    /** 신청 취소 (신청자 본인만) */
    @Transactional
    public void cancel(Long applicationId, User currentUser) {
        BuddyApplication app = buddyApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("신청서를 찾을 수 없습니다."));
        if (app.getApplicant().getId() != currentUser.getId()) {
            throw new SecurityException("본인 신청만 취소할 수 있습니다.");
        }
        buddyApplicationRepository.delete(app);
    }

    /** 권한 검증: 호스트 본인만 가능 */
    private void assertHost(BuddyPost post, User currentUser) {
        if (post.getHost() == null || currentUser == null ||
                post.getHost().getId() != currentUser.getId()) {
            throw new SecurityException("해당 모집글에 대한 권한이 없습니다.");
        }
    }
}
