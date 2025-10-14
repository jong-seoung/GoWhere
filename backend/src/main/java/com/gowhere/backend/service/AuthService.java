package com.gowhere.backend.service;

import com.gowhere.backend.dto.*;
import com.gowhere.backend.entity.AuthProvider;
import com.gowhere.backend.entity.User;
import com.gowhere.backend.exception.AuthenticationException;
import com.gowhere.backend.exception.BadRequestException;
import com.gowhere.backend.exception.UserAlreadyExistsException;
import com.gowhere.backend.repository.UserRepository;
import com.gowhere.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if(userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .provider(AuthProvider.LOCAL)
                .build();

        user = userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .user(UserDto.fromEntity(user))
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        try {
            String loginId = request.getEmail() != null ? request.getEmail() : request.getUsername();

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginId,
                            request.getPassword()
                    )
            );

            User user = userRepository.findByEmail(loginId)
                    .or(() -> userRepository.findByUsername(loginId))
                    .orElseThrow(() -> new AuthenticationException("Authentication failed"));

            String jwtToken = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            return AuthResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .user(UserDto.fromEntity(user))
                    .build();
        } catch (BadRequestException e) {
            throw new AuthenticationException("Invalid email or password");
        }
    }

    public AuthResponse refreshToken(RefreshTokenRequest request){
        String refreshToken = request.getRefreshToken();

        String username = jwtService.extractUsername(refreshToken);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AuthenticationException("User not found"));

        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new AuthenticationException("Invalid or expired refresh token");
        }

        String jwtToken = jwtService.generateToken(user);
        String NewRefreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(NewRefreshToken)
                .user(UserDto.fromEntity(user))
                .build();
    };
}
