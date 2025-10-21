package com.gowhere.backend.repository;

import com.gowhere.backend.entity.TravelPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TravelPostRepository extends JpaRepository<TravelPost, Long> {
    // 1. 아무 조건도 없음 -> 전체 게시글 보기

    @Query("""
        select p
        from TravelPost p
        where (:q is null or
               lower(p.title)   like lower(concat('%', :q, '%')) or
               lower(p.content) like lower(concat('%', :q, '%'))) 
          and (:region is null or p.region = :region)
          and (:tag is null or p.tags like concat('%', :tag, '%'))
        """)

    Page<TravelPost> search(
            @Param("q") String q,
            @Param("region") String region,
            @Param("tag") String tag,
            Pageable pageable
    );
}
