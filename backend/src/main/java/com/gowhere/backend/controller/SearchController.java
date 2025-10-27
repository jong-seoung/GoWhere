package com.gowhere.backend.controller;

import com.gowhere.backend.dto.TravelPostSummaryDto;
import com.gowhere.backend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search")
public class SearchController {
    private final SearchService searchService;

    //정렬 기준으로 허용할 수 있는 컬럼 목록을 제한하기 위하여
    private static final Set<String> ALLOWED_SORTS =
            new HashSet<>(Arrays.asList("createdAt"));

    @GetMapping("/posts")
    public Page<TravelPostSummaryDto> searchPosts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(required = false) String dir, // null 허용
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        // "likeCount,desc" 같이 콤마 포함도 허용
        String sortKey = sort;
        String sortDir = (dir == null || dir.isBlank()) ? "desc" : dir;
        if (sort.contains(",")) {
            String[] parts = sort.split(",", 2);
            sortKey = parts[0].trim();
            sortDir = parts[1].trim();
        }

        // 화이트리스트(허용 컬럼만)
        if (!ALLOWED_SORTS.contains(sortKey)) {
            sortKey = "createdAt";
        }

        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortKey));
        return searchService.searchPosts(q, region, tag, pageable);
    }


}
