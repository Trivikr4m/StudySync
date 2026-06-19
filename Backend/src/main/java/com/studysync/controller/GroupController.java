package com.studysync.controller;

import com.studysync.dto.ApiResponse;
import com.studysync.dto.GroupMemberResponse;
import com.studysync.dto.GroupRequest;
import com.studysync.model.GroupMember;
import com.studysync.model.MemberStatus;
import com.studysync.model.StudyGroup;
import com.studysync.model.User;
import com.studysync.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/groups")
public class GroupController {

    private final StudyGroupRepository studyGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private final MeetingRepository meetingRepository;
    private final StudyTaskRepository studyTaskRepository;
    private final AnnouncementRepository announcementRepository;
    private final ResourceRepository resourceRepository;

    public GroupController(
            StudyGroupRepository studyGroupRepository,
            GroupMemberRepository groupMemberRepository,
            UserRepository userRepository,
            MeetingRepository meetingRepository,
            StudyTaskRepository studyTaskRepository,
            AnnouncementRepository announcementRepository,
            ResourceRepository resourceRepository
    ) {
        this.studyGroupRepository = studyGroupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
        this.meetingRepository = meetingRepository;
        this.studyTaskRepository = studyTaskRepository;
        this.announcementRepository = announcementRepository;
        this.resourceRepository = resourceRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<StudyGroup>>> getAllGroups(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<StudyGroup> groupPage = studyGroupRepository.findByFilters(subject, department, year, pageable);

        // Populate transient currentMembers field
        groupPage.forEach(group -> {
            long count = groupMemberRepository.countByGroup_IdAndStatus(group.getId(), MemberStatus.APPROVED);
            group.setCurrentMembers(count);
        });

        return ResponseEntity.ok(new ApiResponse<>(true, "Study groups fetched successfully", groupPage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudyGroup>> getGroupById(@PathVariable Long id) {
        StudyGroup group = studyGroupRepository.findById(id).orElse(null);
        if (group == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Study group not found"));
        }
        long count = groupMemberRepository.countByGroup_IdAndStatus(group.getId(), MemberStatus.APPROVED);
        group.setCurrentMembers(count);
        return ResponseEntity.ok(new ApiResponse<>(true, "Study group loaded", group));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ApiResponse<StudyGroup>> createGroup(Principal principal, @RequestBody GroupRequest request) {
        if (principal == null) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "Unauthorized"));
        }
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "User not found"));
        }

        StudyGroup group = new StudyGroup(
                request.getGroupName(),
                request.getSubject(),
                request.getDescription(),
                request.getMaxMembers(),
                user.getDepartment(), // Inherited automatically from creator's profile
                user.getYear(),       // Inherited automatically from creator's profile
                user
        );

        StudyGroup savedGroup = studyGroupRepository.save(group);

        // Automatically add creator as an APPROVED member
        GroupMember creatorMember = new GroupMember(savedGroup, user, MemberStatus.APPROVED);
        groupMemberRepository.save(creatorMember);

        savedGroup.setCurrentMembers(1);

        return ResponseEntity.ok(new ApiResponse<>(true, "Study group created successfully!", savedGroup));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudyGroup>> updateGroup(
            @PathVariable Long id,
            @RequestBody GroupRequest request
    ) {
        StudyGroup group = studyGroupRepository.findById(id).orElse(null);
        if (group == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Study group not found"));
        }

        group.setGroupName(request.getGroupName());
        group.setSubject(request.getSubject());
        group.setDescription(request.getDescription());
        group.setMaxMembers(request.getMaxMembers());

        studyGroupRepository.save(group);

        long count = groupMemberRepository.countByGroup_IdAndStatus(group.getId(), MemberStatus.APPROVED);
        group.setCurrentMembers(count);

        return ResponseEntity.ok(new ApiResponse<>(true, "Study group updated successfully!", group));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteGroup(@PathVariable Long id) {
        if (!studyGroupRepository.existsById(id)) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Study group not found"));
        }
        // Delete dependent entities to avoid foreign key constraint violations
        meetingRepository.deleteAll(meetingRepository.findByGroup_Id(id));
        studyTaskRepository.deleteAll(studyTaskRepository.findByGroup_Id(id));
        announcementRepository.deleteAll(announcementRepository.findByGroup_Id(id));
        resourceRepository.deleteAll(resourceRepository.findByGroup_Id(id));
        groupMemberRepository.deleteAll(groupMemberRepository.findByGroup_Id(id));

        studyGroupRepository.deleteById(id);

        return ResponseEntity.ok(new ApiResponse<>(true, "Study group deleted successfully"));
    }

    @PostMapping("/{groupId}/join")
    public ResponseEntity<ApiResponse<Void>> joinGroup(Principal principal, @PathVariable Long groupId) {
        if (principal == null) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "Unauthorized"));
        }
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "User not found"));
        }
        StudyGroup group = studyGroupRepository.findById(groupId).orElse(null);
        if (group == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Study group not found"));
        }

        Optional<GroupMember> existing = groupMemberRepository.findByGroup_IdAndUser_Id(groupId, user.getId());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "You have already requested to join or are a member"));
        }

        long approvedCount = groupMemberRepository.countByGroup_IdAndStatus(groupId, MemberStatus.APPROVED);
        if (approvedCount >= group.getMaxMembers()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Study group is already full"));
        }

        // Student joins as PENDING (requires creator approval)
        GroupMember request = new GroupMember(group, user, MemberStatus.PENDING);
        groupMemberRepository.save(request);

        return ResponseEntity.ok(new ApiResponse<>(true, "Join request submitted successfully!"));
    }

    @DeleteMapping("/{groupId}/leave")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> leaveGroup(Principal principal, @PathVariable Long groupId) {
        if (principal == null) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "Unauthorized"));
        }
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "User not found"));
        }

        GroupMember membership = groupMemberRepository.findByGroup_IdAndUser_Id(groupId, user.getId()).orElse(null);
        if (membership == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Not a member of this study group"));
        }

        groupMemberRepository.delete(membership);
        return ResponseEntity.ok(new ApiResponse<>(true, "You have left the study group."));
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<ApiResponse<List<GroupMemberResponse>>> getGroupMembers(@PathVariable Long groupId) {
        List<GroupMember> members = groupMemberRepository.findByGroup_Id(groupId);
        List<GroupMemberResponse> responseList = members.stream()
                .map(m -> new GroupMemberResponse(
                        m.getId(),
                        m.getUser().getId(),
                        m.getUser().getName(),
                        m.getUser().getEmail(),
                        m.getStatus()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(new ApiResponse<>(true, "Members list loaded", responseList));
    }

    @PutMapping("/{groupId}/approve/{memberId}")
    public ResponseEntity<ApiResponse<Void>> approveMember(@PathVariable Long groupId, @PathVariable Long memberId) {
        GroupMember member = groupMemberRepository.findById(memberId).orElse(null);
        if (member == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Membership request not found"));
        }

        member.setStatus(MemberStatus.APPROVED);
        groupMemberRepository.save(member);

        return ResponseEntity.ok(new ApiResponse<>(true, "Membership request approved!"));
    }

    @PutMapping("/{groupId}/reject/{memberId}")
    public ResponseEntity<ApiResponse<Void>> rejectMember(@PathVariable Long groupId, @PathVariable Long memberId) {
        GroupMember member = groupMemberRepository.findById(memberId).orElse(null);
        if (member == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Membership request not found"));
        }

        member.setStatus(MemberStatus.REJECTED);
        groupMemberRepository.save(member);

        return ResponseEntity.ok(new ApiResponse<>(true, "Membership request rejected!"));
    }
}
