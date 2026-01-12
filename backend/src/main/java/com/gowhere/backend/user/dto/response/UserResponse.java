package com.gowhere.backend.user.dto.response;

import com.gowhere.backend.social.SocialLink;
import com.gowhere.backend.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String profileImageUrl;
    private String bio;
    private List<SocialLink> socialLinks;

    private String accessToken;
    private String refreshToken;

    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .profileImageUrl(user.getProfileImageUrl())
                .bio(user.getBio())
                .socialLinks(user.getSocialLinks())
                .build();
    }
}