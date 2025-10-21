package com.gowhere.backend.repository;

import com.gowhere.backend.entity.BuddyPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BuddyPostRepository extends JpaRepository<BuddyPost, Long> {

    @Query("""
        select p
        from BuddyPost p
        where (:q is null or
               lower(p.title) like lower(concat('%', :q, '%')) or
               lower(p.content) like lower(concat('%', :q, '%')))
          and (:location is null or p.locationCode = :location)
          and (:tag is null or :tag in elements(p.tags))
          and (:hostId is null or p.host.id = :hostId)
        """)
    Page<BuddyPost> search(
            @Param("q") String q,              // 키워드 (제목/내용)
            @Param("location") String location, // 지역 코드
            @Param("tag") String tag,           // 태그
            @Param("hostId") Long hostId,       // 작성자 id
            Pageable pageable
    );
}
