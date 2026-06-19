package com.studysync.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String fileUrl;

    private String fileType;

    @ManyToOne
    @JoinColumn(name = "study_group_id", nullable = false)
    private StudyGroup group;

    @ManyToOne
    @JoinColumn(name = "uploaded_by_user_id", nullable = false)
    private User uploadedBy;

    private LocalDateTime createdDate;

    public Resource() {
        this.createdDate = LocalDateTime.now();
    }

    public Resource(String title, String description, String fileUrl, StudyGroup group, User uploadedBy) {
        this.title = title;
        this.description = description;
        this.fileUrl = fileUrl;
        this.group = group;
        this.uploadedBy = uploadedBy;
        this.fileType = determineFileType(fileUrl);
        this.createdDate = LocalDateTime.now();
    }

    public void updateFileType() {
        this.fileType = determineFileType(this.fileUrl);
    }

    private String determineFileType(String url) {
        if (url == null) return "File";
        String lowerUrl = url.toLowerCase();
        if (lowerUrl.endsWith(".pdf") || lowerUrl.contains("pdf")) return "PDF";
        if (lowerUrl.contains("google.com/spreadsheets") || lowerUrl.contains(".xlsx") || lowerUrl.contains(".xls") || lowerUrl.contains(".csv")) return "Spreadsheet";
        if (lowerUrl.contains("google.com/presentation") || lowerUrl.contains(".pptx") || lowerUrl.contains(".ppt")) return "Presentation";
        if (lowerUrl.contains("google.com/document") || lowerUrl.contains(".docx") || lowerUrl.contains(".doc") || lowerUrl.contains(".txt")) return "Document";
        if (lowerUrl.startsWith("http") && !lowerUrl.contains("drive.google.com/file") && !lowerUrl.contains("dropbox.com")) return "Link";
        return "File";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { 
        this.fileUrl = fileUrl;
        this.fileType = determineFileType(fileUrl);
    }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public StudyGroup getGroup() { return group; }
    public void setGroup(StudyGroup group) { this.group = group; }
    public User getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(User uploadedBy) { this.uploadedBy = uploadedBy; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
}
