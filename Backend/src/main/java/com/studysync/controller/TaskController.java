package com.studysync.controller;

import com.studysync.dto.ApiResponse;
import com.studysync.dto.TaskRequest;
import com.studysync.model.StudyGroup;
import com.studysync.model.StudyTask;
import com.studysync.model.TaskStatus;
import com.studysync.model.User;
import com.studysync.repository.StudyGroupRepository;
import com.studysync.repository.StudyTaskRepository;
import com.studysync.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final StudyTaskRepository studyTaskRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final UserRepository userRepository;

    public TaskController(
            StudyTaskRepository studyTaskRepository,
            StudyGroupRepository studyGroupRepository,
            UserRepository userRepository
    ) {
        this.studyTaskRepository = studyTaskRepository;
        this.studyGroupRepository = studyGroupRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<ApiResponse<List<StudyTask>>> getTasksByGroupId(@PathVariable Long groupId) {
        List<StudyTask> tasks = studyTaskRepository.findByGroup_Id(groupId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tasks loaded", tasks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudyTask>> getTaskById(@PathVariable Long id) {
        StudyTask task = studyTaskRepository.findById(id).orElse(null);
        if (task == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Task not found"));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Task loaded", task));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudyTask>> createTask(Principal principal, @RequestBody TaskRequest request) {
        if (principal == null) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "Unauthorized"));
        }
        User createdBy = userRepository.findByEmail(principal.getName()).orElse(null);
        if (createdBy == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Creator user not found"));
        }
        StudyGroup group = studyGroupRepository.findById(request.getGroupId()).orElse(null);
        if (group == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Study group not found"));
        }
        User assignedTo = userRepository.findById(request.getAssignedToUserId()).orElse(null);
        if (assignedTo == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Assignee user not found"));
        }

        TaskStatus status;
        try {
            status = TaskStatus.valueOf(request.getStatus().toUpperCase());
        } catch (Exception e) {
            status = TaskStatus.PENDING;
        }

        StudyTask task = new StudyTask(
                request.getTitle(),
                request.getDescription(),
                request.getDeadline(),
                status,
                assignedTo,
                createdBy,
                group
        );

        StudyTask saved = studyTaskRepository.save(task);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task assigned successfully!", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudyTask>> updateTask(
            Principal principal,
            @PathVariable Long id,
            @RequestBody TaskRequest request
    ) {
        StudyTask task = studyTaskRepository.findById(id).orElse(null);
        if (task == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Task not found"));
        }

        StudyGroup group = studyGroupRepository.findById(request.getGroupId()).orElse(null);
        if (group == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Study group not found"));
        }
        User assignedTo = userRepository.findById(request.getAssignedToUserId()).orElse(null);
        if (assignedTo == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Assignee user not found"));
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDeadline(request.getDeadline());

        try {
            task.setStatus(TaskStatus.valueOf(request.getStatus().toUpperCase()));
        } catch (Exception e) {
            task.setStatus(TaskStatus.PENDING);
        }

        task.setAssignedTo(assignedTo);
        task.setGroup(group);

        StudyTask saved = studyTaskRepository.save(task);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task updated successfully!", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        if (!studyTaskRepository.existsById(id)) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Task not found"));
        }
        studyTaskRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task deleted successfully"));
    }
}
