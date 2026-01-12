package com.gowhere.backend.auth.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.gowhere.backend.user.dto.response.UserDto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("refresh_token")
    private String refreshToken;

    private UserDto user;
}