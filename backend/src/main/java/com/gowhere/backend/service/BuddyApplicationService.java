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
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BuddyApplicationService {

    private final BuddyApplicationRepository buddyApplicationRepository;
    private final BuddyPostRepository buddyPostRepository;
    private final AuthenticationService authenticationService;

    /** 모집글 신청하기 */
    @Transactional
    public BuddyApplication applyToPost(Long postId, String message) {
        User currentUser = authenticationService.getCurrentUser();

        if (currentUser == null) {
            throw new SecurityException("인증되지 않은 요청입니다.");
        }

        BuddyPost post = buddyPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("모집글이 존재하지 않습니다."));

        if (post.isClosed()) {
            throw new IllegalStateException("마감된 모집글입니다.");
        }

        // (옵션) 호스트 본인 신청 방지
        if (post.getHost() != null && Objects.equals(post.getHost().getId(), currentUser.getId())) {
            throw new IllegalStateException("본인 모집글에는 신청할 수 없습니다.");
        }

        boolean exists = buddyApplicationRepository
                .findByPostIdAndApplicantId(postId, currentUser.getId())
                .isPresent();
        if (exists) {
            throw new IllegalStateException("이미 이 모집글에 신청했습니다.");
        }

        BuddyApplication app = new BuddyApplication();
        app.setPost(post);
        app.setApplicant(currentUser);   // ✅ 컨트롤러에서 넘겨준 사용자 사용
        app.setMessage(message);
        app.setStatus(BuddyApplication.Status.PENDING);

        return buddyApplicationRepository.save(app);
    }

    /** 내 신청 내역 */
    public List<BuddyApplication> getMyApplications(User applicant) {
        if (applicant == null) throw new SecurityException("인증되지 않은 요청입니다.");
        return buddyApplicationRepository.findByApplicant(applicant);
    }

    /** 내 글에 달린 신청서 목록 (호스트만) */
    public List<BuddyApplication> getApplicationsForMyPost(Long postId, User currentUser) {
        if (currentUser == null) throw new SecurityException("인증되지 않은 요청입니다.");
        BuddyPost post = buddyPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("모집글이 존재하지 않습니다."));
        assertHost(post, currentUser);
        return buddyApplicationRepository.findByPostId(postId);
    }

    /** 신청 상태 변경 (승인/거절) */
    @Transactional
    public BuddyApplication updateStatus(Long applicationId, BuddyApplication.Status newStatus, User currentUser) {
        if (currentUser == null) throw new SecurityException("인증되지 않은 요청입니다.");
        BuddyApplication app = buddyApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("신청서를 찾을 수 없습니다."));
        BuddyPost post = app.getPost();
        assertHost(post, currentUser);
        app.setStatus(newStatus);
        return app; // JPA 트랜잭션 종료 시 flush
    }

    /** 신청 취소 */
    @Transactional
    public void cancel(Long applicationId, User currentUser) {
        if (currentUser == null) throw new SecurityException("인증되지 않은 요청입니다.");
        BuddyApplication app = buddyApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("신청서를 찾을 수 없습니다."));
        if (!Objects.equals(app.getApplicant().getId(), currentUser.getId())) {
            throw new SecurityException("본인 신청만 취소할 수 있습니다.");
        }
        buddyApplicationRepository.delete(app);
    }

    /** 호스트 권한 검증 */
    private void assertHost(BuddyPost post, User currentUser) {
        if (post.getHost() == null || currentUser == null ||
                !Objects.equals(post.getHost().getId(), currentUser.getId())) {
            throw new SecurityException("해당 모집글에 대한 권한이 없습니다.");
        }
    }
}
