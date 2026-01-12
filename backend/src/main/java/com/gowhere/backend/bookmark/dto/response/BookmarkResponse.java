package com.gowhere.backend.bookmark.dto.response;

import com.gowhere.backend.bookmark.entity.Bookmark;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkResponse {

    private Long id;
    private Long userId;
    private Long reviewId;
    private Long tripId;
    private Boolean isBookmark;
    private String placeName;
    private String reviewContent;

    public BookmarkResponse(Bookmark bookmark) {
        this.id = bookmark.getId();
        this.userId = bookmark.getUser() != null ? bookmark.getUser().getId() : null;
        this.reviewId = bookmark.getReview() != null ? bookmark.getReview().getId() : null;
        this.tripId = bookmark.getTrip() != null ? bookmark.getTrip().getId() : null;
        this.isBookmark = bookmark.getIsBookmark();
        this.placeName = bookmark.getPlaceName();
        this.reviewContent = bookmark.getReview() != null ? bookmark.getReview().getContent() : null;
    }
}