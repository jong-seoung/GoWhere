package com.gowhere.backend.user.controller;

import com.gowhere.backend.user.dto.response.UserResponse;
import com.gowhere.backend.user.dto.requesst.UserUpdateRequest;
import com.gowhere.backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId){
        UserResponse user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> UpdateUser(@Valid @RequestBody UserUpdateRequest request){
        UserResponse updatedUser = userService.updateProfile(request);

        return ResponseEntity.ok(updatedUser);

    }
}