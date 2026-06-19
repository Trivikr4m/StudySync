package com.studysync.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_groups")
public class StudyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String groupName;

    @Column(nullable = false)
    private String subject;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private int maxMembers;

    private String department;

    @Column(name = "academic_year")
    private int year;

    @Transient
    private long currentMembers;

    @ManyToOne
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdBy;

    private LocalDateTime createdDate;

    public StudyGroup() {
        this.createdDate = LocalDateTime.now();
    }

    public StudyGroup(String groupName, String subject, String description, int maxMembers, String department, int year, User createdBy) {
        this.groupName = groupName;
        this.subject = subject;
        this.description = description;
        this.maxMembers = maxMembers;
        this.department = department;
        this.year = year;
        this.createdBy = createdBy;
        this.createdDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getMaxMembers() { return maxMembers; }
    public void setMaxMembers(int maxMembers) { this.maxMembers = maxMembers; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
    public long getCurrentMembers() { return currentMembers; }
    public void setCurrentMembers(long currentMembers) { this.currentMembers = currentMembers; }
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
}
