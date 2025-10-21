package com.gowhere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

//
public class CommentResponse {

    private Long id;
    private String content;
    private String authorName;
    private Long reviewId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
