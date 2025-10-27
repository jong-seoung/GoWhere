package com.gowhere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {

    private Long id;
    private String content;
    private String authorName;
    private Long reviewId;
    private Long parentCommentId;  // 대댓글의 부모 댓글 ID
    private List<CommentResponse> replies;  // 대댓글 목록
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}