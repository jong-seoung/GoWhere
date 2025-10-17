package com.gowhere.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {
    @Size(max = 50, message = "Full name must be less than 50 characters")
    private String fullName;

    @Size(max = 150, message = "Bio must be less than 150 characters")
    private String bio;

    private String profileImageUrl;
}