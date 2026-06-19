package com.studysync.dto;

public class ProfileUpdateRequest {
    private String name;
    private String department;
    private int year;
    private String password;

    public ProfileUpdateRequest() {}

    public ProfileUpdateRequest(String name, String department, int year, String password) {
        this.name = name;
        this.department = department;
        this.year = year;
        this.password = password;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
