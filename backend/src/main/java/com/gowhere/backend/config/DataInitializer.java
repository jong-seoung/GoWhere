package com.gowhere.backend.config;

import com.gowhere.backend.entity.TravelPost;
import com.gowhere.backend.repository.TravelPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final TravelPostRepository travelPostRepository;

    @Override
    @Transactional
    public void run(String... args) {
        // 이미 데이터가 있으면 스킵
        if (travelPostRepository.count() > 0) return;

        List<TravelPost> samples = List.of(
                TravelPost.builder()
                        .title("제주도 한라산 설경")
                        .content("한라산 등반 중 찍은 설경 사진! 정말 아름다웠다.")
                        .region("제주")
                        .tags("#자연,#등산,#겨울")
                        .thumbnailUrl("https://example.com/jeju.jpg")
                        .likeCount(15)
                        .viewCount(220L)
                        .ratingAvg(4.8)
                        .createdAt(LocalDateTime.now().minusDays(3))
                        .build(),

                TravelPost.builder()
                        .title("부산 광안리 밤바다")
                        .content("광안대교 야경은 언제 봐도 감동.")
                        .region("부산")
                        .tags("#바다,#야경,#힐링")
                        .thumbnailUrl("https://example.com/busan.jpg")
                        .likeCount(27)
                        .viewCount(470L)
                        .ratingAvg(4.6)
                        .createdAt(LocalDateTime.now().minusDays(2))
                        .build(),

                TravelPost.builder()
                        .title("서울 당일치기 여행 루트")
                        .content("경복궁 → 서촌 → 남산타워 코스 추천.")
                        .region("서울")
                        .tags("#서울,#도심,#데이트")
                        .thumbnailUrl("https://example.com/seoul.jpg")
                        .likeCount(8)
                        .viewCount(150L)
                        .ratingAvg(4.0)
                        .createdAt(LocalDateTime.now().minusDays(1))
                        .build()
        );

        travelPostRepository.saveAll(samples);
        System.out.println("✅ 샘플 TravelPost 3개 저장 완료!");
    }
}
