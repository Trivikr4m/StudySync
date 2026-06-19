package com.studysync.controller;

import com.studysync.dto.ApiResponse;
import com.studysync.dto.ResourceRequest;
import com.studysync.model.Resource;
import com.studysync.model.StudyGroup;
import com.studysync.model.User;
import com.studysync.repository.ResourceRepository;
import com.studysync.repository.StudyGroupRepository;
import com.studysync.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/resources")
public class ResourceController {

    private final ResourceRepository resourceRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final UserRepository userRepository;

    public ResourceController(
            ResourceRepository resourceRepository,
            StudyGroupRepository studyGroupRepository,
            UserRepository userRepository
    ) {
        this.resourceRepository = resourceRepository;
        this.studyGroupRepository = studyGroupRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<ApiResponse<List<Resource>>> getResourcesByGroupId(@PathVariable Long groupId) {
        List<Resource> resources = resourceRepository.findByGroup_Id(groupId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Resources loaded", resources));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Resource>> uploadResource(Principal principal, @RequestBody ResourceRequest request) {
        if (principal == null) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "Unauthorized"));
        }
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Uploader user not found"));
        }
        StudyGroup group = studyGroupRepository.findById(request.getGroupId()).orElse(null);
        if (group == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Study group not found"));
        }

        Resource resource = new Resource(
                request.getTitle(),
                request.getDescription(),
                request.getFileUrl(),
                group,
                user
        );

        Resource saved = resourceRepository.save(resource);
        return ResponseEntity.ok(new ApiResponse<>(true, "Resource cataloged successfully!", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResource(@PathVariable Long id) {
        if (!resourceRepository.existsById(id)) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Resource not found"));
        }
        resourceRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Resource deleted successfully"));
    }
}
