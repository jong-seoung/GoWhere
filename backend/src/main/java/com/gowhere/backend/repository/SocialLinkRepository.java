package com.gowhere.backend.repository;

import com.gowhere.backend.social.SocialLink;
import com.gowhere.backend.social.SocialType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {
    Optional<SocialLink> findByUserIdAndSocialType(Long userId, SocialType socialType);
}
