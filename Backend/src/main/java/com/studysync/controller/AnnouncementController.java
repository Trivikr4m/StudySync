package com.studysync.controller;

import com.studysync.dto.ApiResponse;
import com.studysync.dto.AnnouncementRequest;
import com.studysync.model.Announcement;
import com.studysync.model.StudyGroup;
import com.studysync.model.User;
import com.studysync.repository.AnnouncementRepository;
import com.studysync.repository.StudyGroupRepository;
import com.studysync.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/announcements")
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final UserRepository userRepository;

    public AnnouncementController(
            AnnouncementRepository announcementRepository,
            StudyGroupRepository studyGroupRepository,
            UserRepository userRepository
    ) {
        this.announcementRepository = announcementRepository;
        this.studyGroupRepository = studyGroupRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<ApiResponse<List<Announcement>>> getAnnouncementsByGroupId(@PathVariable Long groupId) {
        List<Announcement> announcements = announcementRepository.findByGroup_Id(groupId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Announcements loaded", announcements));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Announcement>> createAnnouncement(Principal principal, @RequestBody AnnouncementRequest request) {
        if (principal == null) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "Unauthorized"));
        }
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Creator user not found"));
        }
        StudyGroup group = studyGroupRepository.findById(request.getGroupId()).orElse(null);
        if (group == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Study group not found"));
        }

        Announcement announcement = new Announcement(
                request.getTitle(),
                request.getContent(),
                group,
                user
        );

        Announcement saved = announcementRepository.save(announcement);
        return ResponseEntity.ok(new ApiResponse<>(true, "Announcement posted successfully!", saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Announcement>> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody AnnouncementRequest request
    ) {
        Announcement announcement = announcementRepository.findById(id).orElse(null);
        if (announcement == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Announcement not found"));
        }

        StudyGroup group = studyGroupRepository.findById(request.getGroupId()).orElse(null);
        if (group == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Study group not found"));
        }

        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        announcement.setGroup(group);

        Announcement saved = announcementRepository.save(announcement);
        return ResponseEntity.ok(new ApiResponse<>(true, "Announcement updated successfully!", saved));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAnnouncement(@PathVariable Long id) {
        if (!announcementRepository.existsById(id)) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Announcement not found"));
        }
        announcementRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Announcement deleted successfully"));
    }
}
