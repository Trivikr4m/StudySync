package com.studysync.controller;

import com.studysync.dto.ApiResponse;
import com.studysync.dto.DashboardStatsResponse;
import com.studysync.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final StudyGroupRepository studyGroupRepository;
    private final MeetingRepository meetingRepository;
    private final StudyTaskRepository studyTaskRepository;
    private final ResourceRepository resourceRepository;
    private final AnnouncementRepository announcementRepository;

    public DashboardController(
            StudyGroupRepository studyGroupRepository,
            MeetingRepository meetingRepository,
            StudyTaskRepository studyTaskRepository,
            ResourceRepository resourceRepository,
            AnnouncementRepository announcementRepository
    ) {
        this.studyGroupRepository = studyGroupRepository;
        this.meetingRepository = meetingRepository;
        this.studyTaskRepository = studyTaskRepository;
        this.resourceRepository = resourceRepository;
        this.announcementRepository = announcementRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        long totalGroups = studyGroupRepository.count();
        long totalMeetings = meetingRepository.count();
        long totalTasks = studyTaskRepository.count();
        long totalResources = resourceRepository.count();
        long totalAnnouncements = announcementRepository.count();

        DashboardStatsResponse stats = new DashboardStatsResponse(
                totalGroups,
                totalMeetings,
                totalTasks,
                totalResources,
                totalAnnouncements
        );

        return ResponseEntity.ok(new ApiResponse<>(true, "Dashboard stats loaded", stats));
    }
}
