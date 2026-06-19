package com.studysync.dto;

public class GroupRequest {
    private String groupName;
    private String subject;
    private String description;
    private int maxMembers;

    public GroupRequest() {}

    public GroupRequest(String groupName, String subject, String description, int maxMembers) {
        this.groupName = groupName;
        this.subject = subject;
        this.description = description;
        this.maxMembers = maxMembers;
    }

    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getMaxMembers() { return maxMembers; }
    public void setMaxMembers(int maxMembers) { this.maxMembers = maxMembers; }
}
