package com.gowhere.backend.controller;

import com.gowhere.backend.service.FileUploadService;
import com.gowhere.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class FileUploadController {

    private FileUploadService fileUploadService;
    private UserService userService;

    @PostMapping("/profile-image")
    public ResponseEntity<Map<String, String>> uploadProfileImage(@RequestParam("file")MultipartFile file){
        String url = fileUploadService.uploadFile(file, "profile");
        userService.updateProfileImage(url);

        return ResponseEntity.ok(Map.of("url",url));
    }
}
