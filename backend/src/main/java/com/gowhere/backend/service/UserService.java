package com.gowhere.backend.service;

import com.gowhere.backend.dto.SocialLinkRequest;
import com.gowhere.backend.dto.UserResponse;
import com.gowhere.backend.dto.UserUpdateRequest;
import com.gowhere.backend.entity.SocialLink;
import com.gowhere.backend.entity.SocialType;
import com.gowhere.backend.entity.User;
import com.gowhere.backend.exception.ResourceNotFoundException;
import com.gowhere.backend.repository.SocialLinkRepository;
import com.gowhere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final SocialLinkRepository socialLinkRepository;

    public void updateProfileImage(String url){
        User currentUser = authenticationService.getCurrentUser();

        currentUser.setProfileImageUrl("/" + url);

        userRepository.save(currentUser);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with userID: " + userId));

        return UserResponse.fromEntity(user);
    }

    public UserResponse updateProfile(UserUpdateRequest request){
        User currentUser = authenticationService.getCurrentUser();

        currentUser.setFullName(request.getFullName());
        currentUser.setBio(request.getBio());

        if (request.getProfileImageUrl() != null) {
            currentUser.setProfileImageUrl(request.getProfileImageUrl());
        }

        if (request.getSocialLinks() != null){
            for(SocialLinkRequest linkRequest: request.getSocialLinks()){
                if (linkRequest.getUrl() == null || linkRequest.getUrl().trim().isEmpty()) {
                    socialLinkRepository
                            .findByUserIdAndSocialType(
                                    currentUser.getId(),
                                    SocialType.valueOf(linkRequest.getSocialType())
                            )
                            .ifPresent(socialLinkRepository::delete);
                    continue;
                }

                SocialLink link = socialLinkRepository
                        .findByUserIdAndSocialType(currentUser.getId(), SocialType.valueOf(linkRequest.getSocialType()))
                        .orElseGet(() -> {
                            SocialLink newLink = new SocialLink();
                            newLink.setUser(currentUser);
                            newLink.setSocialType(SocialType.valueOf(linkRequest.getSocialType()));
                            return newLink;
                        });
                link.setUrl(linkRequest.getUrl());
                socialLinkRepository.save(link);
            }
        }
        User updatedUser = userRepository.save(currentUser);
        return UserResponse.fromEntity(updatedUser);
    }
}
