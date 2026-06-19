package com.studysync.dto;

public class AnnouncementRequest {
    private String title;
    private String content;
    private Long groupId;

    public AnnouncementRequest() {}

    public AnnouncementRequest(String title, String content, Long groupId) {
        this.title = title;
        this.content = content;
        this.groupId = groupId;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
}
