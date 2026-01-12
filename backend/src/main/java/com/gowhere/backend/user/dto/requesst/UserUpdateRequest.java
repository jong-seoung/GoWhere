package com.gowhere.backend.user.dto.requesst;

import com.gowhere.backend.social.SocialLinkRequest;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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

    private List<SocialLinkRequest> socialLinks;
}