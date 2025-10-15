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
            new HashSet<>(Arrays.asList("createdAt", "likeCount", "viewCount", "ratingAvg", "title"));

    @GetMapping("/posts")
    public Page<TravelPostSummaryDto> searchPosts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String dir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Sort.Direction d = "asc".equalsIgnoreCase(dir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String key = ALLOWED_SORTS.contains(sort) ? sort : "createdAt"; //만약 Allowed_sorts안에 sort 있으면 그 값 쓰고 없으면 createdAt쓰자

        //검색 결과를 몇개씩 어떤 순서로 보여줄지
        Pageable pageable = PageRequest.of(page, size, Sort.by(d, key));
        return searchService.searchPosts(q, region, tag, pageable);
    }

}
