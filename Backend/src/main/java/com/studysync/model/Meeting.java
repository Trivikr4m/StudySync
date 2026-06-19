package com.studysync.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "meetings")
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String meetingDate;

    @Column(nullable = false)
    private String meetingTime;

    @Column(nullable = false)
    private String location;

    @ManyToOne
    @JoinColumn(name = "study_group_id", nullable = false)
    private StudyGroup group;

    @ManyToOne
    @JoinColumn(name = "host_user_id", nullable = false)
    private User host;

    private LocalDateTime createdDate;

    public Meeting() {
        this.createdDate = LocalDateTime.now();
    }

    public Meeting(String title, String description, String meetingDate, String meetingTime, String location, StudyGroup group, User host) {
        this.title = title;
        this.description = description;
        this.meetingDate = meetingDate;
        this.meetingTime = meetingTime;
        this.location = location;
        this.group = group;
        this.host = host;
        this.createdDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public StudyGroup getGroup() { return group; }
    public void setGroup(StudyGroup group) { this.group = group; }
    public User getHost() { return host; }
    public void setHost(User host) { this.host = host; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public String getGroupName() {
        return group != null ? group.getGroupName() : null;
    }

    public String getHostName() {
        return host != null ? host.getName() : null;
    }

    public Long getGroupId() {
        return group != null ? group.getId() : null;
    }
}
