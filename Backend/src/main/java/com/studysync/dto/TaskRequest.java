package com.studysync.dto;

public class TaskRequest {
    private String title;
    private String description;
    private String deadline;
    private String status;
    private Long assignedToUserId;
    private Long groupId;

    public TaskRequest() {}

    public TaskRequest(String title, String description, String deadline, String status, Long assignedToUserId, Long groupId) {
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.status = status;
        this.assignedToUserId = assignedToUserId;
        this.groupId = groupId;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getAssignedToUserId() { return assignedToUserId; }
    public void setAssignedToUserId(Long assignedToUserId) { this.assignedToUserId = assignedToUserId; }
    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
}
