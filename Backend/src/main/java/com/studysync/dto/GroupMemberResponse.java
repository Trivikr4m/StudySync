package com.studysync.dto;

import com.studysync.model.MemberStatus;

public class GroupMemberResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private MemberStatus status;

    public GroupMemberResponse() {}

    public GroupMemberResponse(Long id, Long userId, String userName, String userEmail, MemberStatus status) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public MemberStatus getStatus() { return status; }
    public void setStatus(MemberStatus status) { this.status = status; }
}
