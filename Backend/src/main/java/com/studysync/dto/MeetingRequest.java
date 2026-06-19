package com.studysync.dto;

public class MeetingRequest {
    private String title;
    private String description;
    private String meetingDate;
    private String meetingTime;
    private String location;
    private Long groupId;

    public MeetingRequest() {}

    public MeetingRequest(String title, String description, String meetingDate, String meetingTime, String location, Long groupId) {
        this.title = title;
        this.description = description;
        this.meetingDate = meetingDate;
        this.meetingTime = meetingTime;
        this.location = location;
        this.groupId = groupId;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getMeetingDate() { return meetingDate; }
    public void setMeetingDate(String meetingDate) { this.meetingDate = meetingDate; }
    public String getMeetingTime() { return meetingTime; }
    public void setMeetingTime(String meetingTime) { this.meetingTime = meetingTime; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
}
