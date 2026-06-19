package com.studysync.dto;

public class DashboardStatsResponse {
    private long totalStudyGroups;
    private long totalMeetings;
    private long totalTasks;
    private long totalResources;
    private long totalAnnouncements;

    public DashboardStatsResponse() {}

    public DashboardStatsResponse(long totalStudyGroups, long totalMeetings, long totalTasks, long totalResources, long totalAnnouncements) {
        this.totalStudyGroups = totalStudyGroups;
        this.totalMeetings = totalMeetings;
        this.totalTasks = totalTasks;
        this.totalResources = totalResources;
        this.totalAnnouncements = totalAnnouncements;
    }

    public long getTotalStudyGroups() { return totalStudyGroups; }
    public void setTotalStudyGroups(long totalStudyGroups) { this.totalStudyGroups = totalStudyGroups; }
    public long getTotalMeetings() { return totalMeetings; }
    public void setTotalMeetings(long totalMeetings) { this.totalMeetings = totalMeetings; }
    public long getTotalTasks() { return totalTasks; }
    public void setTotalTasks(long totalTasks) { this.totalTasks = totalTasks; }
    public long getTotalResources() { return totalResources; }
    public void setTotalResources(long totalResources) { this.totalResources = totalResources; }
    public long getTotalAnnouncements() { return totalAnnouncements; }
    public void setTotalAnnouncements(long totalAnnouncements) { this.totalAnnouncements = totalAnnouncements; }
}
