package com.gowhere.backend.service;

import com.gowhere.backend.entity.User;
import com.gowhere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;

    public void updateProfileImage(String url){
        User currentUser = authenticationService.getCurrentUser();

        currentUser.setProfileImageUrl("/" + url);

        userRepository.save(currentUser);
    }
}
