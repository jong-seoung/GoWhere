package com.gowhere.backend.service;

import com.gowhere.backend.entity.BuddyPost;
import com.gowhere.backend.entity.User;
import com.gowhere.backend.repository.BuddyPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

// 모집 게시글 관련
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BuddyPostService {

    private final BuddyPostRepository buddyPostRepository;

    // 모집글 생성
    @Transactional
    public BuddyPost create(BuddyPost post, User host){
        post.setHost(host);

        post.setClosed(false);

        return buddyPostRepository.save(post);
    }

    // 모집글 단건 조회(id)
    public BuddyPost get(Long postId){
        return buddyPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("모집글을 찾을 수 없습니다."));
    }

    // 검색 키워드 지역 태그 작성자 + 페이징
    public Page<BuddyPost> search(String q, String location, String tag, Long hostId, Pageable pageable){
        return buddyPostRepository.search(q, location, tag, hostId, pageable);
    }

    // 모집글 수정 - 호스트만 가능하도록
    @Transactional
    public BuddyPost update(Long postId, BuddyPost update, User currentUser){
        BuddyPost post = get(postId);
        assertHost(post, currentUser);

        if (update.getTitle() != null) post.setTitle(update.getTitle());
        if (update.getContent() != null) post.setContent(update.getContent());
        if (update.getLocationCode() != null) post.setLocationCode(update.getLocationCode());
        if (update.getAddress() != null) post.setAddress(update.getAddress());
        if (update.getLatitude() != null) post.setLatitude(update.getLatitude());
        if (update.getLongitude() != null) post.setLongitude(update.getLongitude());
        if (update.getStartDate() != null) post.setStartDate(update.getStartDate());
        if (update.getEndDate() != null) post.setEndDate(update.getEndDate());
        if (update.getCapacity() != null) post.setCapacity(update.getCapacity());
        if (update.getTags() != null && !update.getTags().isEmpty()) post.setTags(update.getTags());


        return post;
    }

    // 모집글 상태 변경 - enum → boolean 으로 변경
    @Transactional
    public BuddyPost changeClosed(Long postId, boolean closed, User currentUser){
        BuddyPost post = get(postId);
        assertHost(post, currentUser);
        post.setClosed(closed);
        return post;
    }

    // 모집글 삭제
    @Transactional
    public void delete(Long postId, User currentUser){
        BuddyPost post = get(postId);
        assertHost(post, currentUser);
        buddyPostRepository.delete(post);
    }

    // 모집글 수정/삭제/변경 권한 체크
    private void assertHost(BuddyPost post, User currentUser){
        if (post.getHost() == null || currentUser == null) {
            throw new SecurityException("해당 모집글에 대한 권한이 없습니다.");
        }
        // Long 값 비교는 equals로
        if (!Objects.equals(post.getHost().getId(), currentUser.getId())) {
            throw new SecurityException("해당 모집글에 대한 권한이 없습니다.");
        }
    }
}
