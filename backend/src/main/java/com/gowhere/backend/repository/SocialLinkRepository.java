package com.gowhere.backend.repository;

import com.gowhere.backend.entity.SocialLink;
import com.gowhere.backend.entity.SocialType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {
    Optional<SocialLink> findByUserIdAndSocialType(Long userId, SocialType socialType);
}
