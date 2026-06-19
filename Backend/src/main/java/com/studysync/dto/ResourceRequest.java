package com.studysync.dto;

public class ResourceRequest {
    private String title;
    private String description;
    private String fileUrl;
    private Long groupId;

    public ResourceRequest() {}

    public ResourceRequest(String title, String description, String fileUrl, Long groupId) {
        this.title = title;
        this.description = description;
        this.fileUrl = fileUrl;
        this.groupId = groupId;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
}
