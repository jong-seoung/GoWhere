package com.gowhere.backend.service;

import com.gowhere.backend.dto.TravelPostSummaryDto;
import com.gowhere.backend.entity.TravelPost;
import com.gowhere.backend.repository.TravelPostRepository;
import jakarta.persistence.PrePersist;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SearchService  {

    private final TravelPostRepository travelPostRepository;

    private String n(String s){
        return (s ==null || s.trim().isEmpty()) ? null :s.trim();
    }

    public Page<TravelPostSummaryDto> searchPosts(String q, String region, String tag, Pageable pageable) {
        Page<TravelPost> page = travelPostRepository.search(n(q), n(region), n(tag), pageable);

        return page.map(TravelPostSummaryDto::fromEntity);
    }
}
