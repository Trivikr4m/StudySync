package com.studysync.controller;

import com.studysync.dto.ApiResponse;
import com.studysync.dto.MeetingRequest;
import com.studysync.model.Meeting;
import com.studysync.model.StudyGroup;
import com.studysync.model.User;
import com.studysync.repository.MeetingRepository;
import com.studysync.repository.StudyGroupRepository;
import com.studysync.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/meetings")
public class MeetingController {

    private final MeetingRepository meetingRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final UserRepository userRepository;

    public MeetingController(
            MeetingRepository meetingRepository,
            StudyGroupRepository studyGroupRepository,
            UserRepository userRepository
    ) {
        this.meetingRepository = meetingRepository;
        this.studyGroupRepository = studyGroupRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Meeting>>> getAllMeetings(@RequestParam(required = false) Long groupId) {
        List<Meeting> meetings;
        if (groupId != null) {
            meetings = meetingRepository.findByGroup_Id(groupId);
        } else {
            meetings = meetingRepository.findAll();
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Meetings loaded", meetings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Meeting>> getMeetingById(@PathVariable Long id) {
        Meeting meeting = meetingRepository.findById(id).orElse(null);
        if (meeting == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Meeting not found"));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Meeting loaded", meeting));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Meeting>> createMeeting(Principal principal, @RequestBody MeetingRequest request) {
        if (principal == null) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "Unauthorized"));
        }
        User host = userRepository.findByEmail(principal.getName()).orElse(null);
        if (host == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Host user not found"));
        }
        StudyGroup group = studyGroupRepository.findById(request.getGroupId()).orElse(null);
        if (group == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Study group not found"));
        }

        Meeting meeting = new Meeting(
                request.getTitle(),
                request.getDescription(),
                request.getMeetingDate(),
                request.getMeetingTime(),
                request.getLocation(),
                group,
                host
        );

        Meeting saved = meetingRepository.save(meeting);
        return ResponseEntity.ok(new ApiResponse<>(true, "Meeting scheduled successfully!", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Meeting>> updateMeeting(
            Principal principal,
            @PathVariable Long id,
            @RequestBody MeetingRequest request
    ) {
        Meeting meeting = meetingRepository.findById(id).orElse(null);
        if (meeting == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Meeting not found"));
        }

        StudyGroup group = studyGroupRepository.findById(request.getGroupId()).orElse(null);
        if (group == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Study group not found"));
        }

        meeting.setTitle(request.getTitle());
        meeting.setDescription(request.getDescription());
        meeting.setMeetingDate(request.getMeetingDate());
        meeting.setMeetingTime(request.getMeetingTime());
        meeting.setLocation(request.getLocation());
        meeting.setGroup(group);

        Meeting saved = meetingRepository.save(meeting);
        return ResponseEntity.ok(new ApiResponse<>(true, "Meeting updated successfully!", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMeeting(@PathVariable Long id) {
        if (!meetingRepository.existsById(id)) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Meeting not found"));
        }
        meetingRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Meeting cancelled and deleted successfully"));
    }
}
